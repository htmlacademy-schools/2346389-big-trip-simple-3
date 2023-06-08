import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter) {
  return (`
  <div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}">
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
  </div>
  `);
}

function createFiltersTemplate(filterItems) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('')}
      <button class="visually-hidden" type="submit">Apply Filters</button>
    </form>`;
}


export default class FilterView extends AbstractView {
  #filters = null;
  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}

//в архив
