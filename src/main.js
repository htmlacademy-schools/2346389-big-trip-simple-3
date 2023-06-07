import Filters from './view/filters.js';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter';
import { Point } from './mock/point.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const container = document.querySelector('.trip-events');
const point = new Point();
const boardPresenter = new BoardPresenter({boardContainer: container}, point);
render(new Filters(), filtersContainer);
boardPresenter.init();
