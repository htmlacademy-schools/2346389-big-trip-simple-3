import RoutePointList from '../view/route-point-list';
import PointPresenter from './point-presenter';
import {render, RenderPosition} from '../framework/render.js';
import Sorting from '../view/sorting-view';
import { SortType } from '../sorting';
import { sortByDay, sortByPrice } from '../util';
import NoPointsWarn from '../view/no-points-warning';
import Creation from '../view/creation';
export default class BoardPresenter { //создание и отображение списка маршрутных точек

  #routePointListComponent = new RoutePointList();
  #boardContainer = null;
  #point = null;
  #points = null;
  #noPointComponent = null;
  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #sourcedPoints = [];
  #creationFormComponet = null;

  constructor({boardContainer}, point) {
    this.#boardContainer = boardContainer;
    this.#point = point;
  }

  init() {
    this.#points = [...this.#point];
    this.#sourcedPoints = [...this.#point];
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointsWarn();
    render(this.#noPointComponent, this.#boardContainer, RenderPosition.AFTERBEGIN );
  }

  #renderPointsList() {
    render(this.#routePointListComponent, this.#boardContainer);
    this.#renderPoints();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#routePointListComponent.element,
      onModeChange: this.#clearPointsList
    });

    pointPresenter.init(point);
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #clearPointsList() {
    this.#pointsPresenter.forEach((presenter) => presenter.removePoint());
    this.#pointsPresenter.clear();
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case 'sort-day':
        this.#points.sort(sortByDay);
        break;
      case 'sort-price':
        this.#points.sort(sortByPrice);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new Sorting({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    this.#sortPoints('sort-day');
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderCreationForm() {
    this.#creationFormComponet = new Creation(this.#points[0]);
    render(this.#creationFormComponet, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }
}
