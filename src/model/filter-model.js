import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable { // фильтр, который может быть применен к списку элементов или данных
  #filter = FilterType.EVERYTHING; // текущее значение фильтра

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) { //  сохраненяет переданное значение фильтра в приватное поле #filter
    this._notify(updateType, this.#filter = filter);
  }
}
