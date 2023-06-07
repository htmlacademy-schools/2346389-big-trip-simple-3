import dayjs from 'dayjs';

const EVENT_DATE_FORMAT = 'MMM D';
const EVENT_TIME_FORMAT = 'H:mm';
const EVENT_DATETIME_FORMAT = 'DD/MM/YY H:mm';

const removeTimeFromDatetime = (datetimeStr) => datetimeStr.substring(0, datetimeStr.lastIndexOf(':'));
const formatDateToEventDate = (datetimeStr) => dayjs(datetimeStr).format(EVENT_DATE_FORMAT);
const formatDatetimeToEventDatetime = (datetimeStr) => dayjs(datetimeStr).format(EVENT_DATETIME_FORMAT);
const formatTimeToEventTime = (timeStr) => dayjs(timeStr, 'HH:mm:ss').format(EVENT_TIME_FORMAT);
const formatDatetimeToEventTime = (datetimeStr) => dayjs(datetimeStr).format(EVENT_TIME_FORMAT);
const formatDatetimeToFormDatetime = (datetimeStr) => dayjs(datetimeStr).format(EVENT_DATETIME_FORMAT);

const getRandomElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomPrice = () => Math.floor(Math.random() * 1000) + 100;

const getRandomId = () => Math.floor(Math.random() * 100) + 1;

export {getRandomElement, getRandomPrice, getRandomId, removeTimeFromDatetime, formatDateToEventDate, formatDatetimeToEventDatetime, formatTimeToEventTime,
  formatDatetimeToEventTime, formatDatetimeToFormDatetime};
