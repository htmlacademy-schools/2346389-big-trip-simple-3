import Point from '../view/route-point';
import { render, replace, remove } from '../framework/render';
import Editing from '../view/editing.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter { // отвечает за создание и управление компонентами точки маршрута
  #pointListContainer = null;
  #handleModeChange = null;
  #handleDataChange = null;
  #ecsKeyDownHandler = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #mode = Mode.DEFAULT;

  constructor({pointListContainer, onModeChange, onDataChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init(point, offers, destinations) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;
    this.#pointComponent = new Point({
      point: this.#point,
      offers: offers,
      destinations: destinations,
      onEditClick: this.#handleEditClick
    });

    this.#pointEditComponent = new Editing({
      point: this.#point,
      offers: offers,
      destinations: destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollUpButton: this.#handleRollupButtonClick,
      onDeleteClick: this.#handleDeleteClick
    });
    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }
    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() { // удаляет компоненты точки маршрута
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() { // возвращает компонент точки маршрута в режим чтения
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  setSaving() { // устанавливает состояние компонента Editing во время сохранения данных
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() { // устанавливает состояние компонента Editing во время удаления данных
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() { // устанавливает состояние компонента точки маршрута в случае ошибки при сохранении или удалении данных
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#pointEditComponent.shake(resetFormState);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
    this.#pointEditComponent.reset(this.#point);
    document.body.addEventListener('keydown', this.#ecsKeyDownHandler);
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = (this.#point.dateFrom !== update.dateFrom) || this.#point.basePrice !== update.basePrice;
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    document.body.removeEventListener('keydown', this.#ecsKeyDownHandler);
  };

  #handleRollupButtonClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
    document.body.removeEventListener('keydown', this.#ecsKeyDownHandler);
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #replacePointToForm() { // Point -> Editing
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() { // Editing -> Point
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }
}

// в архив
