import { UpdateType } from '../const';
import Observable from '../framework/observable';

export default class PointModel extends Observable {
  #tripPointApiService = null; // сервис для получения данных
  #tripPoints = []; // список поездок
  #offers = []; // список предложений
  #destinations = []; // список мест назначения

  constructor ({pointsApiService}) {
    super();
    this.#tripPointApiService = pointsApiService;
  }

  get points() {
    return this.#tripPoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() { // запрашивает у сервера данные о поездках
    try {
      const tripPoints = await this.#tripPointApiService.tripPoints;
      this.#tripPoints = tripPoints.map(this.#adaptToClient);
      this.#offers = await this.#tripPointApiService.offers;
      this.#destinations = await this.#tripPointApiService.destinations;
    } catch(err) {
      this.#tripPoints = [];
      this.#offers = [];
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT); // уведомляет об изменении данных в объекте
  }

  async updatePoint(updateType, update) { // обновляет данные о поездке
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === update.id);

    if (index === -1) { // поездка не найдена
      throw new Error('Can\'t update unexisting tripPoint');
    }

    try {
      const response = await this.#tripPointApiService.updatePoint(update); // запрос к сервису для обновления данных
      const updatedTripPoint = this.#adaptToClient(response); // данные о поездке приводятся к нужному формату
      this.#tripPoints = [ // обновленная поездка добавляется в массив, заменяя старую
        ...this.points.slice(0, index),
        updatedTripPoint,
        ...this.#tripPoints.slice(index + 1),
      ];
      this._notify(updateType, updatedTripPoint); //  уведомление об изменении данных
    } catch(err) {
      throw new Error('Can\'t update tripPoint'); // ошибка в запросе к серверу для обновления поездки
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#tripPointApiService.addPoint(update); // добавление новой точки маршрута
      const newTripPoint = this.#adaptToClient(response); // данные приводятся к нужному формату
      this.#tripPoints = [newTripPoint, ...this.#tripPoints]; // ответ добавляется в начало массива точек маршрута
      this._notify(updateType, newTripPoint);
    } catch(err) {
      throw new Error('Can\'t add tripPoint'); // ошибка
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === update.id); // находит индекс удаляемой точки маршрута в массиве

    if (index === -1) { // точка маршрута не найдена
      throw new Error('Can\'t delete unexisting tripPoint');
    }

    try {
      await this.#tripPointApiService.deletePoint(update);
      this.#tripPoints = [ // создается новый массив, содержащий все точки маршрута, кроме удаленной
        ...this.points.slice(0, index),
        ...this.#tripPoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete tripPoint'); // ошибка
    }
  }

  #adaptToClient(tripPoint) { // преобразует объект в формат для клиент
    // добавление новых свойств
    const adaptedTripPoint = {...tripPoint,
      dateFrom: tripPoint['date_from'],
      dateTo: tripPoint['date_to'],
      offersIDs: tripPoint['offers'],
      basePrice: tripPoint['base_price'],
    };

    // удаление ненужных старых свойств, способствующих затруднению чтения данных
    delete adaptedTripPoint['date_from'];
    delete adaptedTripPoint['date_to'];
    delete adaptedTripPoint['offers'];
    delete adaptedTripPoint['base_price'];

    return adaptedTripPoint; // адаптированный объект точки маршрута
  }
}
