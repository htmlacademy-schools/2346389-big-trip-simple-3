import Creation from '../view/creation.js';
import Editing from '../view/editing.js';
import Sorting from '../view/sorting';
import RoutePoint from '../view/route-point.js';
import RoutePointList from '../view/route-point-list.js';
import {render} from '../render.js';

export default class BoardPresenter {
  waypointListComponent = new RoutePointList();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new Sorting(), this.boardContainer);
    render(this.waypointListComponent, this.boardContainer);
    render(new Creation(), this.waypointListComponent.getElement());
    render(new RoutePoint(), this.waypointListComponent.getElement());
    render(new Editing(), this.waypointListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePoint(), this.waypointListComponent.getElement());
    }
  }
}
