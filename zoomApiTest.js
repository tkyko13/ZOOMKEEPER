var request = require("request");

var options = {
  method: 'GET',
  // Use the `me` keyword for the request below. 
  url: 'https://api.zoom.us/v2/users/me',
  headers: {
    authorization: 'Bearer {yourtokenhere}' // Do not publish or share your token with anyone.
  }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});