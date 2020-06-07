const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const formatDateForPreview = date =>
  date
    ? date.getDate() + ' ' + MONTH_NAMES_SHORT[date.getMonth()] + ' ' + date.getFullYear()
    : ''
;

export const formatDateForFinalApi = date =>
  date
    ? date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate()
    : ''
;
