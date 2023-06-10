import { render, replace, remove } from '../framework/render.js';
import Filters from '../view/filters-view.js';
import { FilterType, FilterTypeDescriptions, UpdateType } from '../const.js';
import { filter } from '../util.js';

export default class FilterPresenter { // отображение компонента управления фильтрацией на странице
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return [FilterType.EVERYTHING, FilterType.FUTURE].map((type) => ({ type, name: FilterTypeDescriptions[type], count: filter[type](this.#pointsModel.points).length }));
  }

  init() { // инициализация компонентов фильтрации
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new Filters({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => { // обработчик изменения типа фильтрации
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
