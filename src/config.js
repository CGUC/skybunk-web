let address = 'https://skybunk-auth-dev.herokuapp.com';

if (process.env.AUTH_ADDRESS) {
	address = process.env.AUTH_ADDRESS;
}
console.log(address)
module.exports = {
  AUTH_ADDRESS: address,
}
