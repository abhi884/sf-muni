/**
 * 
 * Initialization
 *
 * @description           contains initialization code
 * @author                Abhinay
 * @date                  July 09 2017
 * 
 */

import * as CONSTANT from './constant';

export let map = () => {
	let map = new google.maps.Map(d3.select("#map").node(), {
	  	zoom: CONSTANT.MAP_ZOOM,
	  	center: new google.maps.LatLng(CONSTANT.MAP_CENTER_LAT, CONSTANT.MAP_CENTER_LON),
	  	mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: [{	
	    "stylers": [{
	      	"saturation": CONSTANT.MAP_SATURATION
	    }, {
	      	"lightness": CONSTANT.MAP_LIGHTNESS
	    }]
	  }]
	});

	return map;
}

export let select2 = (id, options) => {
	$(id).select2(options);
}