import { filter } from '../util.js';

export const generateFilter = () => Object.entries(filter).map(
  ([filterName]) => ({
    name: filterName,
    count: 0,
  }),
);
