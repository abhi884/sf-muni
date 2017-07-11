/**
 * 
 * CONSTANTS
 *
 * @description           provides constants for sf-muni proj
 * @author                Abhinay
 * @date                  July 09 2017
 * 
 */

export const WIDTH = 1600;
export const HEIGHT = 650;
export const MAP_CENTER_LAT = 37.7749;
export const MAP_CENTER_LON = -122.4294;
export const MAP_SATURATION = -75;
export const MAP_LIGHTNESS = 10;
export const MAP_ZOOM = 12;
export const MAP_COLOR = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
export const CIRCLE_RADIUS = 3;
export const SELECTED_CIRCLE_RADIUS = 8;
export const REFRESH_LOCATION = 15000;
export const LAYERS = [
	{id:1, value: 'arteries', text: 'Arteries', type: 'line'},
    {id:2, value: 'freeways', text: 'Freeways', type: 'line'},
    {id:3, value: 'neighborhoods', text: 'Neighborhoods', type: 'path'},
    {id:4, value: 'streets', text: 'Streets', type: 'line'}
];

//APIs
export const API_ROUTE_LIST = "http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=sf-muni";
export const API_LOCATION = "http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni";
export const API_ROUTE_PATH = "http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=sf-muni&r=";
