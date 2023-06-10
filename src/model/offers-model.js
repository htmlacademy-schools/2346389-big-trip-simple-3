import Observable from '../framework/observable';

export default class OffersModel extends Observable {
  #tripPointApiService = null;
  #offers = [];

  constructor ({tripPointApiService}) {
    super();
    this.#tripPointApiService = tripPointApiService;
    this.init();
  }

  async init() { // запрашивает список предложений с сервера
    try {
      this.#offers = await this.#tripPointApiService.offers; // успех
    } catch(err) {
      this.#offers = []; // ошибка
    }
  }

  get offers() {
    return this.#offers;
  }
}

// в архив
