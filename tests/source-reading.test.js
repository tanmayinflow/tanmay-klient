import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as sourcePolicy from '../src/shared/product/sources.js';

const compile = source => ts.transpileModule(source, { compilerOptions: {
  jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
} }).outputText;
const source = readFileSync(new URL('../src/shared/ui/sources.jsx', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const theme = { heading: '#222', text: '#222', textSec: '#444', textMuted: '#555', accent: '#743627', borderSoft: '#ccc', bg: '#fff' };
const noop = () => null, L = cs => cs;
const module = { exports: {} };
vm.runInNewContext(compile(source), { module, exports: module.exports, require: id => {
  if (id === 'react') return React;
  if (id.endsWith('/sources.js')) return sourcePolicy;
  return { SourceLinks: noop, TmIcon: noop, SourceCover: noop, DateField: noop };
} });

function detail(entry, study = false) {
  let editor;
  const writes = [];
  const { ContentDetail } = module.exports.createSourcesUI({
    useT: () => ({ t: theme }), useStore: () => ({ coll: { content: [entry] }, hasCoachSources: () => true,
      updateEntry: (...args) => writes.push(['own', ...args]), updateSourceNote: (...args) => writes.push(['private', ...args]),
    }), L, hexA: value => value, imgSrc: value => value, typeGlyph: () => noop, iconBtn: () => ({}),
    PinToggle: noop, Tag: noop, Select: noop, PropRow: ({ children }) => children,
    RichArea: props => { editor = props; return React.createElement('div', { 'data-editor': true }, props.value); },
    NotesReader: noop, AttachmentStrip: noop, ClipIcon: noop,
    C_PROG_COLOR: {}, C_TYPE_COLOR: {}, C_CATS_BY_TYPE: {}, C_CATS: [], C_PROG_LABEL: value => value, C_TYPE_LABEL: value => value,
  });
  const html = renderToStaticMarkup(React.createElement(ContentDetail, { id: entry.id, study, onStudy: noop }));
  return { html, editor, writes };
}

for (const study of [false, true]) {
  test(`Sources offers paged reading for plain and long notes in ${study ? 'Study' : 'normal detail'} without modifying content`, () => {
    for (const text of ['Krátký postřeh.', 'Dlouhý postřeh s diakritikou.\n\n'.repeat(500)]) {
      const entry = { id: 'own-source', title: 'Moje kniha', type: 'Book', text, att: [{ id: 'audio', r2: true }] };
      const before = JSON.stringify(entry), result = detail(entry, study);
      assert.match(result.html, /Číst po stránkách/);
      if (!study) assert.match(result.html, /Studovat/);
      assert.equal(result.editor.value, text);
      assert.equal(JSON.stringify(entry), before); assert.equal(result.writes.length, 0);
      result.editor.onChange(text + ' Doplnění.');
      assert.equal(result.writes[0][0], 'own');
      assert.equal(result.writes[0][1], 'content');
      assert.equal(result.writes[0][3].text, text + ' Doplnění.');
      assert.deepEqual(entry.att, [{ id: 'audio', r2: true }]);
    }
  });

  test(`coach source uses only the client's private notes in ${study ? 'Study' : 'normal detail'}`, () => {
    const entry = { id: 'coach-source', title: 'Sdílená kniha', type: 'Book', origin: sourcePolicy.SOURCE_ORIGIN.COACH,
      text: 'Canonical source field, not a private note.', note: 'Můj vlastní postřeh.' };
    const result = detail(entry, study);
    assert.match(result.html, /Číst po stránkách/); assert.equal(result.editor.value, entry.note);
    result.editor.onChange('Nový osobní postřeh.');
    assert.equal(result.writes[0][0], 'private'); assert.equal(result.writes[0][1], entry.id);
    assert.deepEqual(Object.keys(result.writes[0][2]), ['note']);
    assert.equal(result.writes[0][2].note, 'Nový osobní postřeh.');
  });

  test(`empty notes keep the editor without a dead reading button in ${study ? 'Study' : 'normal detail'}`, () => {
    const result = detail({ id: 'empty-source', title: 'Nová kniha', type: 'Book', text: '' }, study);
    assert.ok(!result.html.includes('Číst po stránkách'));
    assert.equal(result.editor.value, '');
  });
}

test('Sources wires the incumbent notebook/diary reader in both applications', () => {
  assert.match(app, /NotesReader: NahledPoznamky/);
  assert.match(source, /entry=\{\{id:e\.id,title:e\.title,text:noteText,rezim:"stranky"\}\}/);
  assert.match(source, /settings=\{false\} pagingControls/);
});

test('the existing reader exposes accessible page controls without notebook mutations for Sources', () => {
  const start = app.indexOf('function NahledPoznamky(');
  const end = app.indexOf('function NastaveniPoznamky(', start);
  const reader = vm.runInNewContext(compile(app.slice(start, end)) + '\nNahledPoznamky;', {
    React, useState: React.useState, useT: () => ({ t: theme }), useStore: () => ({}), L,
    useStranky: () => ({ strana: 2, pocet: 4, jdi: noop }), mdToHtml: text => text,
    createPortal: value => value, document: { body: {} }, hexA: value => value,
    FONT_TAG: 'sans-serif', FONT_BODY: 'sans-serif', FamilyIcon: noop, TmIcNastaveni: noop, iconBtn: () => ({}),
    CisloStranky: noop, NastaveniPoznamky: () => { throw new Error('Source reading must not expose notebook mutations'); },
  });
  const html = renderToStaticMarkup(React.createElement(reader, {
    entry: { id: 'source', title: 'Kniha k přečtení', text: 'Text postřehů zůstává celý.', rezim: 'stranky' },
    settings: false, pagingControls: true, onZavri: noop, onPsat: noop,
  }));
  assert.match(html, /Kniha k přečtení/); assert.match(html, /Text postřehů zůstává celý\./);
  assert.match(html, /tm-nahled-telo tm-stranky/);
  assert.match(html, /aria-label="Předchozí stránka"/); assert.match(html, /aria-label="Další stránka"/);
  assert.match(html, /aria-label="Zavřít čtení"/); assert.match(html, /aria-label="Stránka 2 z 4"/);
  assert.ok(!html.includes('Nastavení poznámky'));
});

test('expanded editing saves through the owning collection or the explicit private-note callback', () => {
  const start=app.indexOf('function NahledPoznamky('), end=app.indexOf('function NastaveniPoznamky(',start);
  const writes=[]; let editor;
  const Reader=vm.runInNewContext(compile(app.slice(start,end))+'\nNahledPoznamky;',{
    React,useState:React.useState,useT:()=>({t:theme}),useStore:()=>({updateEntry:(...args)=>writes.push(args)}),L,
    useStranky:()=>({strana:1,pocet:1,jdi:noop}),mdToHtml:text=>text,createPortal:value=>value,document:{body:{}},hexA:value=>value,
    FONT_TAG:'sans-serif',FONT_BODY:'sans-serif',FamilyIcon:noop,TmIcNastaveni:noop,iconBtn:()=>({}),CisloStranky:noop,NastaveniPoznamky:noop,
    RichArea:props=>{editor=props;return React.createElement('div',null,props.value);},
  });
  for(const kind of ['notebook','journal']){
    const html=renderToStaticMarkup(React.createElement(Reader,{entry:{id:'own',title:'Test',text:'Before'},kind,onZavri:noop}));
    assert.equal((html.match(/aria-label="Zavřít zápisek"/g)||[]).length,1);
    editor.onChange('After');assert.deepEqual(writes.at(-1).slice(0,2),[kind,'own']);assert.equal(writes.at(-1)[2].text,'After');
  }
  let privateText='';const before=writes.length;
  renderToStaticMarkup(React.createElement(Reader,{entry:{id:'shared',title:'Test',text:'Private'},settings:false,onZavri:noop,onChange:v=>{privateText=v;}}));
  editor.onChange('Private update');assert.equal(privateText,'Private update');assert.equal(writes.length,before);
  renderToStaticMarkup(React.createElement(Reader,{entry:{id:'locked',title:'Test',text:'Locked',zamek:true},onZavri:noop}));
  assert.equal(editor.zamek,true);
});
