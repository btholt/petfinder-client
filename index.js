const isNode = require("is-node");
const faker = require("faker/locale/en");

let key;
const ANIMALS = [
  "dog",
  "cat",
  "bird",
  "barnyard",
  "reptile",
  "smallfurry",
  "horse",
  "pig"
];

const time = () => 1000 + Math.floor(Math.random() * 3000);

const imageAPI = [
  "http://placecorgi.com",
  "http://placekitten.com",
  "http://placebear.com"
];

const imageGen = () =>
  `${imageAPI[Math.floor(Math.random() * imageAPI.length)]}/${498 +
    Math.floor(Math.random() * 4)}/${498 + Math.floor(Math.random() * 4)}`;

const promiseGen = output =>
  new Promise(resolve => setTimeout(() => resolve(output), time()));

const petGen = () => ({
  contact: {
    state: faker.address.stateAbbr(),
    city: faker.address.city()
  },
  media: {
    photos: {
      photo: [
        {
          "@size": "pn",
          "@id": "1",
          value: imageGen()
        },

        {
          "@size": "pn",
          "@id": "2",
          value: imageGen()
        },

        {
          "@size": "pn",
          "@id": "3",
          value: imageGen()
        },

        {
          "@size": "pn",
          "@id": "4",
          value: imageGen()
        },

        {
          "@size": "pn",
          "@id": "5",
          value: imageGen()
        }
      ]
    }
  },
  id: faker.random.number(10000),
  shelterPetId: null,
  breeds: {
    breed: faker.lorem.word()
  },
  name: faker.name.firstName(),
  description: faker.lorem.paragraph(10),
  animal: faker.lorem.word()
});

const api = {
  breed: {
    list(opts) {
      return promiseGen({
        petfinder: {
          breeds: {
            breed: Array.from({ length: 5 }).map(() => faker.lorem.word())
          }
        }
      });
    }
  },
  pet: {
    get(opts) {
      return promiseGen({
        petfinder: {
          pet: petGen()
        }
      });
    },
    find(opts) {
      return promiseGen({
        petfinder: {
          pets: {
            pet: Array.from({ length: 10 }).map(() => petGen())
          }
        }
      });
    }
  },
  shelter: {
    getPets(opts) {
      return request("shelter.getPets", opts);
    },
    listByBreed(opts) {
      return request("shelter.listByBreed", opts);
    },
    find(opts) {
      return request("shelter.find", opts);
    },
    get(opts) {
      return request("shelter.get", opts);
    }
  }
};

module.exports = function createPetfinderSingleton(creds) {
  if (creds) {
    key = creds.key;
  }
  return api;
};
module.exports.ANIMALS = ANIMALS;
