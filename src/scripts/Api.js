// utils/Api.js

class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
  headers: {
    authorization: "8606b4ad-2d31-4218-96cb-6012d27d651f"
  }
})
  .then(res => res.json())
  }

  // other methods for working with the API
}

export default Api;
