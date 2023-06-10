import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../const';

function createSortItemTemplate(sortType) {
  return `
  <div class="trip-sort__item  trip-sort__item--${sortType.text}">
    <input id="sort-${sortType.text}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType.text}">
    <label class="trip-sort__btn" for="sort-${sortType.text}">${sortType.text}</label>
  </div>`;
}

function createSortingTemplate() {
  const sortItemsTemplate = Object.values(SortType).map((sortType) => createSortItemTemplate(sortType)).join('');
  return (`
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItemsTemplate}
  </form>`
  );
}

export default class Sorting extends AbstractView {
  #currentSortType = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this._callback.onSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.onSortTypeChange(evt.target.value);
  };
}

// в архив
