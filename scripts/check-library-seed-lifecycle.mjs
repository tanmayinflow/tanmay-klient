// Install under scripts/. Reads and executes the repository's actual App callback.
// No source patching, browser storage, user records, or product writes.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath, pathToFileURL} from 'node:url';

const arg = name => process.argv.find(s => s.startsWith(`--${name}=`))?.slice(name.length + 3);
const repo = path.resolve(arg('repo') || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const role = arg('role');
if (!['main', 'client'].includes(role)) throw Error('Pass --role=main or --role=client');
const imp = f => import(pathToFileURL(path.join(repo, f)));
const hash = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const appFile = path.join(repo, 'src/App.tsx');
const appHash = hash(appFile);
const app = fs.readFileSync(appFile, 'utf8');
const ts = (await imp('node_modules/typescript/lib/typescript.js')).default;
const ast = ts.createSourceFile('App.tsx', app, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const vars = {};
for (const statement of ast.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    vars[declaration.name.getText(ast)] = declaration.initializer?.getText(ast);
  }
}
let callback;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'seedTrainingColl') {
    callback = node.initializer.body.arguments[0];
  }
  ts.forEachChild(node, visit);
}
visit(ast);
if (!callback || !ts.isArrowFunction(callback)) throw Error('Actual seedTrainingColl callback not found');

const lib = (await imp('scripts/lib/exercise-library.mjs')).loadLibrary();
const TV = await imp('src/training/index.js');
const {priorAuditOwnsExercise} = await imp('src/training/legacyExerciseSyncOwnership.js');
const previousIds = ['superman','archpull','kneeraise','crow','wallhs','hip9090','presshs','muscleup'];
const P = await imp('src/training/catalogPositionHoldAudit.js');
const context = (await imp('src/data/positionHoldAuditContext.js')).POSITION_HOLD_AUDIT_CONTEXT;
const environment = {
  ...lib.seeds, TV, structuredClone, uid: () => 'synthetic-seed-test-id',
  TEX_META: lib.meta, POSITION_HOLD_AUDIT_CONTEXT: context,
  // Capture the library result at the boundary before unrelated training-domain conversion.
  tvApply: collection => collection,
};
if (role === 'main') {
  environment.seedMobilityExercises = (await imp('src/library/mobility.js')).seedMobilityExercises;
  environment.seedCreatorExercises = (await imp('src/library/creator-exercises.js')).seedCreatorExercises;
  environment.retireLegacyYogaSync = (await imp('src/library/yogaSync.js')).retireLegacyYogaSync;
}
for (const [name, prefix] of Object.entries({landing:'LANDING',complexTask:'COMPLEX_TASK',throw:'THROW',breathing:'BREATHING',trunk:'TRUNK', movement:'MOVEMENT', balance:'BALANCE', locomotion:'LOCOMOTION', lowerLeg:'LOWER_LEG', hip:'HIP', shoulder:'SHOULDER', elbowHand:'ELBOW_HAND'})) {
  environment[`${prefix}_AUDIT_CONTEXT`] = (await imp(`src/data/${name}AuditContext.js`))[`${prefix}_AUDIT_CONTEXT`];
}
environment.priorAuditOwnsExercise = priorAuditOwnsExercise;
const sandbox = vm.createContext(environment);
const loading = new Set();
function loadConstant(name) {
  if (Object.hasOwn(environment, name)) return environment[name];
  if (!vars[name] || loading.has(name)) throw Error(`Cannot evaluate actual declaration ${name}`);
  loading.add(name);
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      environment[name] = structuredClone(vm.runInContext(`(${vars[name]})`, sandbox));
      loading.delete(name);
      return environment[name];
    } catch (error) {
      const missing = error.message.match(/^([A-Za-z_$][\w$]*) is not defined$/)?.[1];
      if (!missing) throw error;
      loadConstant(missing);
    }
  }
  throw Error(`Declaration dependency limit for ${name}`);
}
for (const name of new Set(callback.getText(ast).match(/\b(?:TEX|TSER|TWO|TPL)_[A-Z0-9_]+\b/g) || [])) loadConstant(name);
const auditFunction = ast.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text === 'tExAuditFix');
if (!auditFunction) throw Error('Actual tExAuditFix function not found');
vm.runInContext(auditFunction.getText(ast), sandbox);
const run = vm.runInContext(`(${callback.getText(ast)})`, sandbox);
const scope = Object.keys(context.entries);
const entry = row => row && P.positionHoldEntryFor(row, lib.meta[row.id], context);
const same = P.positionHoldSame;
const checks = [];
const check = (name, pass) => checks.push({name, pass: !!pass});

const first = structuredClone(run({}));
const second = structuredClone(run(structuredClone(first)));
const third = structuredClone(run(structuredClone(second)));
check('fresh scope identities exactly once', scope.every(id => first.tEx.filter(r => r.id === id).length === 1));
check('fresh scope fully recognized after audit', scope.every(id => entry(first.tEx.find(r => r.id === id))?.stage === 'after'));
check('second callback/reload preserves every scoped row', scope.every(id => same(first.tEx.find(r => r.id === id), second.tEx.find(r => r.id === id))));
check('third callback is idempotent', same(second, third));

