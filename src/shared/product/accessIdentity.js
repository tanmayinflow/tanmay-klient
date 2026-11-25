// Cloudflare's Static Assets router does not forward ctx.access. Pin each
// application's issuer and audience before trusting signed assertion claims.
const jwks = new Map();
const decode = segment => Uint8Array.from(atob(segment.replace(/-/g,"+").replace(/_/g,"/")), c => c.charCodeAt(0));
const readClaims = segment => JSON.parse(new TextDecoder().decode(decode(segment)));
const denied = (status=401) => Response.json({ok:false,error:"access-identity-unavailable"}, {status,headers:{"Cache-Control":"no-store, private"}});

async function signingKeys(issuer) {
  const cached = jwks.get(issuer);
  if (cached && cached.until > Date.now()) return cached.pending;
  // Share in-flight requests; arbitrary key IDs cannot force per-request downloads.
  const pending = (async()=>{
    const response = await fetch(issuer+"/cdn-cgi/access/certs", {redirect:"error"});
    if (!response.ok) throw new Error("Access signing keys unavailable");
    const {keys} = await response.json();
    if (!Array.isArray(keys) || !keys.length) throw new Error("Access signing keys unavailable");
    return keys;
  })();
  jwks.set(issuer,{pending,until:Date.now()+60000});
  return pending;
}

export async function verifiedAccessEmail(request, env, {now=Date.now,loadKeys=signingKeys}={}) {
  const headerEmail=(request.headers.get("cf-access-authenticated-user-email")||"").trim().toLowerCase();
  const issuer=String(env.ACCESS_TEAM_DOMAIN||"").trim().replace(/\/$/,"");
  const audience=String(env.ACCESS_AUDIENCE||"").trim();
  // Loopback fixtures and reserved test domains have no real Access edge.
  // Every routable host must have both pins, even if dashboard bindings drift.
  if (!issuer && !audience) {
    const hostname=new URL(request.url).hostname;
    if (['localhost','127.0.0.1','[::1]'].includes(hostname) || hostname.endsWith('.test')) return {email:headerEmail};
  }
  if (!audience || !/^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.cloudflareaccess\.com$/.test(issuer)) return {error:denied(503)};
  const token=request.headers.get("cf-access-jwt-assertion")||"";
  if (token.length>16384 || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) return {error:denied()};
  const [header,payload,signature]=token.split(".");
  try {
    const {alg,kid}=readClaims(header), claims=readClaims(payload);
    const email=typeof claims.email==="string"?claims.email.trim().toLowerCase():"";
    const seconds=now()/1000;
    if (alg!=="RS256" || typeof kid!=="string" || !kid || claims.iss!==issuer ||
        !(Array.isArray(claims.aud)?claims.aud:[claims.aud]).includes(audience) ||
        !Number.isFinite(claims.exp) || claims.exp<=seconds ||
        (claims.nbf!==undefined && (!Number.isFinite(claims.nbf)||claims.nbf>seconds)) ||
        !email || email!==headerEmail) return {error:denied()};
    const keys=await loadKeys(issuer);
    const raw=keys.find(item=>item.kid===kid && item.kty==="RSA" && (!item.alg || item.alg==="RS256"));
    if (!raw) return {error:denied()};
    const key=await crypto.subtle.importKey("jwk",raw,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
    if (!(await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,decode(signature),new TextEncoder().encode(header+"."+payload)))) return {error:denied()};
    return {email};
  } catch { return {error:denied()}; }
}
