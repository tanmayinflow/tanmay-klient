// Memory only. A new authenticated app account immediately invalidates this session.
let session=null,running=false;
export const calendarSession=accountKey=>session?.accountKey===accountKey?session:null;
export function setCalendarSession(value){session=value;}
export function clearOtherCalendarSession(accountKey){if(session?.accountKey!==accountKey)session=null;}
export function beginCalendarSync(){if(running)return false;running=true;return true;}
export function endCalendarSync(){running=false;}
