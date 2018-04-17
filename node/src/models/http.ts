/**
 * Basic HttpRequest interface that can be extended by proxies.
 */
export interface Request {
	action: string;
}

/**
 * Basic HttpResponse interface that can be extended by proxies.
 */
export interface Response {
	err?: string;
}
