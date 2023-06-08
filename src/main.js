import FilterView from './view/filters.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter';
import { Point } from './mock/point.js';
import { generateFilter } from './mock/filter.js';

const container = document.querySelector('.trip-events');
const point = new Point();
const boardPresenter = new BoardPresenter({boardContainer: container}, point.getPoints());
const filterContainer = document.querySelector('.trip-controls__filters');
const filters = generateFilter(point.points);
render (new FilterView(filters), filterContainer);

boardPresenter.init();
