import dayjs from 'dayjs';

const EVENT_DATE_FORMAT = 'MMM D';
const EVENT_TIME_FORMAT = 'H:mm';
const EVENT_DATETIME_FORMAT = 'DD/MM/YY H:mm';

const formatToEventDateTime = (date) => date.substring(0, date.indexOf('T'));
const formatToEventDate = (date) => dayjs(date).format(EVENT_DATE_FORMAT);
const formatToDateTime = (date) => date.substring(0, date.indexOf('.'));
const formatToTime = (date) => dayjs(date).format(EVENT_TIME_FORMAT);
const formatToUpperCase = (type) => type.charAt(0).toUpperCase() + type.slice(1);
const formatToFormDate = (date) => dayjs(date).format(EVENT_DATETIME_FORMAT);

const getRandomElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomPrice = () => Math.floor(Math.random() * 1000) + 100;

const getRandomId = () => Math.floor(Math.random() * 100) + 1;

const isEscapeKey = (evt) => evt.key === 'Escape';

export {getRandomElement, getRandomPrice, getRandomId, formatToEventDateTime, formatToEventDate, formatToDateTime, formatToTime,
  formatToUpperCase, formatToFormDate, isEscapeKey};
