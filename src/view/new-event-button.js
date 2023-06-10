import AbstractView from '../framework/view/abstract-view.js';

function createNewEventButton() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewEventButton extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick; // если в объекте параметров передано свойство onClick, то оно присваивается свойству #handleClick
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewEventButton();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}

// в архив
