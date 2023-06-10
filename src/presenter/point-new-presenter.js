import {render, RenderPosition, remove} from '../framework/render.js';
import Editing from '../view/editing.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointNewPresenter { // класс-презентер для добавления новой точки маршрута
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointEditComponent = null;

  constructor({pointListContainer, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(offers, destinations) {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new Editing({
      offers: offers,
      destinations: destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onRollUpButton: this.#handleDeleteClick
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() { // удаляет компоненты формы создания новой точки маршрута
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() { //  устанавливает состояние компонента в режим сохранения
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() { // устанавливает состояние компонента в режим ошибки
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => { // отвечает за отправку данных формы создания новой точки маршрута
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,

      this.#deleteId(point)
    );
  };

  #deleteId = (point) => { // удаляет поле id из объекта point и возвращает очищенный объект
    delete point.id;
    return point;
  };

  #handleDeleteClick = () => { // обработчик клика по кнопке удаления формы
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

// в архив
