import { render, replace, remove } from '../framework/render';
import Point from '../view/route-point';
import Editing from '../view/editing';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null; // контейнер для отображения точек маршрута
  #handleModeChange = null; // функция обратного вызова, которая вызывается при изменении режима презентера
  #ecsKeyDownHandler = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({pointListContainer, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleModeChange = onModeChange;
  }

  init(point) { // инициализирует презентер для данной точки маршрута
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;
    // eslint-disable-next-line no-console
    console.log('prevPointComponent:', prevPointComponent);
    // eslint-disable-next-line no-console
    console.log('prevPointEditComponent', prevPointEditComponent);

    this.#pointComponent = new Point({
      point: this.#point,
      onEditClick: this.#clickOnEditButton
    });

    // eslint-disable-next-line no-console
    console.log('New Point:', this.#pointComponent);

    this.#pointEditComponent = new Editing({
      point: this.#point,
      onFormSubmit: this.#submitForm,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) { // проверяет компоненты точки
      // eslint-disable-next-line no-console
      console.log('На вход A:', this.#pointComponent, ',', this.#pointComponent);
      const r = render(this.#pointComponent, this.#pointListContainer);
      // eslint-disable-next-line no-console
      console.log('Render:', r);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      // eslint-disable-next-line no-console
      console.log('На вход B:', this.#pointComponent, ',', prevPointComponent);
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      // eslint-disable-next-line no-console
      console.log('На вход C:', this.#pointEditComponent, ',', prevPointEditComponent);
      replace(this.#pointEditComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() { // удаляет элементы DOM, связанные с этой точкой маршрута
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() { // возвращает презентер в начальное состояние
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() { // заменяет элемент DOM, отображающий точку маршрута, на форму для редактирования информации о точке маршрута
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscapeKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() { // заменяет форму для редактирования информации о точке маршрута на элемент DOM, отображающий точку маршрута
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscapeKeydown);
    this.#mode = Mode.DEFAULT;
  }

  #onEscapeKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #clickOnEditButton = () => {
    this.#replacePointToForm();
    this.#pointEditComponent.reset(this.#point);
    document.body.addEventListener('keydown', this.#ecsKeyDownHandler);
  };

  #submitForm = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };
}
