import {createElement} from '../render.js';

function createFiltersTemplate() { //возвращает шаблон HTML для формы фильтров
  return (
    `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>
    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
}

export default class Filters {
  getTemplate() { //функция возвращения шаблона HTML для формы фильтров
    return createFiltersTemplate();
  }

  getElement() { //функия создания элемента, если он ещё не был создан
    if (!this.element) { //проверка на существование элемента
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() { //функция удаления элемента
    this.element = null;
  }
}