// These links are actual old SM sync outputs, independently observed before the fix.
// All other fields come from this App's own seed literals; native guards remain authoritative.
const legacyLinks = {
  tucklever: {hd:'advtucklever'}, straddlefl: {ez:'onelegfl', hd:'halflayfl'},
  frontlever: {ez:'halflayfl', hd:'fltouch'}, tuckplanche: {hd:'advtuckplanche'},
  straddleplanche: {ez:'advtuckplanche'}, planche: {hd:'planchepush'}, maltese: {ez:'planchepush'},
};
const rawRows = structuredClone(role === 'main'
  ? [...environment.TEX_ALL, ...environment.TEX_SEED_AN, ...environment.TEX_SEED_JG]
  : environment.TEX_ALL);
const stored = {
  tSeeded:true, exAudit:1, smSync:7, cmSync:1,
  ...Object.fromEntries(Array.from({length:9}, (_, i) => [`tSeedV${i + 2}`, true])),
  tEx: rawRows.map(row => legacyLinks[row.id] ? {...row, ...legacyLinks[row.id]} : row),
  tWo:[], tPl:[], tSer:[], tLog:[{id:'synthetic-log', weight:undefined, side:null}], ownNote:null,
};
const storedResult = run(stored);
for (const id of Object.keys(legacyLinks)) {
  check(`${id}: full old postlegacy profile is recognized`, entry(storedResult.tEx.find(r => r.id === id))?.stage === 'after');
}
check('stored history and own null survive', storedResult.tLog === stored.tLog && storedResult.ownNote === null);
check('stored migration is idempotent', same(storedResult, run(storedResult)));

for (const auditFlag of ['absent', 1]) {
  for (const id of ['lsit', 'tucklever', 'planche']) {
    for (const ownLink of [undefined, null, 'my own next']) {
      const custom = {...first.tEx.find(r => r.id === id), exe:['Osobní provedení', 'Own execution'], hd:ownLink, notes:{mine:undefined}};
      const before = structuredClone(custom);
      const collection = {...structuredClone(first), smSync:0, cmSync:0, tEx:[custom]};
      if (auditFlag === 'absent') delete collection.positionHoldAudit20261024;
      const result = run(collection).tEx.find(r => r.id === id);
      check(`${id}/${auditFlag}/${String(ownLink)}: personal fields survive`, same(result, custom) && same(custom, before));
      check(`${id}/${auditFlag}/${String(ownLink)}: no policy trust granted`, !entry(result));
    }
  }
}
const deletedIds = ['advtucklever', 'tuckl', 'planchepush'];
const deleted = {...structuredClone(first), smSync:0, cmSync:0, tEx:first.tEx.filter(r => !deletedIds.includes(r.id)), hiddenLib:['synthetic-hidden'], tLog:stored.tLog};
const deletedResult = run(deleted);
check('old SM/CM sync does not restore deleted exercises', deletedIds.every(id => !deletedResult.tEx.some(r => r.id === id)));
check('deletion history and hidden library survive', deletedResult.tLog === deleted.tLog && deletedResult.hiddenLib === deleted.hiddenLib);
check('source is unchanged during test', hash(appFile) === appHash);

const unscopedSecondRunChanges = first.tEx.filter(row => !scope.includes(row.id) && !same(row, second.tEx.find(r => r.id === row.id))).map(row => ({
  id:row.id,
  fields:[...new Set([...Object.keys(row), ...Object.keys(second.tEx.find(r => r.id === row.id) || {})])].filter(key => !P.positionHoldSameField(row, second.tEx.find(r => r.id === row.id), key)),
}));
for (const id of previousIds) {
  check(id + ': prior installed helper owns identity', priorAuditOwnsExercise(id));
  check(id + ': exact card survives second invocation', same(first.tEx.find(r => r.id === id), second.tEx.find(r => r.id === id)));
  for (const ownLink of [null, undefined, 'my own link']) {
    const custom = {...first.tEx.find(r => r.id === id), exe:['Vlastní provedení','Own execution'], ez:ownLink, hd:ownLink, notes:{mine:null}};
    const input = {...structuredClone(first), smSync:0, cmSync:0, tEx:[custom]};
    const got = run(input).tEx.find(r => r.id === id);
    check(id + '/' + String(ownLink) + ': personal links/text/notes survive', same(got, custom));
    check(id + '/' + String(ownLink) + ': no new block15 trust', !entry(got));
  }
}
check('unknown identity does not gain audit ownership', !priorAuditOwnsExercise('my-personal-exercise'));
check('no remaining unscoped second-run exercise changes', unscopedSecondRunChanges.length === 0);
const result = {
  helperSha256:hash(path.join(repo, 'src/training/legacyExerciseSyncOwnership.js')),
  at:new Date().toISOString(), role, repo, appSha256:appHash,
  contextSha256:hash(path.join(repo, 'src/data/positionHoldAuditContext.js')),
  scopeCount:scope.length,
  scope:'Actual installed App callback and imported seed/audit consumers; no in-memory source patch. Synthetic collections. Terminal tvApply boundary excludes unrelated training-schema conversion and browser lifecycle.',
  summary:{total:checks.length, pass:checks.filter(c => c.pass).length, fail:checks.filter(c => !c.pass).length},
  checks, unscopedSecondRunChanges,
};
if (arg('output')) fs.writeFileSync(path.resolve(arg('output')), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
if (result.summary.fail) process.exitCode = 1;
