import config from './config';

var token;
var servers;
export default class ApiClient {
	static formatHeaders(options){
		const contentType = options.contentType ? options.contentType : 'application/json';
		if(options.authorized){
			return  {
				'Accept': 'application/json',
				'Content-Type': contentType,
				'Authorization': 'Bearer ' + this.getAuthToken(),
				...options.headers
			}
		}
		else {
			return  {
				'Accept': 'application/json',
				'Content-Type': contentType,
				...options.headers
			}
		}
	}

	static formatHeadersForUpload(options){
		if(options.authorized){
			return  {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + this.getAuthToken(),
				...options.headers
			}
		}
		else {
			return  {
				'Accept': 'application/json',
				...options.headers
			}
		}
	}
	static getAuthToken(){
		if(token !== undefined) return token;
		token = localStorage.getItem('skybunkToken');
		return token;
	}

	static setAuthToken(_token){
		token = _token;
		localStorage.setItem('skybunkToken', token);
	}

	static async getServerUrl() {
		if (servers !== undefined) return servers[0].url;
		servers = await localStorage.getItem('skybunkServers');
		return servers[0].url;
	};

	static getServers() {
		if (servers != undefined) return servers;
		return localStorage.getItem('skybunkServers');
	}

	static setServers(_servers) {
		servers = _servers
		localStorage.setItem('skybunkServers', servers);
	}

	static clearAuthToken(){
		localStorage.removeItem('skybunkToken');
		token = undefined;
	}

	static async get(endpoint, options={}) {

		return fetch(`${await this.getServerUrl()}${endpoint}`, {
				method: 'GET',
				headers: this.formatHeaders(options),
			})
			.then(response => response.json())
			.then(responseJSON => {
				return responseJSON;
			})
			.catch(err => {
				err = err.replace(/</g, '').replace(/>/g, '');
				console.error(err);
			});
	}

	static async register(newUser, options={}) {
		const authResponse = await fetch(`${config.AUTH_ADDRESS}/users`, {
			method: 'POST',
			headers: await this.formatHeaders(options),
			body: JSON.stringify(newUser),
		});
		const authResponseJson = await authResponse.json();

		if (authResponseJson.servers) {
			this.setServers(authResponseJson.servers);
			return await this.post('/users', newUser);
		}
		return {message: authResponseJson};
	};

	static async login(username, password, options={},) {
		return fetch(`${config.AUTH_ADDRESS}/users/login`, {
			method: 'POST',
			headers: await this.formatHeaders(options),
			body: JSON.stringify({username, password}),
		}).then(response => response.json());
	};


	static async post(endpoint, body, options={}) {

		return fetch(`${await this.getServerUrl()}${endpoint}`, {
			method: 'POST',
			headers: this.formatHeaders(options),
			body: JSON.stringify(body),
		})
		.then(response => response.json())
		.then(responseJSON => {
			return responseJSON;
		})
		.catch(err => {
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});
	};

	static async put(endpoint, body, options={}) {
		/**
		 * HACKFIX (Neil): Sending too many notification objects with requests has
		 * returned 413s and crashed the app. Here we're limiting the saved notifications to 30.
		 * This logic doesn't belong client-side, but putting it here should neutralize the bug for now.
		 */
		if (body.notifications) {
			console.log("Trimming notifications...");
			body.notifications = body.notifications.slice(0, 30);
		} else console.log("No notifications being sent");

		return fetch(`${await this.getServerUrl()}${endpoint}`, {
			method: 'PUT',
			headers: this.formatHeaders(options),
			body: JSON.stringify(body),
		})
		.then(response => {
			return response.json()
		})
		.then(responseJSON => {
			return responseJSON
		})
		.catch(err => {
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});
	}

	static async uploadPhoto(endpoint, image, name, options={}) {
		const method = options.method ? options.method : 'PUT'

		let formData = new FormData();
		formData.append(name, image);
		return fetch(`${await this.getServerUrl()}${endpoint}`, {
			method:  method,
			headers: await this.formatHeadersForUpload({...options}),
			body: formData,
		})
		.then(response => {
			return response.json();
		})
		.then(responseJSON => responseJSON)
		.catch(err => {
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});
	}

	static async delete(endpoint, options={}) {

		return fetch(`${this.getServerUrl()}${endpoint}`, {
			method: 'DELETE',
			headers:  this.formatHeaders(options)
		})
		.catch(err => {
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});
	}

	static makeCancelable(promise) {
	  let hasCanceled_ = false;

	  const wrappedPromise = new Promise((resolve, reject) => {
	    promise.then(
	      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
	      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
	    );
	  });

	  return {
	    promise: wrappedPromise,
	    cancel() {
	      hasCanceled_ = true;
	    },
	  };
	};
}
