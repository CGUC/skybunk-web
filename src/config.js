let address = 'https://skybunk-auth-production.herokuapp.com';

if (process.env.REACT_APP_AUTH_ADDRESS) {
	address = process.env.REACT_APP_AUTH_ADDRESS;
}
module.exports = {
  AUTH_ADDRESS: address,
}
