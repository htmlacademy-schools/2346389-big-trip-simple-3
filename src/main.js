import Filters from './view/filters.js';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter';

const filtersContainer = document.querySelector('.trip-controls__filters');
const container = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: container});

render(new Filters(), filtersContainer);
boardPresenter.init();
