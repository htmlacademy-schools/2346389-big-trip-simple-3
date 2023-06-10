import AbstractView from '../framework/view/abstract-view.js';

function createNoPointsWarnTemplate(filterType) {
  if (filterType === 'FUTURE') {
    return '<p class="trip-events__msg">There are no future points now</p>';
  }
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class NoPointsWarn extends AbstractView {
  #filterType = null;

  constructor({filterType}){
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsWarnTemplate(this.#filterType);
  }
}

// в архив
