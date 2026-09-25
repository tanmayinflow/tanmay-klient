// Preserve useful server failure codes without displaying arbitrary response bodies.
export async function readTogetherResponse(response) {
  if(response.redirected || response.status===401) throw new Error("sign-in-required");
  if(!response.headers.get("content-type")?.includes("application/json")) throw new Error("invalid-server-response");
  const data=await response.json();
  if(!response.ok || !data.ok) throw new Error(data.error || "unavailable");
  return data;
}
