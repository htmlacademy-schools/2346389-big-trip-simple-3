import {createElement} from '../render.js';
import {getOfferName, getOfferPrice} from '../mock/data.js';
import {getDestinationById} from '../mock/destination.js';
import { formatToDateTime, formatToEventDate, formatToEventDateTime, formatToTime } from '../util.js';

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
}
export default class RoutePoint {
  #element = null;
  #point = null;

  constructor(point) {
    this.#point = point;
  }

  getTemplate() { //функция возращения строк с разметкой
    return createRoutePointTemplate(this.#point);
  }

  getElement() { //функия создания элемента, если он ещё не был создан
    if (!this.#element) { //проверка на существование элемента
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() { //функция удаления элемента
    this.#element = null;
  }
}
