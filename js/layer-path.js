/**
 * 
 * Layer Paths
 *
 * @description           used for getting and drawing layers
 * @author                Abhinay
 * @date                  July 09 2017
 * 
 */

import * as CONSTANT from './constant';

export class LayerPath  {
  	constructor() {
  		  this.overlayProjection = {};
        this.svgContainer = {};
        this.selectedPath = {};
  	}

    // get layers data and call drawPaths function
  	getPaths(overlayProjection, svgContainer, selectedValue) {
    		let that = this;
        svgContainer.selectAll('.layer-path').remove();
    		that.svgContainer = svgContainer;
        that.overlayProjection = overlayProjection;
        let layers = CONSTANT.LAYERS;
        that.selectedPath = {};
        if (selectedValue > 0) {
            that.selectedPath = layers[selectedValue - 1];
        }

        if (that.selectedPath.value === undefined) {
            return;
        }

    		d3.json(`assets/data/${that.selectedPath.value}.json`, (error, data) => {
    			if (error) throw error;
    			data = [data.features];
          that.drawPaths(data);
    		});
  				
  	}

    // draw layers paths using d3
  	drawPaths(data) {
  		  let that= this;
        let color = CONSTANT.MAP_COLOR;

        let googleMapProjection = (coordinates) => {
          var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
          var pixelCoordinates = that.overlayProjection.fromLatLngToDivPixel(googleCoordinates);
          return [pixelCoordinates.x, pixelCoordinates.y];
        }

        let path = d3.geo.path().projection(googleMapProjection);

        let g = that.svgContainer.selectAll("g")
          .data(data)
          .enter()
          .append("g")
          .attr('class', 'layer-path')
          .attr('pointer-events', 'all');

        let gPath = g.selectAll("path")
                      .data((d) => {
                        return d;
                      })
                      .enter()
                      .append("path")
                      .attr("d", path);

        if (that.selectedPath.type === 'line') {
            gPath.style("fill", 'none')
                 .style("stroke", "#4886b8")
                 .style('opacity', .9);
        } else {
            gPath.style("fill", (d, i) => {
                        return color[i % color.length];
                      })
                      .style("stroke", "#4886b8")
                      .style('opacity', .5);
        }

  	}

	  
}

