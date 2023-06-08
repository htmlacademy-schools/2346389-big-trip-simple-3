const description = [
  'Wake up to the reality.',
  '下手な鉄砲も数撃ちゃ当たる.',
  'Choćbyśmy nie chcieli, to budowa tamy przez bobra jest rzeczywistością, którą trzeba zaakceptować.',
  'Ich bin eine Giraffe, die auf einem Einrad jongliert.',
  'Muchos gracias aficion esto es para vosotros siiiuuu.'
];

const pointType = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const places = ['Saint Petersburg', 'Tokyo', 'Rome', 'Tbilisi', 'New York', 'Sydney'];

const dates = [
  {
    dateFrom: '2023-01-01T00:30:00.375Z',
    dateTo: '2023-01-01T02:10:10.375Z'
  },
  {
    dateFrom: '2023-05-15T09:45:17.375Z',
    dateTo: '2023-05-15T10:30:55.375Z'
  },
  {
    dateFrom: '2023-08-23T11:22:13.375Z',
    dateTo: '2023-08-23T11:58:02.375Z'
  },
  {
    dateFrom: '2023-03-05T09:15:13.375Z',
    dateTo: '2023-03-05T09:15:53.225Z'
  },
  {
    dateFrom: '2023-11-09T17:00:13.375Z',
    dateTo: '2023-11-09T17:01:03.395Z'
  },
  {
    dateFrom: '2023-02-28T11:20:17.375Z',
    dateTo: '2023-02-28T11:23:54.105Z'
  },
  {
    dateFrom: '2023-12-12T02:54:51.375Z',
    dateTo: '2023-12-12T06:49:11.375Z'
  },
  {
    dateFrom: '2023-04-29T15:15:15.375Z',
    dateTo: '2023-04-29T17:15:15.375Z'
  },
  {
    dateFrom: '2023-01-11T05:55:55.375Z',
    dateTo: '2023-01-11T06:12:07.375Z'
  },
  {
    dateFrom: '2023-01-15T19:07:21.375Z',
    dateTo: '2023-01-15T19:57:21.375Z'
  }
];


const offers = [
  {
    id: 1,
    title: 'Add luggage',
    price: 30
  },
  {
    id: 2,
    title: 'Choose seats',
    price: 20
  },
  {
    id: 3,
    title: 'Add breakfast',
    price: 10
  },
  {
    id: 4,
    title: 'Switch to comfort',
    price: 70
  },
  {
    id: 5,
    title: 'Add alcohol',
    price: 12
  },
  {
    id: 6,
    title: 'Order Uber',
    price: 15
  },
  {
    id: 7,
    title: 'Rent a car',
    price: 25
  },
  {
    id: 8,
    title: 'Book tickets',
    price: 40
  },
  {
    id: 9,
    title: 'Hire a tourist guide',
    price: 20
  }
];

function getOfferName(offerId) { //функция получения имени услуги
  // eslint-disable-next-line no-shadow
  const offer = offers.find((offer) => offer.id === offerId);
  return offer ? offer.title : null;
}
function getOfferPrice(offerId) { //функция получения ID услуги
  // eslint-disable-next-line no-shadow
  const offer = offers.find((offer) => offer.id === offerId);
  return offer ? offer.price : null;
}

const offersByType = [
  {
    type: 'taxi',
    offers: [offers[3], offers[5]]
  },

  {
    type: 'bus',
    offers: [offers[0], offers[7], offers[8]]
  },

  {
    type: 'train',
    offers: [offers[0], offers[1], offers[2], offers[3], offers[7]]
  },

  {
    type: 'ship',
    offers: [offers[0], offers[1], offers[2], offers[3], offers[4], offers[7]]
  },

  {
    type: 'drive',
    offers: [offers[5], offers[6]]
  },

  {
    type: 'flight',
    offers: [offers[0], offers[1], offers[2], offers[3], offers[4], offers[7]]
  },

  {
    type: 'check-in',
    offers: [offers[2]]
  },

  {
    type: 'sightseeing',
    offers: [offers[6], offers[7], offers[8]]
  },

  {
    type: 'restaurant',
    offers: [offers[1], offers[2], offers[4], offers[5]]
  },
];

const getArrayFromType = (type) => offersByType.find((offer) => offer.type === type).offers.map((off) => (off.id)); //массив ID

export {description, pointType, places, dates, offers, getOfferName, getOfferPrice, getArrayFromType};

//в архив
