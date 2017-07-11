/**
 * 
 * Main.js
 *
 * @description           this is main file of the code. It is starting point.
 * @author                Abhinay
 * @date                  July 09 2017
 * 
 */

import * as CONSTANT from './constant';
import * as init from './init';
import {RouteList} from './routes-list';
import {LiveLocation} from './live-location';
import {RoutePath} from './route-path';
import {LayerPath} from './layer-path';

// initialize
let map = init.map();
let stopsObj = {};
let liveOverlay = new google.maps.OverlayView();;
let liveLayer;
let overlayProjection;
let svgContainer;
let divTooltip; 
let route = new RouteList();
let location = new LiveLocation();
let rPath = new RoutePath();
let layerPath = new LayerPath();

// get routes list
route.getRoutes().then((data) => {
	$('#route-select').select2({
        data: route.routes
    });

	location.newRoutes = route.routesList;
	location.getLocations(map, liveOverlay, liveLayer, overlayProjection, svgContainer, divTooltip);
}, (error) => {
	
});

// event handlers on layer and route selection
$('#route-select').select2({}).on("change", (e) => {
	updateRoutesAndLocations();
});

$('#layer-select').select2({
	data: CONSTANT.LAYERS,
    maximumSelectionLength: 1
}).on("change", (e) => {
	updateLayerPath();
});

// map zoom event handler
map.addListener('zoom_changed', () => {
    updateLayerPath();
    if (location.initialized) {
    	//location.drawLocations();	
    	updateRoutesAndLocations();
    }
});

// update routes path and vehicle locations
let updateRoutesAndLocations = () => {
	if ((svgContainer === undefined) && (location.svgContainer.length === undefined)) {
		return;
	} else if (svgContainer === undefined) {
		svgContainer = location.svgContainer;
		overlayProjection = location.overlayProjection;
	}

	let selRoutes = $("#route-select option:selected");
	let sRoutes = [];
    for (let i = 0; i < selRoutes.length; i++) {
        sRoutes.push(selRoutes[i].value);
    }

    svgContainer.selectAll('.layer-route').remove();
    svgContainer.selectAll('.live-markers').remove();

    let selectedRoutes = sRoutes;

    rPath.svgContainer = svgContainer;
    rPath.overlayProjection = overlayProjection;

    for (var i = 0; i < sRoutes.length; i++) {
        rPath.getRoute(sRoutes[i]);
    }
    
    location.selectedRoutes = sRoutes;
    location.drawLocations();
}

// update layers path
let updateLayerPath = () => {
	if ((svgContainer === undefined) && (location.svgContainer.length === undefined)) {
		return;
	} else if (svgContainer === undefined) {
		svgContainer = location.svgContainer;
		overlayProjection = location.overlayProjection;
	}

	let selLayers = $("#layer-select option:selected");
	let sLayers = [];

	if (selLayers.length === 1) {
		layerPath.getPaths(overlayProjection, svgContainer, selLayers[0].value);
	} else {
		layerPath.getPaths(overlayProjection, svgContainer, '');
	}
}
