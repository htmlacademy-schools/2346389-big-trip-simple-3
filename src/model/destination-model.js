import Observable from '../framework/observable';

export default class DestinationModel extends Observable {
  #tripPointApiService = null;
  #destinations = [];

  constructor ({tripPointApiService}) {
    super();
    this.#tripPointApiService = tripPointApiService;
    this.init(); // заполняет массив данными
  }

  async init() { // запрашивает список мест назначения с сервера
    try {
      this.#destinations = await this.#tripPointApiService.destinations; // успех
    } catch(err) {
      this.#destinations = []; // ошибка
    }
  }

  get destinations() {
    return this.#destinations;
  }
}

// в архив
