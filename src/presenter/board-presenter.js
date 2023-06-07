import Creation from '../view/creation.js';
import Editing from '../view/editing.js';
import Sorting from '../view/sorting.js';
import RoutePoint from '../view/route-point.js';
import RoutePointList from '../view/route-point-list.js';
import {render} from '../render.js';

export default class BoardPresenter { //создание и отображение списка маршрутных точек
  routePointListComponent = new RoutePointList();

  constructor({boardContainer}, point) {
    this.boardContainer = boardContainer;
    this.point = point;
  }

  init() {
    this.points = [...this.point.getPoints()];
    render(this.routePointListComponent, this.boardContainer);
    render(new Sorting(), this.boardContainer);
    render(new Creation(), this.routePointListComponent.getElement());
    render(new RoutePoint({point: this.points[0]}), this.routePointListComponent.getElement());
    render(new Editing({point: this.points[0]}), this.routePointListComponent.getElement());

    for (let i = 0; i < this.points.length; i++) { //для каждой маршрутной точки создается новый объект RoutePoint, который затем рендерится в DOM
      render(new RoutePoint({point: this.points[i]}), this.routePointListComponent.getElement());
    }
  }
}
