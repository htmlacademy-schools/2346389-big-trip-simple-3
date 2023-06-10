import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter';
import PointModel from './model/point-model.js';
import NewEventButton from './view/new-event-button.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointApiService from './trip-point-api-service.js';

const AUTHORIZATION = 'Basic chavi6';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const container = document.querySelector('.trip-events');
const pageHeader = document.querySelector('.trip-main');
const pageFilterElement = document.querySelector('.trip-controls__filters');
const filterModel = new FilterModel();
const pointsApiService = new PointApiService(END_POINT, AUTHORIZATION);
const point = new PointModel({
  pointsApiService: pointsApiService
});

const boardPresenter = new BoardPresenter({
  boardContainer: container,
  pointsModel: point,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

// eslint-disable-next-line no-console
console.log(filterModel);

const filterPresenter = new FilterPresenter({
  filterContainer: pageFilterElement,
  filterModel: filterModel,
  pointsModel: point
});

const newPointButtonComponent = new NewEventButton({ // создает элемент кнопки и устанавливает его свойства
  onClick: handleNewPointButtonClick
});

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true; // отключает кнопку
}

function handleNewPointFormClose() { // снова включает кнопку после завершения процесса создания точки
  newPointButtonComponent.element.disabled = false;
}

render(newPointButtonComponent, pageHeader);
point.init()
  .finally(() => {
    render(newPointButtonComponent, pageHeader);
  });
filterPresenter.init();
boardPresenter.init();
