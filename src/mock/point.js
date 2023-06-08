import { getRandomElement , getRandomId, getRandomPrice} from '../util';
import { dates, getArrayFromType, pointType} from './data';
import { getRandomDestination } from './destination';

const COUNT = 3;

const pointsId = [];

export const getRandomPoint = () => {
  let id = getRandomId();
  while (pointsId.indexOf(id) >= 0) {
    id = getRandomId();
  }
  pointsId.push(id);
  const basePrice = getRandomPrice();
  const date = getRandomElement(dates);
  const dateFrom = date.dateFrom;
  const dateTo = date.dateTo;
  const destination = getRandomDestination();
  const type = getRandomElement(pointType);
  const offers = getArrayFromType(type);

  return {
    basePrice, dateFrom, dateTo, destination, id, offers, type
  };
};

export class Point {
  #points = Array.from({length: COUNT}, getRandomPoint);

  getPoints() {
    return this.#points;
  }
}

//в архив
