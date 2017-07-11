/**
 * 
 * Live Locations
 *
 * @description           used for getting and drawing live locations
 * @author                Abhinay
 * @date                  July 09 2017
 * 
 */

import * as CONSTANT from './constant';

export class LiveLocation  {
  	constructor() {
  		this.vehicleLocations = [];
  		this.vehicleLocationsObj = {};
  		this.routes = {};
  		this.initialized = false;
  		this.svgContainer = {};
  		this.overlayProjection = {};
  		this.divTooltip = {};
      this.selectedRoutes = [];
  	}

  	set newRoutes(routesObj) {
  		this.routes = routesObj;
  	}

    // initilize overlay
  	initOverlay(map, liveOverlay, liveLayer, overlayProjection, svgContainer, divTooltip) {
  		var that = this;
  		liveOverlay.onAdd = function() {
            liveLayer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "live-locations");
            svgContainer = liveLayer.append("svg")
                    .attr('width', $(window).width())
                    .attr('height', $(window).height())
                    .attr('class', 'overlay')
                    .attr('pointer-events', 'all');

            divTooltip = d3.select("body").append("div") 
              .attr("class", "tooltip")       
              .style("opacity", 0);

            that.svgContainer = svgContainer;
            that.divTooltip = divTooltip;

            liveOverlay.draw = function() {
                //drawLocations();
                overlayProjection = this.getProjection();
                that.overlayProjection = overlayProjection;
                //getPaths();
                that.drawLocations();
                setInterval(function() {
  			  	      that.getLocations();
  			        }, CONSTANT.REFRESH_LOCATION);
            }
      	}
      	liveOverlay.setMap(map);
  	}

    // get live vehicle locations data and call drawLocations function
  	getLocations(map, liveOverlay, liveLayer, overlayProjection, svgContainer, divTooltip) {
  		let that = this;
  		d3.json(CONSTANT.API_LOCATION, function(error, data) {
  			if (error) throw error;
  			data = data.vehicle;
  			that.vehicleLocations = data.map((location) => {
  				location.title = that.routes[location.routeTag].title;
  				return location;
  			});

  			if (!that.initialized) {
  				that.initOverlay(map, liveOverlay, liveLayer, overlayProjection, svgContainer, divTooltip);
  	        	that.initialized = true;
  			} else {
  				that.drawLocations();
  			}
  				
  		});
  				
  	}

    // draw vehicle locations using d3
  	drawLocations() {
  		let that= this;
      let locations = [];
      let radius = CONSTANT.CIRCLE_RADIUS;

      if (that.selectedRoutes.length === 0) {
          that.svgContainer.selectAll('.layer-route').remove();
          locations = that.vehicleLocations;
      } else {
        for (let i = 0; i < that.selectedRoutes.length; i++) {
            for (let j = 0; j < that.vehicleLocations.length; j++) {
                if (that.selectedRoutes[i] === that.vehicleLocations[j].routeTag) {
                    locations.push(that.vehicleLocations[j]);  
                    //break;
                }
            }
        }

          radius = CONSTANT.SELECTED_CIRCLE_RADIUS;
      }

      that.svgContainer.selectAll('.live-markers').remove();
      
      let circles = that.svgContainer.selectAll("circle")
                .data(locations)
                .enter()
                .append("circle")
                .attr('class', 'live-markers')
                .style("cursor", "pointer");

      let circleAttributes = circles
             .attr("cx", (d) => { 
                let points = that.transform(d);
                return points.x; 
              })
             .attr("cy", (d) => { 
                let points = that.transform(d);
                return points.y; 
              })
             .attr("r", radius)
             .style("fill", "green")
             .on("mouseover", (d) => {   
                that.divTooltip.transition()    
                    .duration(200)    
                    .style("opacity", .9);    
                
                let bound = ''; 
                if (d.dirTag.indexOf('_O') === -1){
                    bound = 'Outbound';
                } else if (d.dirTag.indexOf('_I') === -1){
                    bound = 'Inbound';
                }

                that.divTooltip.html(d.title + "<br/>Direction : "  + bound )  
                    .style("left", (d3.event.pageX + 10) + "px")   
                    .style("top", (d3.event.pageY - 28) + "px");  
                })          
             .on("mouseout", (d) => {
                that.divTooltip.transition()    
                    .duration(500)    
                    .style("opacity", 0); 
             });
  	}

  	transform(d) {
        d = new google.maps.LatLng(d.lat, d.lon);
        d = this.overlayProjection.fromLatLngToDivPixel(d);
        return d;
    }
}

