import RoutePointList from '../view/route-point-list';
import PointPresenter from './point-presenter';
import {render, RenderPosition} from '../framework/render.js';

export default class BoardPresenter { //создание и отображение списка маршрутных точек

  #routePointListComponent = new RoutePointList();
  #boardContainer = null;
  #point = null;
  #points = null;
  #noPointComponent = null;
  #pointPresenter = new Map();

  constructor({boardContainer}, point) {
    this.#boardContainer = boardContainer;
    this.#point = point;
  }

  init() {
    this.#points = [...this.#point];
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#points.length === 0) {
      render(this.#renderNoPoints, this.#boardContainer);
      return;
    }
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
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }
}
