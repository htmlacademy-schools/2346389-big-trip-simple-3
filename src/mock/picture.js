import { getRandomElement } from '../util.js';
import { description } from './data.js';
import { getRandomId } from '../util.js';

export const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomId()}`,
  description: getRandomElement(description)
});

//в архив
