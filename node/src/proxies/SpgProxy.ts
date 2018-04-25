import axios from 'axios';
const BASE_SERVICES = "http://localhost:8080/tomcat";
//const BASE_SERVICES = "http://mysql.cs.jmu.edu/tomcat/spaghetti";

/**
 * Abstract implementation of a proxy for service communication.
 *
 * @author Paul Barnhill
 * @version 2018-04-16
 */
export default abstract class SpgProxy {
	/**
	  * Sets the service to the full URL of the service.
		* @param service relative uri for the service (e.g. 'country', 'library')
		* @return full URL to service
	 */
	constructor(protected service: string) {
		this.service = BASE_SERVICES + '/' + service;
	}

	static callbackError(callback: (p1: any, err?: string) => void, err?: string) {
		if (err) {
			callback(null, err);
		}
		else {
			callback(null, 'Internal service error.');
		}
	}

	static handleResponseError(e: Error) {
		console.error(e);
		console.error(e.stack);
	}

	/**
	 * Gets the path to a service
	 * @param u relative uri for the service (e.g. 'country', 'library')
	 * @return full URL to service
	 */
	getService(u: String) {
		return BASE_SERVICES + '/' + u;
	}

	/**
	 * Sends a POST Request to this proxy's service.
	 * @param params to send with the POST
	 * @param onSuccess async callback to be executed when a response is received.
	 */
	doPost(params: any, onSuccess: (res: any) => void) {
		axios.post(this.service, params)
			.then(onSuccess)
			.catch((e: Error) => {
				SpgProxy.handleResponseError(e);
			});
	}
}
