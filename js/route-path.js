/**
 * 
 * Route paths
 *
 * @description           used for getting and drawing route paths
 * @author                Abhinay
 * @date                  July 09 2017
 * 
 */

import * as CONSTANT from './constant';

export class RoutePath  {
	constructor() {
		this.routesData = {};
		this.stops = {};
		this.svgContainer = {};
		this.overlayProjection = {};
		this.initialized = false;
	}

	// get route data and call draw route function
	getRoute(route) {
		let that = this;
		
		if (that.routesData[route] !== undefined) {
			that.drawRoute(that.routesData[route].route.direction);
		} else {
			d3.json(CONSTANT.API_ROUTE_PATH + route, (error, data) => {
				if (error) throw error;
				let rStops = data.route.stop;
	            rStops.map((stop) => {
	            	that.stops[stop.tag] = stop;
	           	});


	            that.routesData[route] = data;
	            data = data.route.direction;
	            that.drawRoute(data);
					
			});
		}				
	}

	// draw routes using d3
	drawRoute(data) {
		let that= this;
        var outBoundData = data[0].stop;
        var inBoundData = data[1].stop;

        let lineFunction = d3.svg.line()
	                          .x(function(d) { 
	                            var points = that.transform(that.stops[d.tag]);
	                            return points.x;  
	                          })
	                          .y(function(d) { 
	                            var points = that.transform(that.stops[d.tag]);
	                            return points.y;  
	                          })
	                          .interpolate("linear");

        let lineGraph = that.svgContainer.append("path")
                            .attr("d", lineFunction(outBoundData))
                            .attr('class', function(d){
                              return 'layer-route out-bound'; 
                            })
                            .attr("stroke", "orange")
                            .attr("stroke-width", 4)
                            .attr("fill", "none")
                            .attr('pointer-events', 'all');
        that.svgContainer.append("path")
	        .attr("d", lineFunction(inBoundData))
	        .attr('class', function(d){
	          return 'layer-route in-bound'; 
	        })
	        .attr("stroke", "yellow")
	        .attr("stroke-width", 4)
	        .attr("fill", "none")
	        .attr('pointer-events', 'all');
	}

    transform(d) {
        d = new google.maps.LatLng(d.lat, d.lon);
        d = this.overlayProjection.fromLatLngToDivPixel(d);
        return d;
    }
}

