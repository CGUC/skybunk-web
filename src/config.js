let address = 'https://skybunk-development.herokuapp.com';

if (process.env.API_URL) {
	address = process.env.API_URL;
}

module.exports = {
  API_ADDRESS: address,
}
