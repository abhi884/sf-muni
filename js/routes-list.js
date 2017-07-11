/**
 * 
 * Routes List
 *
 * @description           used for getting routes list
 * @author                Abhinay
 * @date                  July 09 2017
 * 
 */

import * as CONSTANT from './constant';

export class RouteList  {
	constructor() {
		this.routes = [];
		this.routesList = {};
	}

	getRoutes() {
		let that = this;
		return new Promise((resolve) => {
			let routeCall = $.get(CONSTANT.API_ROUTE_LIST);
			routeCall.then((data) => {
				data = data.route;
				data.map((route) => {
					that.routesList[route.tag] = route;
					route.text = route.title;
					route.id = route.tag;
				});
				that.routes = data;
				resolve();
			})
			.catch((error) => {
				resolve(error);
			})
		})
		
	}
}
