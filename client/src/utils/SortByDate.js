export default (a, b, dateField) => {
  var dateA = new Date(a[dateField]).getTime();
  var dateB = new Date(b[dateField]).getTime();
  return dateA > dateB ? 1 : -1;
};