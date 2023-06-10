export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future'
};

export const FilterTypeDescriptions = {
  [FilterType.EVERYTHING]: 'EVERYTHING',
  [FilterType.FUTURE]: 'FUTURE',
};

export const SortType = {
  DAY: {text: 'day'},
  EVENT: {text: 'event'},
  TIME: {text: 'time'},
  PRICE: {text: 'price'},
  OFFERS: {text: 'offer'}
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH', // минимальное обновление интерфейса
  MINOR: 'MINOR', // среднее обновление
  MAJOR: 'MAJOR', // полная перерисовка
  INIT: 'INIT' // инициализация
};

export const pointType = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
