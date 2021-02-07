/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Map() {
    var extent = [0, 0, 1611, 729];
    var projection = new ol.proj.Projection({
        code: 'community_map',
        units: 'm',
        extent: extent
    });
    //属性
    this.map = new ol.Map({
        target: 'map',
        view: new ol.View({
            projection: projection,
            center: ol.extent.getCenter(extent),
            zoom: 2,
            maxZoom: 8
        })
    });
    //方法
    this.vectorLayer;
    this.vectorSource;
    this.imageSource;
    this.map.on();
    this.map.un();
    this.map.render();
}
//定义社区地图原型
Map.prototype = {
    constructor: Map,
    initialize: function () {
        this.initMousePositionControl();
        this.initVectorLayer();
        this.initImageLayer();
    },
    initMousePositionControl: function () {
        var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(6),
            className: 'custom-mouse-position',
            target: 'mouse-position',
            undefinedHTML: '&nbsp'
        });
        this.map.addControl(mousePositionControl);
    },
    initVectorLayer: function () {
        this.vectorSource = new ol.source.Vector({
            wrapX: false //不在地图上重复
        });
        this.vectorLayer = new ol.layer.Vector({
            source: this.vectorSource,
            //默认样式
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 204, 51, 0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 0
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    }),
                })
            })
        });
        this.map.addLayer(this.vectorLayer);
    },
    initImageLayer: function (extent) {
        this.imageLayer = new ol.layer.Image({
            //source
        });
        this.map.addLayer(this.imageLayer);
    },
    addCircle: function (xy, radius, circleName) {
        var circle = new ol.geom.Circle(xy, radius);
        var circleFeature = new ol.Feature(circle);
        circleFeature.setStyle(
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 255, 0, 0.4)',
                    }),
                    text: new ol.style.Text({
                        text: circleName,
                        scale: 1,
                        fill: new ol.style.Fill({
                            color: '#000000',
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffff99',
                            width: 2
                        })
                    }),
                })
                );
        this.vectorSource.addFeature(circleFeature);
    },
    addPolygon: function (values, polygonName) {
        var polygon = new ol.geom.Polygon(values);
        var polygonFeature = new ol.Feature(polygon);
        polygonFeature.setStyle(
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 255, 0.1)',
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'blue',
                        width: 3
                    }),
                    text: new ol.style.Text({
                        text: polygonName,
                        scale: 1,
                        fill: new ol.style.Fill({
                            color: '#000000',
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffff99',
                            width: 3.5
                        })
                    })
                })
                );
        this.vectorSource.addFeature(polygonFeature);
    },
    addLineString: function (xy, lineStringName) {
        var lineString = new ol.geom.LineString(xy);
        var lineStringFeature = new ol.Feature(lineString);
        lineStringFeature.setStyle(
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'red',
                        width: 2
                    }),
                    text: new ol.style.Text({
                        text: lineStringName,
                        scale: 1,
                        fill: new ol.style.Fill({
                            color: '#000000',
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffff99',
                            width: 3.5
                        })
                    }),
                })
                );
        this.vectorSource.addFeature(lineStringFeature);
    },
    addUserIcon: function (xy, userName) {
        var point = new ol.geom.Point(xy);
        var pointFeature = new ol.Feature(point);
        pointFeature.setStyle(
                new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        crossOrigin: 'anonymous',
                        src: 'images/onlinePeople.png'
                    }),
                    text: new ol.style.Text({
                        text: userName,
                        scale: 1,
                        fill: new ol.style.Fill({
                            color: '#000000',
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffff99',
                            width: 3.5
                        })
                    }),
                })
                );
        this.vectorSource.addFeature(pointFeature);
    },
    addCameraIcon: function (xy, cameraName) {
        var point = new ol.geom.Point(xy);
        var pointFeature = new ol.Feature(point);
        pointFeature.setStyle(
                new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        crossOrigin: 'anonymous',
                        src: 'images/mark_green.png'
                    }),
                    text: new ol.style.Text({
                        text: cameraName,
                        scale: 1,
                        fill: new ol.style.Fill({
                            color: '#000000',
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffff99',
                            width: 3.5
                        })
                    }),
                })
                );
        this.vectorSource.addFeature(pointFeature);
    },
    addRoute: function (coords) {
        var lineString = new ol.geom.LineString(coords);
        var lineStringFeature = new ol.Feature(lineString);
        lineStringFeature.setStyle(
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        width: 6,
                        color: 'red'
                    })
                })
                );
        this.vectorSource.addFeature(lineStringFeature);
    },
    addTrackFlag: function (xy) {
        var point = new ol.geom.Point(xy);
        var pointFeature = new ol.Feature(point);
        pointFeature.setStyle(
                new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        scale: 0.3,
                        src: 'images/marker.png'
                    }),
                })
                );
        this.vectorSource.addFeature(pointFeature);
    },
    addGeoMarker: function (xy) {
        var point = new ol.geom.Point(xy);
        var pointFeature = new ol.Feature(point);
        pointFeature.setStyle(
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: 'black'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 2
                        })
                    })
                })
                );
        this.vectorSource.addFeature(pointFeature);
    },
}

function addCircle(xy, radius, circleName) {
    map.addCircle(xy, radius, circleName);
}
;

function addPolygon(values, polygonName) {
    map.addPolygon(values, polygonName);
}
function addLineString(xy, lineStringName) {
    map.addLineString(xy, lineStringName);
}
function addUserIcon(xy, userName) {
    map.addUserIcon(xy, userName);
}
function addCameraIcon(xy, cameraName) {
    map.addCameraIcon(xy, cameraName);
}
;
//
function addRoute(coords) {
    map.addRoute(coords);
}

function addTrackFlag(xy) {
    map.addTrackFlag(xy)
}
function addGeoMarker(xy) {
    map.addGeoMarker(xy)
}


