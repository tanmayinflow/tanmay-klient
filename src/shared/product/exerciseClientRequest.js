// Bind an async operation to the account that opened its UI. The injected
// client requester also sends the server-verified owner header.
export const unscopedExerciseAccess = () => ({ current: () => true });
export const defaultExerciseRequest = (url, init) => fetch(url, init);
export function requireExerciseScope(scope) {
  if (!scope?.current()) throw new Error('account-changed');
}
export async function exerciseResponse(request, scope, url, init) {
  requireExerciseScope(scope);
  const response = await request(url, init);
  requireExerciseScope(scope);
  const body = await response.json();
  requireExerciseScope(scope);
  return { response, body };
}
