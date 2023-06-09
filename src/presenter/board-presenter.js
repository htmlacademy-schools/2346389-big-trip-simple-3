import RoutePointList from '../view/route-point-list';
import PointPresenter from './point-presenter';
import { render, RenderPosition } from '../framework/render.js';
import Sorting from '../view/sorting-view';
import { SortType } from '../sorting';
import { sortByDay, sortByPrice, updateItem } from '../util';
import NoPointsWarn from '../view/no-points-warning';
import Creation from '../view/creation';

export default class BoardPresenter { //создание и отображение списка маршрутных точек

  #routePointListComponent = new RoutePointList();
  #boardContainer = null;
  #point = null;
  #points = null;
  #noPoins = null;
  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #sourcedPoints = [];
  #creationFormComponet = null;

  constructor({boardContainer}, point) {
    this.#boardContainer = boardContainer;
    this.#point = point;
  }

  init() { // инициализирует объекты класса BoardPresenter, копирует массив точек и вызывает метод для отображения списка маршрутных точек
    this.#points = [...this.#point];
    this.#sourcedPoints = [...this.#point];
    this.#renderBoard();
  }

  #renderBoard() { //  проверяет, есть ли какие-либо точки в списке
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderNoPoints() {
    this.#noPoins = new NoPointsWarn();
    render(this.#noPoins, this.#boardContainer, RenderPosition.AFTERBEGIN );
  }

  #renderPointsList() {
    render(this.#routePointListComponent, this.#boardContainer);
    this.#renderPoints();
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#routePointListComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handlePointChange
    });

    pointPresenter.init(point);
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #clearPoints() {
    this.#pointsPresenter.forEach((presenter) => presenter.removePoint());
    this.#pointsPresenter.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(type) { // сортирует массив точек по выбранному типу сортировки
    switch (type) {
      case 'sort-day':
        this.#points.sort(sortByDay);
        break;
      case 'sort-price':
        this.#points.sort(sortByPrice);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = type;
  }

  #handleSortTypeChange = (sortType) => { // вызывает метод для сортировки и отображения списка маршрутных точек
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderPointsList();
  };

  #renderSort() { // создает экземпляр класса Sorting для сортировки списка маршрутных точек и вызывает метод для его отображения на странице
    this.#sortComponent = new Sorting({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    this.#sortPoints('sort-day');
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderCreationForm() { // создает экземпляр класса Creation и отображает форму создания новой маршрутной точки на странице
    this.#creationFormComponet = new Creation(this.#points[0]);
    render(this.#creationFormComponet, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }
}
