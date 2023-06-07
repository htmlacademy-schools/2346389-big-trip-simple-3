import { description, places } from './data.js';
import { getRandomId, getRandomElement } from '../util.js';
import { generatePicture } from './picture.js';

const destinationsId = [];
export const destinations = [];

const getRandomDestination = () => {
  let id = getRandomId();
  while (destinationsId.includes(id)) {
    id = getRandomId();
  }
  destinationsId.push(id);
  const phrase = getRandomElement(description);
  const name = getRandomElement(places);
  const picture = generatePicture();
  const destination = {
    id, phrase, name, picture
  };
  destinations.push(destination);
  return id;
};

const getDestinationById = (id) => destinations.find((destination) => destination.id === id).name; //возвращает свойство name найденного объекта

const getDestinationDescriptionById = (id) => destinations.find((destination) => destination.id === id).description; //возвращает свойство description найденного объекта

const getDestinationPictureById = (id) => destinations.find((destination) => destination.id === id).picture.src; //возвращает свойство picture найденного объекта

export {getRandomDestination, getDestinationById, getDestinationDescriptionById, getDestinationPictureById};
