import RoutePointList from '../view/route-point-list';
import PointPresenter from './point-presenter';
import PointNewPresenter from './point-new-presenter';
import Sorting from '../view/sorting-view';
import NoPointsWarn from '../view/no-points-warn';
import {render, remove, RenderPosition} from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const';
import { sortByDay, sortByPrice, filter } from '../util';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #pointListComponent = new RoutePointList(); // представляет собой список путевых точек
  #boardContainer = null; // DOM-элемент, в который добавляются компоненты
  #pointsModel = null; // модель точек маршрута, содержащая данные о путевых точках
  #noPointComponent = null; // отображается при отсутствии точек маршрута
  #newPointPresenter = null; //  отвечает за отображение формы добавления новой точки
  #sortPoints = null; // элемент управления типом сортировки точек маршрута
  #filterModel = null; // модель фильтрации точек маршрута
  #pointsPresenters = new Map(); // хэш-таблица, содержащая экземпляры компонента PointPresenter для каждой точки
  #currentSortType = 'sort-day'; // текущий тип сортировки точек маршрута
  #filterType = FilterType.ALL; // текущий тип фильтрации точек маршрута
  #loadingComponent = new LoadingView(); // отображается при загрузке данных модели
  #isLoading = true; // флаг, определяющий, загружены ли данные модели точек маршрута
  #uiBlocker = new UiBlocker({ // используется для блокировки пользовательского интерфейса
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor ({boardContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new PointNewPresenter({
      pointListContainer: this.#pointListComponent.element, // контейнер со списком точек
      onDataChange: this.#handleViewAction, // функция обратного вызова, которая вызываtncz при изменении данных о точке
      onDestroy: onNewPointDestroy // функция обратного вызова, которая вызывается при удалении формы добавления новой точки
    });
    this.#pointsModel.addObserver(this.#handleModelEvent); // обновляет представление списка точек в соответствии с новыми данными
    this.#filterModel.addObserver(this.#handleModelEvent); // обновляет представление списка точек в соответствии с новыми данными
  }

  get points() { // возвращает отфильтрованный и отсортированный список точек
    this.#filterType = this.#filterModel.filter; // устанавливает значение filterType равным текущему типу фильтра из filterModel
    const points = this.#pointsModel.points; // получает список всех точек из pointsModel
    const filteredPoints = filter[this.#filterType](points); // применяет функцию фильтрации, соответствующую текущему типу фильтрации, к списку точек

    switch (this.#currentSortType) {
      case 'sort-day':
        return filteredPoints.sort(sortByDay);
      case 'sort-price':
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() { // добавляет новую точку в список точек и предоставляет начальные значения для создания этой точки
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#pointsModel.offers, this.#pointsModel.destinations);
  }

  #renderPointsList() { // отрисовывает список точек на доске
    render(this.#pointListComponent, this.#boardContainer);
    this.#renderPoints();
  }

  #renderPoint(point) { // отрисовывает точку
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction
    });
    pointPresenter.init(point, this.offers, this.destinations);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() { // отрисовывает точки
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoading() { // отрисовывает компонент загрузки
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() { // отрисовывает всю доску
    const points = this.points;
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderSort() { // отрисовывает компонент, отвечающий за выбор типа сортировки, и добавляет его на страницу внутри контейнера
    this.#sortPoints = new Sorting({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortPoints, this.#boardContainer);
  }

  #renderNoPoints() { // отрисовывает компонент, когда точки отсутствуют
    remove(this.#sortPoints);
    remove(this.#loadingComponent);
    this.#noPointComponent = new NoPointsWarn({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.#boardContainer, RenderPosition.AFTERBEGIN );
  }

  #clearBoard({resetSortType = false} = {}) { // очищает доску
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortPoints);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModeChange = () => { // обработчик события изменения режима приложени
    this.#newPointPresenter.destroy(); // удаляет добавляемую пользователем точку и очищает все связанные с ней ресурсы
    this.#pointsPresenters.forEach((presenter) => presenter.resetView()); // сбрасывает все изменения и возвращает представление точки в исходное состояние
  };

  #handleModelEvent = (updateType, data) => { // обработчик событий модели
    switch (updateType) {
      case UpdateType.PATCH: // обновляет только одну точку
        this.#pointsPresenters.get(data.id).init(data, this.#pointsModel.offers, this.#pointsModel.destinations);
        break;
      case UpdateType.MINOR: // очищает все точки на карте и заново рендерит их
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR: //  очищает все точки на карте, сбрасывает количество отрисованных и тип сортировки
        this.#clearBoard({resetRenderedPointsCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => { // отвечает за изменение типа сортировки и перерисовку в соответствии с новым типом сортировки
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedPointsCount: true});
    this.#renderBoard();
  };

  #handleViewAction = async (actionType, updateType, update) => { // обрабатывает добавление, обновление или удаление точки
    this.#uiBlocker.block(); // блокирует пользовательский интерфейс
    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving(); // сохранение...
        try {
          await this.#pointsModel.addPoint(updateType, update); // добавление
        } catch(err) {
          this.#pointsPresenters.get(update.id).setAborting(); // ошибка
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointsPresenters.get(update.id).setSaving(); // сохранение...
        try {
          await this.#pointsModel.updatePoint(updateType, update); // обновление
        } catch(err) {
          this.#pointsPresenters.get(update.id).setAborting(); // ошибка
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenters.get(update.id).setDeleting(); // удаление...
        try {
          await this.#pointsModel.deletePoint(updateType, update); // удаление
        } catch(err) {
          this.#pointsPresenters.get(update.id).setAborting(); // ошибка
        }
        break;
    }

    this.#uiBlocker.unblock(); // разблокирует пользовательский интерфейс
  };
}
