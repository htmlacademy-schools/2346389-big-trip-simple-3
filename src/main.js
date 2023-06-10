import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter';
import PointModel from './model/point-model.js';
import NewEventButton from './view/new-event-button.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointApiService from './trip-point-api-service.js';

const AUTHORIZATION = 'Basic siu';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const container = document.querySelector('.trip-events'); // HTML-элемент контейнера, в котором будет отображаться список мероприятий
const pageHeader = document.querySelector('.trip-main'); // адает HTML-элемент шапки страницы, в которой находятся элементы управления и общая информация
const pageFilterElement = document.querySelector('.trip-controls__filters'); // задает HTML-элемент блока фильтров
const filterModel = new FilterModel(); // содержит данные фильтрации списка мероприятий и методы для их изменения
const pointsApiService = new PointApiService(END_POINT, AUTHORIZATION); // экземпляр класса для интерфейс для работы с сервером
const point = new PointModel({
  pointsApiService: pointsApiService
});

const boardPresenter = new BoardPresenter({
  boardContainer: container,
  pointsModel: point,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose // функция-обработчик закрытия форм
});

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
