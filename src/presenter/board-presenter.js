import RoutePointList from '../view/route-point-list';
import PointPresenter from './point-presenter';
import {render, RenderPosition} from '../framework/render.js';
import Sorting from '../view/sorting-view';
import { SortType } from '../sorting';
import { sortByDay, sortByTime } from '../util';

export default class BoardPresenter { //создание и отображение списка маршрутных точек

  #routePointListComponent = new RoutePointList();
  #boardContainer = null;
  #point = null;
  #points = null;
  #noPointComponent = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #sourcedPoints = [];

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
      render(this.#renderNoPoints, this.#boardContainer);
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderNoPoints() {
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
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #clearPointsList() {
    this.#pointPresenter.forEach((presenter) => presenter.removePoint());
    this.#pointPresenter.clear();
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case 'sort-day':
        this.#points.sort(sortByDay);
        break;
      case 'sort-time':
        this.#points.sort(sortByTime);
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
}
