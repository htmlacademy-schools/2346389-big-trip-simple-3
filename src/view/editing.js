import { pointType } from '../const';
import { formatToClassicFormat } from '../util';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = { // точка по умолчанию
  basePrice: 500,
  type: 'flight',
  dateFrom: '2023-05-15T09:45:17.375Z',
  dateTo: '2023-05-15T10:30:55.375Z',
  destination: 1,
  id: 0,
  offersIDs: []
};

const getDeleteTitle = (isEditForm, isDeleting) => { //  возвращает текст для кнопки удаления точки маршрута
  if (!isEditForm) {
    return 'Cancel';
  }
  return (isDeleting) ? 'Deleting...' : 'Delete';
};

function createOffersTemplate(offers, currentTypeOffers, checkedOffers, id, isDisabled) { // создает шаблон списка дополнительных опций, доступных для данного типа точки маршрута
  const offs = currentTypeOffers.map((currOffer) => offers.find((offer) => offer.id === currOffer));
  return offs.map((offer) => {
    const isOfferChecked = checkedOffers.includes(offer.id) ? 'checked' : '';
    return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${id}" type="checkbox" name="event-offer-${offer.id}" ${isOfferChecked} ${(isDisabled) ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}-${id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');
}

function createDestinationPicturesTemplate(destination) { // создает шаблон списка изображений, связанных с местом назначения
  return destination.pictures
    .map((pic) => `
    <img class="event__photo" src="${pic.src}" alt="${pic.description}">
    `)
    .join('');
}

function createDestinationDescriptionTemplate(destination) { // создает шаблон HTML-кода для блока с описанием места назначения
  return (destination) ? `
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${createDestinationPicturesTemplate(destination)}
    </div>
  </div>` : '';
}

function createEventDetailsTemplate(point, destination, offers, isDisabled) { // создает шаблон HTML-кода для блока с дополнительными опциями и блока с описанием места назначения
  const offs = offers.find((offer) => offer.type === point.type).offers;
  const currentTypeOffers = point.offersIDs;
  return `
  <section class="event__section  event__section--offers ${(offs.length === 0) ? 'visually-hidden' : ''}" >
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createOffersTemplate(offers.find((offer) => offer.type === point.type).offers, point.currentTypeOffers.map((offer) => offer.id), currentTypeOffers, point.id, isDisabled)}
    </div>
  </section>
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    ${createDestinationDescriptionTemplate(destination)}
  </section>`;
}

function generateRollupButton(isEditForm) { // создает шаблон HTML-кода для кнопки rollup
  return (!isEditForm) ? '' : `
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
}

function createEventTypeList(currentType, currentId) { //  создает список типов точек маршрута
  return pointType.map((type) => `
  <div class="event__type-item">
    <input id="event-type-${type}-${currentId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${(type === currentType) ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${currentId}">${type}</label>
  </div>`
  ).join('');
}

function createDestinationList(dest) { // создает список мест назначения
  return dest.map((destination) => `
    <option value="${destination.name}"></option>`
  ).join('');
}

function createEditingFormTemplate(point, offers, destinations, isEditForm) { // создает шаблон HTML-кода для формы редактирования точки маршрута
  const destName = destinations.find((destination) => destination.id === point.destination).name;
  const dest = destinations.find((destination) => destination.name === destName);
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle-${point.id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="${point.type}">
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle-${point.id}" type="checkbox"${(point.isDisabled) ? 'disabled' : ''}>
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeList(point.type, point.id)}
            </fieldset>
        </div>
      </div>
      <div class="event__field-group event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-${point.id}">
        ${point.type}
        </label>
        <input class="event__input event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${he.encode(dest.name)}" list="destination-list-${point.id}" ${(point.isDisabled) ? 'disabled' : ''}>
        <datalist id="destination-list-${point.id}">
          ${createDestinationList(destinations)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
        <input class="event__input event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${formatToClassicFormat(point.dateFrom)}" ${(point.isDisabled) ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
        <input class="event__input event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${formatToClassicFormat(point.dateTo)}" ${(point.isDisabled) ? 'disabled' : ''}>
      </div>
      <div class="event__field-group event__field-group--price">
        <label class="event__label" for="event-price-${point.id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input event__input--price" id="event-price-${point.id}" type="number" name="event-price" value="${point.basePrice}" autocomplete="off" min="0" max="9999999" ${(point.isDisabled) ? 'disabled' : ''}>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${(point.isDisabled) ? 'disabled' : ''}>${(point.isSaving) ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${(point.isDisabled) ? 'disabled' : ''}>${getDeleteTitle(isEditForm, point.isDeleting)}</button>
      ${generateRollupButton(isEditForm)}
    </header>
    <section class="event__details">
      ${createEventDetailsTemplate(point, dest, offers, point.isDisabled)}
      </section>
  </form>
  </li>`
  );
}

export default class Editing extends AbstractStatefulView{ // компонент интерфейса для редактирования точки маршрута
  #isEditForm = null;
  #offers = null;
  #destinations = null;
  #fromDatepicker = null;
  #toDatepicker = null;
  #handleFormSubmit = null;
  #handleRollupButton = null;
  #handleDeleteClick = null;

  constructor({point = BLANK_POINT, offers, destinations, onFormSubmit, onRollUpButton, onDeleteClick, isEditForm = true}) {
    super();
    this._setState(Editing.parsePointToState(point, offers));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#isEditForm = isEditForm;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButton = onRollUpButton;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  removeElement() {
    super.removeElement();

    if (this.#fromDatepicker) {
      this.#fromDatepicker.destroy();
      this.#fromDatepicker = null;
    }

    if (this.#toDatepicker) {
      this.#toDatepicker.destroy();
      this.#toDatepicker = null;
    }
  }

  get template() {
    return createEditingFormTemplate(this._state, this.#offers, this.#destinations, this.#isEditForm);
  }

  reset(point) {
    this.updateElement(
      Editing.parsePointToState(point, this.#offers),
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(Editing.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(Editing.parseStateToPoint(this._state));
  };

  #rollUpButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButton();
  };

  #eventTypeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      offersIDs: []
    });
    this.updateElement({
      type: evt.target.value,
      offers: this.#offers.find((offer) => offer.type === evt.target.value).offers.map((offer) => offer.id),
      currentTypeOffers: this.#offers.find((offer) => offer.type === evt.target.value).offers
    });
  };

  #destinationHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#destinations.find((destination) => destination.name === evt.target.value).id,
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #offersHandler = (evt) => {
    evt.preventDefault();
    const clickedOfferId = Number(evt.target.name.split('-').at(-1));
    const newOffersIds = this._state.offersIDs.slice();
    if (newOffersIds.includes(clickedOfferId)) {
      newOffersIds.splice(newOffersIds.indexOf(clickedOfferId), 1);
    } else {
      newOffersIds.push(clickedOfferId);
    }
    this._setState({
      offersIDs: newOffersIds
    });
  };

  #fromDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate.toISOString(),
    });
    this.#toDatepicker.set('minDate', userDate);
  };


  #toDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate.toISOString(),
    });
  };

  #setFromDatePicker() {
    this.#fromDatepicker = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: formatToClassicFormat(this._state.dateFrom),
        onChange: this.#fromDateChangeHandler,
      },
    );
  }

  #setToDatePicker() {
    this.#toDatepicker = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: formatToClassicFormat(this._state.dateTo),
        minDate: formatToClassicFormat(this._state.dateFrom),
        onChange: this.#toDateChangeHandler,
      },
    );
  }

  static parsePointToState(point, offers) {
    return {...point,
      currentTypeOffers: offers.find((offer) => offer.type === point.type).offers,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.currentTypeOffers;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  _restoreHandlers() { // устанавливает обработчики событий для элементов формы
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offersHandler);
    if (this.#isEditForm) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpButtonHandler);
      this.#setFromDatePicker();
      this.#setToDatePicker();
    }
  }
}

// в архив
