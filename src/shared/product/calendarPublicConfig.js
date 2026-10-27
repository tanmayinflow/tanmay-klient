// OAuth client identifiers are public. Never expose any client secret or token.
export function calendarPublicConfig(env={}) {
  const clientId=String(env.GOOGLE_CALENDAR_CLIENT_ID||'').trim();
  const valid=/^[a-zA-Z0-9._-]+\.apps\.googleusercontent\.com$/.test(clientId);
  return {ok:true,configured:valid,clientId:valid?clientId:''};
}
export function calendarConfigResponse(request,env) {
  return request.method==='GET' ? Response.json(calendarPublicConfig(env),{headers:{'Cache-Control':'no-store, private'}})
    :Response.json({ok:false,error:'method'},{status:405,headers:{Allow:'GET'}});
}
