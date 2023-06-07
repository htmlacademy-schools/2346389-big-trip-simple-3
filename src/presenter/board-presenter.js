import Editing from '../view/editing.js';
import Creation from '../view/creation.js';
import Sorting from '../view/sorting.js';
import RoutePoint from '../view/route-point.js';
import RoutePointList from '../view/route-point-list.js';
import {render, replace} from '../render.js';
import { isEscapeKey } from '../util.js';
import NoPointsWarn from '../view/no-points-warning.js';

export default class BoardPresenter { //создание и отображение списка маршрутных точек

  #routePointListComponent = new RoutePointList();
  #boardContainer = null;
  #point = null;

  constructor({boardContainer}, point) {
    this.#boardContainer = boardContainer;
    this.#point = point;
  }

  init() {
    const points = [...this.#point];
    if (points.length === 0) {
      render(new NoPointsWarn(), this.#boardContainer);
    }
    else {
      render(new Sorting(), this.#boardContainer);
      render(this.#routePointListComponent, this.#boardContainer);
      render(new Creation(points[0]), this.#routePointListComponent.element);
      for (let i = 0; i < points.length; i++) {
        this.#renderPoint(points[i]);
      }
    }
  }

  #renderPoint(point) {
    const ecsKeyDownHandler = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.body.removeEventListener('keydown', ecsKeyDownHandler);
      }
    };

    const pointComponent = new RoutePoint({
      point: point,
      onEditClick: () => {
        replacePointToForm.call(this);
        document.body.addEventListener('keydown', ecsKeyDownHandler);
      }});

    const editingFormComponent = new Editing({
      point: point,
      onFormSubmit: () => {
        replaceFormToPoint.call(this);
        document.body.removeEventListener('keydown', ecsKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(editingFormComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, editingFormComponent);
    }
    render(pointComponent, this.#routePointListComponent.element);
  }
}
