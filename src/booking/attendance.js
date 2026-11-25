// Closed group attendance is a personal receipt, even while the group continues.
export const cancelledAttendance = ['CANCELLED_CLIENT','CANCELLED_COACH','LATE_CANCEL'];
export function receiptOnly(participant, booking, isGroup) {
  return !!participant && cancelledAttendance.includes(participant.status) &&
    (isGroup || participant.status !== booking.status);
}
