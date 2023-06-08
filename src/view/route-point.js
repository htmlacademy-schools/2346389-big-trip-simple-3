import {getOfferName, getOfferPrice} from '../mock/data.js';
import {getDestinationById} from '../mock/destination.js';
import { formatToDateTime, formatToEventDate, formatToEventDateTime, formatToTime } from '../util.js';
import AbstractView from '../framework/view/abstract-view';

function createOffersTemplate(offers) {
  return offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${getOfferName(offer)}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${getOfferPrice(offer)}</span>
    </li>
  `).join('');
}

function createRoutePointTemplate(point) {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;
  const eventDateTime = formatToEventDateTime(dateFrom);
  const eventDate = formatToEventDate(dateFrom);
  const fromDateTime = formatToDateTime(dateFrom);
  const fromTime = formatToTime(dateFrom);
  const toDateTime = formatToDateTime(dateTo);
  const toTime = formatToTime(dateTo);
  const offersTemplate = createOffersTemplate(offers);
  return(
    `<li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${eventDateTime}">${eventDate}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${type} ${getDestinationById(destination)}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${fromDateTime}">${fromTime}</time>
              &mdash;
              <time class="event__end-time" datetime="${toDateTime}">${toTime}</time>
            </p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offersTemplate}
          </ul>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
  );

}export default class Point extends AbstractView {
  #point = null;
  #handleEditClick = null;

  constructor({point, onEditClick}) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createRoutePointTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}

//в архив
