import {validateContentSnapshot,exportContentSnapshot} from '../src/shared/product/contentWorkshop.js';

// Fixed private R2 object, populated explicitly by the owner. No user-supplied
// path, public asset, account backup or live subscription participates here.
export const CONTENT_LIBRARY_KEY='published/content-library-v1.json';
const headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
export async function handleContentLibrary(request,env) {
  // Authentication, identity conflict, mounted owner and joined membership are
  // required by worker/index.js before entering this handler.
  if(request.method!=='GET')return Response.json({ok:false,error:'method not allowed'},{status:405,headers:{...headers,Allow:'GET'}});
  try {
    const object=await env.FILES.get(CONTENT_LIBRARY_KEY);
    if(!object)return Response.json({ok:false,error:'content not published'},{status:404,headers});
    if(object.size>5_000_000)throw Error('oversized content');
    const text=await new Response(object.body).text();if(text.length>5_000_000)throw Error('oversized content');
    const snapshot=JSON.parse(text);validateContentSnapshot(snapshot);
    // Reject private attachment/auth references even if a manually uploaded
    // file bypassed the app's scoped exporter. Never reflect invalid data.
    const {report}=exportContentSnapshot(snapshot,{version:snapshot.version,source:snapshot.source});
    if(report.attachments||report.privateReferences)throw Error('private references');
    return Response.json(snapshot,{headers});
  } catch {
    return Response.json({ok:false,error:'content unavailable'},{status:503,headers});
  }
}
