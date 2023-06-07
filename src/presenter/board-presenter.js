import Creation from '../view/creation.js';
import Editing from '../view/editing.js';
import Sorting from '../view/sorting.js';
import RoutePoint from '../view/route-point.js';
import RoutePointList from '../view/route-point-list.js';
import {render} from '../render.js';
import { isEscapeKey } from '../util.js';

export default class BoardPresenter { //создание и отображение списка маршрутных точек

  #routePointListComponent = new RoutePointList();
  #boardContainer = null;
  #point = null;
  #points = null;


  constructor({boardContainer}, point) {
    this.#boardContainer = boardContainer;
    this.#point = point;
  }

  init() {
    this.#points = [...this.#point.points];
    render(this.#routePointListComponent, this.#boardContainer);
    render(new Sorting(), this.#boardContainer);
    render(new Creation(), this.routePointListComponent.getElement());
    render(new RoutePoint({point: this.points[0]}), this.routePointListComponent.getElement());
    render(new Editing({point: this.points[0]}), this.routePointListComponent.getElement());

    for (let i = 0; i < this.#points.length; i++) { //для каждой маршрутной точки создается новый объект RoutePoint, который затем рендерится в DOM
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPoint = (point) => {
    const pointComponent = new RoutePoint(point);
    const pointEditComponent = new Editing(point);
    const replaceFormToPoint = () => {
      this.#routePointListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };
    const replacePointToForm = () => {
      this.#routePointListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const closeFormOnEscape = (evt) => {
      if(isEscapeKey(evt)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.body.removeEventListener('keydown', closeFormOnEscape());
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replacePointToForm();
      document.body.addEventListener('keydown', closeFormOnEscape());
    });

    pointEditComponent.element.querySelector('.event__save-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeFormOnEscape());
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeFormOnEscape());
    });

    render(pointComponent, this.#routePointListComponent.element);
  };
}

