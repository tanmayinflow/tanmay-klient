import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifiedAccessEmail} from '../src/shared/product/accessIdentity.js';

// Approved Cloudflare Access application IDs are public deployment metadata.
// Validate the domain-to-audience mapping, not just the shape of an ID.
const expectedAudiences={
  'app.tanmaypractice.com':'57fb04ff1bc23ee564b84bb08e293cd77c0c46dc0876c048ab2d9bb31aad34b0',
  'klient.tanmaypractice.com':'9bcde3ca86367832a591196ef7c4ea79b43ca96cd19112f2be2c7e03d0466b4f',
};
test('production requires its own signed identity and exposes only its custom domain',async()=>{
  const read=name=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url),'utf8'));
  const role=read('package.json').name;
  const host=role==='tanmay-web'?'app.tanmaypractice.com':'klient.tanmaypractice.com';
  const config=read('wrangler.jsonc');
  assert.deepEqual(config.routes,[{pattern:host,custom_domain:true}]);
  assert.equal(config.workers_dev,false);
  assert.equal(config.preview_urls,false);
  assert.equal(config.vars.ACCESS_TEAM_DOMAIN,'https://tanmaypractice.cloudflareaccess.com');
  assert.equal(config.vars.ACCESS_AUDIENCE,expectedAudiences[host]);
  const request=new Request('https://'+host+'/api/me',{headers:{'cf-access-authenticated-user-email':'fixture@example.test'}});
  assert.equal((await verifiedAccessEmail(request,{})).error.status,503);
  assert.equal((await verifiedAccessEmail(request,config.vars)).error.status,401);
});

test('configured Access identity accepts a signed owner only for its designated issuer, app, and lifetime',async()=>{
  const keys=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
  const jwk={...await crypto.subtle.exportKey('jwk',keys.publicKey),kid:'rotation-key'};
  const env={ACCESS_TEAM_DOMAIN:'https://example.cloudflareaccess.com',ACCESS_AUDIENCE:'approved-app'};
  const options={now:()=>100000,loadKeys:async()=>[jwk]};
  async function check(delta={}, email='owner@example.test', signatureOk=true) {
    const claims={iss:env.ACCESS_TEAM_DOMAIN,aud:[env.ACCESS_AUDIENCE],email:'owner@example.test',exp:120,nbf:80,...delta};
    const b64=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
    const prefix=b64({alg:'RS256',kid:jwk.kid})+'.'+b64(claims);
    const signature=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',keys.privateKey,new TextEncoder().encode(prefix));
    const request=new Request('https://unit.test/api/me',{headers:{'cf-access-jwt-assertion':prefix+'.'+(signatureOk?Buffer.from(signature).toString('base64url'):'AA'),'cf-access-authenticated-user-email':email}});
    return verifiedAccessEmail(request,env,options);
  }
  assert.deepEqual(await check(),{email:'owner@example.test'});
  for(const [delta,email,valid] of [[{aud:['other']}],[{iss:'https://different.cloudflareaccess.com'}],[{exp:100}],[{nbf:101}],[{},'different@example.test'],[{},undefined,false]]) {
    assert.equal((await check(delta,email,valid)).error.status,401);
  }
  const empty=new Request('https://unit.test/api/me');
  assert.equal((await verifiedAccessEmail(empty,env)).error.status,401);
  assert.equal((await verifiedAccessEmail(empty,{ACCESS_AUDIENCE:'without-issuer'})).error.status,503);
});
