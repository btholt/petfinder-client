const isNode = require("is-node");
let jsonp = () =>
  console.warn("WARNING, YOU CALLED JSONP IN A NON-BROWSER CONTEXT");
if (!isNode) {
  jsonp = require("browser-jsonp");
}

let key;
const BASE_URL = "http://api.petfinder.com";
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

const serialize = function(res) {
  const acc = {};
  for (let prop in res) {
    if (!prop) {
      break;
    }
    if (res.hasOwnProperty(prop) && prop.charAt(0) !== "@") {
      if (res[prop].hasOwnProperty("$t")) {
        acc[prop] = res[prop]["$t"];
      } else if (Array.isArray(res[prop])) {
        acc[prop] = res[prop].map(item => {
          if (item.hasOwnProperty("$t")) {
            if (Object.getOwnPropertyNames(item).length > 1) {
              item.value = item["$t"];
              delete item["$t"];
              return item;
            } else {
              return item["$t"];
            }
          } else {
            return serialize(item);
          }
        });
      } else if (Object.getOwnPropertyNames(res[prop]).length === 0) {
        acc[prop] = null;
      } else {
        let serialized = serialize(res[prop]);
        acc[prop] = serialized;
      }
    }
  }
  return acc;
};

const request = function(method, opts) {
  let newOpts = { key, format: "json" };
  newOpts = Object.assign(newOpts, opts);
  return new Promise((resolve, reject) => {
    jsonp({
      url: BASE_URL + "/" + method,
      data: newOpts,
      success: function(data) {
        resolve(serialize(data));
      },
      error: function(err) {
        reject(err);
      }
    });
  });
};

const api = {
  breed: {
    list(opts) {
      return request("breed.list", opts);
    }
  },
  pet: {
    getRandom(opts) {
      return request("pet.getRandom", opts);
    },
    get(opts) {
      return request("pet.get", opts);
    },
    find(opts) {
      return request("pet.find", opts);
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
