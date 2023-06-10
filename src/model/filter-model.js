import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable { // фильтр, который может быть применен к списку элементов или данных
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) { // устанавливает новое значение фильтра, а затем оповещает об этом изменении.
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
