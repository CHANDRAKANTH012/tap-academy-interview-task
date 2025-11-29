// src/pages/attendance/calendarHelpers.js
export function startOfMonth(d) {
  const dt = new Date(d.getFullYear(), d.getMonth(), 1);
  return dt;
}
export function endOfMonth(d) {
  const dt = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return dt;
}
export function eachDayOfInterval(start, end) {
  const arr = [];
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
}
// format to YYYY-MM-DD
export function format(d) {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
