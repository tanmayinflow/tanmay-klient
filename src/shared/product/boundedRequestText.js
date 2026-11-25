// Returns null when the body exceeds the limit, including streamed requests
// that do not carry Content-Length. Count bytes before allocating decoded text.
export async function boundedRequestText(request, limit) {
  if(Number(request.headers.get('Content-Length') || 0)>limit)return null;
  if(!request.body)return '';
  const reader=request.body.getReader(),decoder=new TextDecoder();
  let bytes=0,text='';
  try {
    for(;;) {
      const {done,value}=await reader.read();
      if(done)return text+decoder.decode();
      bytes+=value.byteLength;
      if(bytes>limit){reader.cancel().catch(()=>{});return null;}
      text+=decoder.decode(value,{stream:true});
    }
  }finally{reader.releaseLock();}
}
