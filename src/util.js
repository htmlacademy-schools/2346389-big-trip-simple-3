import dayjs from 'dayjs';

const EVENT_DATE_FORMAT = 'MMM D';
const EVENT_TIME_FORMAT = 'H:mm';
const EVENT_DATETIME_FORMAT = 'DD/MM/YY';
const EVENT_CLASSIC_FORMAT = 'DD/MM/YY H:mm';

const formatToEventDateTime = (date) => date.substring(0, date.indexOf('T'));
const formatToEventDate = (date) => dayjs(date).format(EVENT_DATE_FORMAT);
const formatToDateTime = (date) => date.substring(0, date.indexOf('.'));
const formatToTime = (date) => dayjs(date).format(EVENT_TIME_FORMAT);
const formatToUpperCase = (type) => type.charAt(0).toUpperCase() + type.slice(1);
const formatToFormDate = (date) => dayjs(date).format(EVENT_DATETIME_FORMAT);
const formatToClassicFormat = (date) => dayjs(date).format(EVENT_CLASSIC_FORMAT);

const getRandomElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomPrice = () => Math.floor(Math.random() * 1000) + 100;

const getRandomId = () => Math.floor(Math.random() * 100) + 1;

const isEscapeKey = (evt) => evt.key === 'Escape';

const isDateBeforToday = (point) => dayjs(point.dateFrom).isSameOrBefore(dayjs(), 'day');

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future'
};

const filter = {
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints,
  [FilterType.FUTURE]:(tripPoints) => tripPoints.filter((tripPoint) => isDateBeforToday(tripPoint.dateFrom)),
};

const sortByDay = (p1, p2) => (dayjs(p1.dateFrom).diff(dayjs(p2.dateFrom)));

const sortByTime = (p1, p2) => {
  const time1 = dayjs(p1.dateTo).diff(dayjs(p1.dateFrom));
  const time2 = dayjs(p2.dateTo).diff(dayjs(p2.dateFrom));
  return time2 - time1;
};

function sortByPrice(p1, p2) {
  return p2.basePrice - p1.basePrice;
}

export {getRandomElement, getRandomPrice, getRandomId, formatToEventDateTime, formatToEventDate, formatToDateTime, formatToTime,
  formatToUpperCase, formatToFormDate, formatToClassicFormat, isEscapeKey, filter, sortByDay, sortByTime, sortByPrice, updateItem};

//в архив
