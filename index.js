const axios = require("axios");
let key, secret, authPromise, version;

const ANIMALS = [
  "dog",
  "cat",
  "bird",
  "barnyard",
  "small-furry",
  "horse",
  "scales-fins-other"
];

const petGen = data => ({
  contact: {
    state: data.contact.address.state,
    city: data.contact.address.city
  },
  media: {
    photos: {
      photo: data.photos
        .map((photo, index) => [
          {
            "@size": "pnt",
            id: index,
            value: photo.small
          },
          {
            "@size": "pn",
            id: index,
            value: photo.medium
          },
          {
            "@size": "x",
            id: index,
            value: photo.large
          },
          {
            "@size": "t",
            id: index,
            value: photo.full
          }
        ])
        .reduce((acc, array) => acc.concat(array), [])
    }
  },
  id: data.id,
  shelterPetId: data.organization_id,
  breeds: {
    breed: data.breeds.primary
  },
  name: data.name,
  description: data.description,
  animal: data.type
});

function handleError(e) {
  console.error("petfinder error", e);
  throw e;
}

const api = {
  breed: {
    list(opts) {
      return authPromise
        .then(authData => {
          return axios.get(
            `https://api.petfinder.com/v2/types/${opts.animal}/breeds`,
            {
              headers: {
                Authorization: `Bearer ${authData.data.access_token}`
              }
            }
          );
        })
        .then(res => {
          if (version === 2) {
            return Promise.resolve(res.data);
          }
          const list = res.data.breeds.map(breed => breed.name);
          return Promise.resolve({
            petfinder: {
              breeds: {
                breed: list
              }
            }
          });
        })
        .catch(handleError);
    }
  },
  pet: {
    get(opts) {
      return authPromise
        .then(authData => {
          return axios.get(`https://api.petfinder.com/v2/animals/${opts.id}`, {
            headers: {
              Authorization: `Bearer ${authData.data.access_token}`
            }
          });
        })
        .then(res => {
          if (version === 2) {
            return Promise.resolve(res.data);
          }

          return Promise.resolve({
            petfinder: {
              pet: petGen(res.data.animal)
            }
          });
        })
        .catch(handleError);
    },
    find(opts) {
      const params = Object.assign(
        { animal: opts.animal ? opts.animal : void 0 },
        opts
      );
      return authPromise
        .then(authData => {
          return axios.get(`https://api.petfinder.com/v2/animals`, {
            headers: {
              Authorization: `Bearer ${authData.data.access_token}`
            },
            params: opts
          });
        })
        .then(res => {
          if (version === 2) {
            return Promise.resolve(res.data);
          }

          return Promise.resolve({
            petfinder: {
              pets: {
                pet: res.data.animals.map(petGen)
              }
            }
          });
        })
        .catch(handleError);
    }
  }
};

function auth() {
  authPromise = axios.post("https://api.petfinder.com/v2/oauth2/token", {
    grant_type: "client_credentials",
    client_id: key,
    client_secret: secret
  });
}

module.exports = function createPetfinderSingleton(creds) {
  if (creds) {
    key = creds.key;
    secret = creds.secret;
    version = creds.version;
    if (!authPromise) {
      auth();
    }
  }
  return api;
};
module.exports.ANIMALS = ANIMALS;
