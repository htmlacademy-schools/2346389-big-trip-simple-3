import {createElement} from '../render.js';

function createRoutePointListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class RoutePointList {

  #element = null;

  getTemplate() {
    return createRoutePointListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
