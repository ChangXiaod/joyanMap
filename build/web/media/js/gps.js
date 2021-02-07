/*
 WGS-84：是国际标准，GPS坐标（Google Earth使用、或者GPS模块）
 GCJ-02：中国坐标偏移标准，Google Map、高德、腾讯使用
 BD-09：百度坐标偏移标准，Baidu Map使用
 
 //WGS-84 to GCJ-02
 GPS.gcj_encrypt();
 
 //GCJ-02 to WGS-84 粗略
 GPS.gcj_decrypt();
 
 //GCJ-02 to WGS-84 精确(二分极限法)
 // var threshold = 0.000000001; 目前设置的是精确到小数点后9位，这个值越小，越精确，但是javascript中，浮点运算本身就不太精确，九位在GPS里也偏差不大了
 GSP.gcj_decrypt_exact();
 
 //GCJ-02 to BD-09
 GPS.bd_encrypt();
 
 //BD-09 to GCJ-02
 GPS.bd_decrypt();
 
 //求距离
 GPS.distance();
 
 示例：
 document.write("GPS: 39.933676862706776,116.35608315379092<br />");
 var arr2 = GPS.gcj_encrypt(39.933676862706776, 116.35608315379092);
 document.write("中国:" + arr2['lat']+","+arr2['lon']+'<br />');
 var arr3 = GPS.gcj_decrypt_exact(arr2['lat'], arr2['lon']);
 document.write('逆算:' + arr3['lat']+","+arr3['lon']+' 需要和第一行相似（目前是小数点后9位相等）');
 */
var GPS = {
    PI: 3.14159265358979324,
    x_pi: 3.14159265358979324 * 3000.0 / 180.0,
    delta: function (lat, lon) {
        // Krasovsky 1940
        //
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;
        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return {'lat': dLat, 'lon': dLon};
    },
    //WGS-84 to GCJ-02
    WGStoGCJ: function (wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lon': wgsLon};

        var d = this.delta(wgsLat, wgsLon);
        return {'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon};
    },
    //GCJ-02 to WGS-84
    gcj_decrypt: function (gcjLat, gcjLon) {
        if (this.outOfChina(gcjLat, gcjLon))
            return {'lat': gcjLat, 'lon': gcjLon};

        var d = this.delta(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
    },
    //GCJ-02 to WGS-84 exactly
    GCJtoWGS: function (gcjLat, gcjLon) {
        var initDelta = 0.01;
        var threshold = 0.000000001;
        var dLat = initDelta, dLon = initDelta;
        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
        var wgsLat, wgsLon, i = 0;
        while (1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            var tmp = this.WGStoGCJ(wgsLat, wgsLon)
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                break;

            if (dLat > 0)
                pLat = wgsLat;
            else
                mLat = wgsLat;
            if (dLon > 0)
                pLon = wgsLon;
            else
                mLon = wgsLon;

            if (++i > 10000)
                break;
        }
        //console.log(i);
        return {'lat': wgsLat, 'lon': wgsLon};
    },
    //GCJ-02 to BD-09
    GCJtoBD: function (gcjLat, gcjLon) {
        var x = gcjLon, y = gcjLat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
        bdLon = z * Math.cos(theta) + 0.0065;
        bdLat = z * Math.sin(theta) + 0.006;
        return {'lat': bdLat, 'lon': bdLon};
    },
    //BD-09 to GCJ-02
    BDtoGCJ: function (bdLat, bdLon) {
        var x = bdLon - 0.0065, y = bdLat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
        var gcjLon = z * Math.cos(theta);
        var gcjLat = z * Math.sin(theta);
        return {'lat': gcjLat, 'lon': gcjLon};
    },
    //WGS-84 to Web mercator
    //mercatorLat -> y mercatorLon -> x
    mercator_encrypt: function (wgsLat, wgsLon) {
        var x = wgsLon * 20037508.34 / 180.;
        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
        y = y * 20037508.34 / 180.;
        return {'lat': y, 'lon': x};
        /*
         if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
         return null;
         var x = 6378137.0 * wgsLon * 0.017453292519943295;
         var a = wgsLat * 0.017453292519943295;
         var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
         return {'lat' : y, 'lon' : x};
         //*/
    },
    // Web mercator to WGS-84
    // mercatorLat -> y mercatorLon -> x
    mercator_decrypt: function (mercatorLat, mercatorLon) {
        var x = mercatorLon / 20037508.34 * 180.;
        var y = mercatorLat / 20037508.34 * 180.;
        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
        return {'lat': y, 'lon': x};
        /*
         if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
         return null;
         if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
         return null;
         var a = mercatorLon / 6378137.0 * 57.295779513082323;
         var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
         var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
         return {'lat' : y, 'lon' : x};
         //*/
    },
    // two point's distance
    distance: function (latA, lonA, latB, lonB) {
        var earthR = 6371000.;
        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
        var s = x + y;
        if (s > 1)
            s = 1;
        if (s < -1)
            s = -1;
        var alpha = Math.acos(s);
        var distance = alpha * earthR;
        return distance;
    },
    outOfChina: function (lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },
    transformLat: function (x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },
    transformLon: function (x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    }
};
//gpsToBd
function gpsToBd(lng, lat) {
    var tem = GPS.WGStoGCJ(lat, lng);
    var result = GPS.GCJtoBD(tem.lat, tem.lon);
    result.lng = result.lon;
    return result;
}
//bdToGps
function bdToGps(lng, lat) {
    var tem = GPS.BDtoGCJ(lat, lng);
    var result = GPS.GCJtoWGS(tem.lat, tem.lon);
    result.lng = result.lon;
    return result;
}

//gcjToGps
function gcjToGps(lng, lat) {
    var result = GPS.GCJtoWGS(lat, lng);
    result.lng = result.lon;
    return result;
}

//添加单个gif图标
//作者：豆增发 2019-11-07
function addGifMark(_map, name, _point, _imgParam, _elementId, _clickFunc) {
    //新增放置overly的div
    var _overlay = document.getElementById(_elementId);
    _overlay.id = _elementId;
    if (document.getElementById(name))
    {
        var _removeLyr = _map.getOverlayById(name);
        _map.removeOverlay(_removeLyr);
    }
    var sElement = document.createElement("div");
    sElement.id = "div_" + name;
    sElement.style.width = _imgParam.width;
    sElement.style.height = _imgParam.height;
    //设置元素属性
    var attr = {};
    attr.x = _point.x;
    attr.y = _point.y;
    sElement.attr = attr;
    //设置元坐标 
    sElement.x = _point.x;
    sElement.y = _point.y;
    //图片元素
    var img = document.createElement("img");
    img.src = _imgParam.src;//拼接图片地址
    img.style.width = _imgParam.width;
    img.style.height = _imgParam.height;
    sElement.appendChild(img);
    _overlay.appendChild(sElement);

    //新增overly
    var lyr = new ol.Overlay({
        id: name,
        class: 'gif',
        //positioning: 'center-center',
        //overly放置的div
        element: sElement,
        stopEvent: false
    });

    //逐个把overly添加到地图上
    map.addOverlay(lyr);
    //坐标系转换
    var position = ol.proj.transform([_point.x, _point.y], 'EPSG:4326', 'EPSG:3857');
    lyr.setPosition([position[0], position[1]]); //显示
    lyr.setPositioning("bottom-center");
    //如果点击事件
    if (_clickFunc) {
        document.getElementById(name).onclick = function (evt) {
            if (!evt.currentTarget.attr) {
                return;
            }
            var attr = evt.currentTarget.attr;
            attr.x = evt.currentTarget.attr.x ? evt.currentTarget.attr.x : 0;
            attr.y = evt.currentTarget.attr.y ? evt.currentTarget.attr.y : 0;
            _clickFunc(attr);
        };
    }

}
/**
 * @description 撒点（以overlay的element方式，解决openlayers无法加载gif图片等问题）
 * @param {Map} _map 地图对象
 * @param {Array} _points 点集，格式[{x:129.76694,y:47.43563}]
 * @param {Object} _imgParam 图片名称，格式{src:图片url,width:50px,height:100px），格式{src:图片url,width:图片宽,height:图片高}
 * @param {String} _elementId overlay添加的容器Id
 * @param {Function} _clickFunc 点击图片回调函数
 */
//作者：豆增发 2019-11-07
function addGifMarks(_map, _points, _imgParam, _elementId, _clickFunc) {
    //循环点集
    for (var i = 0; i < _points.length; i++) {
        //新增放置overly的div
        var _overlay = document.getElementById(_elementId);
        _overlay.id = _elementId;
        if (document.getElementById("overlay" + i))
        {
            var _removeLyr = _map.getOverlayById("overlay" + i);
            _map.removeOverlay(_removeLyr);
        }
        var sElement = document.createElement("div");
        sElement.id = "div_" + i;
        sElement.style.width = _imgParam.width;
        sElement.style.height = _imgParam.height;
        //设置元素属性
        var attr = {};
        attr.x = _points[i].x;
        attr.y = _points[i].y;
        sElement.attr = attr;
        //设置元坐标 
        sElement.x = _points[i].x;
        sElement.y = _points[i].y;
        //图片元素
        var img = document.createElement("img");
        img.src = _imgParam.src;//拼接图片地址
        img.style.width = _imgParam.width;
        img.style.height = _imgParam.height;
        sElement.appendChild(img);
        _overlay.appendChild(sElement);

        //新增overly
        var lyr = new ol.Overlay({
            id: 'overlay' + i,
            class: 'gif',
            positioning: 'center-center',
            //overly放置的div
            element: sElement,
            stopEvent: false
        });

        //逐个把overly添加到地图上
        map.addOverlay(lyr);
        //坐标系转换
        var position = ol.proj.transform([_points[i].x, _points[i].y], 'EPSG:4326', 'EPSG:3857');
        lyr.setPosition([position[0], position[1]]); //显示

        //如果点击事件
        if (_clickFunc) {
            document.getElementById('overlay' + i).onclick = function (evt) {
                if (!evt.currentTarget.attr) {
                    return;
                }
                var attr = evt.currentTarget.attr;
                attr.x = evt.currentTarget.attr.x ? evt.currentTarget.attr.x : 0;
                attr.y = evt.currentTarget.attr.y ? evt.currentTarget.attr.y : 0;
                _clickFunc(attr);
            };
        }
    }
}
//清空指定的gif
//作者：豆增发 2019-11-07
function clearGif(name) {
    var olLyr = map.getOverlayById(name);
    olLyr.setPosition(undefined);
    map.removeLayer(olLyr);
}

//清空所有的动态gif
//作者：豆增发 2019-11-07
function clearAllGif() {
    var olLyrs = map.getOverlays().getArray();
    var olLyrsLength = map.getOverlays().getArray().length;
    for (var i = 0; i < olLyrsLength; i++) {
//        if (olLyrs[i].id != undefined && olLyrs[i].id.indexOf("overlay") >= 0) {
        olLyrs[i].setPosition(undefined);
        map.removeLayer(olLyrs[i]);
        //      }
    }
}

//修改指定gif的大小
//作者：豆增发 2019-11-07
function setGifSize(name, width, height) {
    var olLyr = map.getOverlayById(name);
    if (olLyr == undefined) {
        return;
    } else {
        //设置div的尺寸
        var div = olLyr.element;
        //设置动态图片的尺寸
        var childs = div.childNodes;
        var img = childs[0].childNodes[0];
        //设置图片的高和宽
        img.style.width = width;
        img.style.height = height;
    }
}

//地图全局变量
var map;
//初始化地图
function initMaps() {
    var scaleLineControl = new ol.control.ScaleLine({
        //设置度量单位为米
        units: 'metric',
        target: 'scalebar',
        className: 'ol-scale-line'
    });
    projzh.ll2smerc = sphericalMercator.forward;
    projzh.smerc2ll = sphericalMercator.inverse;


//    var baiduMercatorProj = new ol.proj.Projection({
//        code: 'baidu',
//        extent: ol.extent.applyTransform(extent, projzh.ll2bmerc),
//        units: 'm'
//    });
//
//    ol.proj.addProjection(baiduMercatorProj);
//    ol.proj.addCoordinateTransforms('EPSG:4326', baiduMercatorProj, projzh.ll2bmerc, projzh.bmerc2ll);

    // //创建地图中心点  西安经纬度[109.262151, 34.689819]
    var center = ol.proj.transform([109.24056351184844, 34.685300995679], 'EPSG:4326', 'EPSG:3857')
    //添加使用离线瓦片地图的层
    var ylMap = new ol.layer.Tile({
        source: new ol.source.XYZ({
            projection: "EPSG:3857",
            url: 'http://localhost:8080/yanliang/{z}/{x}/{y}.png'
        })
    });

    var wgsMap = new ol.layer.Tile({
        source: new ol.source.XYZ({
            projection: "EPSG:3857",
            url: 'http://localhost:8080/wgs/{z}/{x}/{y}.png'
        })
    });

    map = new ol.Map({
        layers: [
            wgsMap,
            ylMap,
            vector
        ],
        renderer: 'canvas',
        view: new ol.View({
            center: center,
            minZoom: 11,
            maxZoom: 22,
            zoom: 17,
            projection: "EPSG:3857"
            // extent: ol.proj.transformExtent([104.2869, 35.2494, 107.6536, 38.8758], 'EPSG:4326', 'EPSG:3857')
        }),
        target: 'map'
    });

    //初始化文本层
    text_source = new ol.source.Vector();
    //创建图层
    text_layer = new ol.layer.Vector({
        source: text_source
    });
    map.addLayer(text_layer);
    map.addControl(scaleLineControl);   

    //添加报警图层
    var point_div = document.getElementById("css_animation");
    var point_overlay = new ol.Overlay({
        element: point_div,
        positioning: 'center-center'
    });
    map.addOverlay(point_overlay);
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 50
        }
    });



    
// 图标点击事件
    // map.on('click', function (e) {
    //     var feature = map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    //         return feature;
    //     });
    //     if (feature) {
    //         //coodinate存放了点击时的坐标信息
    //         var coordinates = feature.getGeometry().getCoordinates();
    //         var iconName = feature.get('name');
    //         // let type = feature.get('type');   
    //         var property = feature.getProperties();
    //         var type = feature.getGeometry().getType();
    //         content.innerHTML = "";
    //         console.dir(type);
    //         console.dir(iconName);
    //         //设置弹出框内容，可以HTML自定义
    //         if (type == 'Point' && property['class'] != null && property['class'] == 'staff') {
    //             var params = {};
    //             params.sid = "get_police_location";
    //             params.condition = "name='" + iconName + "'";
    //             $.post("QueryDataServlet", params, function (mdata) {
    //                 var data = JSON.parse(mdata);
    //                 if (data.code == 0) {
    //                     //成功
    //                     var items = data.result.data;
    //                     //  console.dir(items);
    //                     if (items != null && items != undefined) {
    //                         var item = items[0];
    //                         content.innerHTML = "<p>姓名：" + item.name + "</p>" + "<p>性别：" + item.gender + "</p>" + "<p>电话：" + item.telephone + " </p>" + "<p>单位：" + item.company + "</p><p>最后时间：" + item.time + "</p>";
    //                     }
    //                 }
    //             });
    //         }

    //         //显示overlay
    //         if (content.innerHTML == "") {
    //             overlay.setPosition(undefined);
    //             closer.blur();
    //             return false;
    //         } else {
    //             //设置overlay的显示位置
    //             overlay.setPosition(coordinates);
    //             map.addOverlay(overlay);
    //         }
    //     }
    // });

    closer.onclick = function () {
        if (types != -1) {
            var rotation = nowfeature.get('rotation');
            if (types == 0) {
                nowfeature.getStyle().setImage(new ol.style.Icon({
                    anchor: [0.5, 1.5],
                    scale: 1,
                    rotation: rotation,
                    src: 'images/002.png'
                }));
            } else if (types == 1) {
                nowfeature.getStyle().setImage(new ol.style.Icon({
                    anchor: [0.5, 1.5],
                    scale: 1,
                    rotation: rotation,
                    src: 'images/0041.png'
                }));
            } else if (types == 3) {
                nowfeature.getStyle().setImage(new ol.style.Icon({
                    anchor: [0.5, 1.5],
                    scale: 1,
                    rotation: rotation,
                    src: 'images/0042.png'
                }));
            }
        }
        boat_source.changed();
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    //初始化升压站图层
    station_source = new ol.source.Vector({
        wrapX: false
    }
    );
    station_layer = new ol.layer.Vector({
        source: station_source,
        zIndex: 9998

    });
    //添加图层到地图
    map.addLayer(station_layer);
 
    //初始化船只图层
    boat_source = new ol.source.Vector({
        wrapX: false
    });
    boat_layer = new ol.layer.Vector({
        source: boat_source,
        zIndex: 9999
    });
    //添加图层到地图
    map.addLayer(boat_layer);

    //初始化工作人员位置图层
    person_source = new ol.source.Vector({
        wrapX: false
    });
    person_layer = new ol.layer.Vector({
        source: person_source,
    });
    //添加图层到地图
    map.addLayer(person_layer);

    //初始化其他人员位置图层
    staff_source = new ol.source.Vector({
        wrapX: false
    });
    staff_layer = new ol.layer.Vector({
        source: staff_source,
    });
    //添加图层到地图
    map.addLayer(staff_layer);

    //初始化安检门位置
    door_source = new ol.source.Vector({
        wrapX: false
    });
    door_layer = new ol.layer.Vector({
        source: door_source,
    });
    //添加图层到地图
    map.addLayer(door_layer);

    // $('.selectpicker').on('changed.bs.select', function (e) {
    $("#batch1").change(function () {
        var feature = boat_source.getFeatures();
        var shipname = $("#batch1").val();
        for (var i = 0; i < feature.length; i++) {
            var name = feature[i].get('name');
            //console.dir(name);
            if (shipname == name) {
                // console.dir("xxx"+name);
                var coordinates1 = feature[i].getGeometry().getCoordinates();
                var rotation1 = feature[i].get('rotation');
                var type1 = feature[i].get('type');
                nowfeature = feature[i];
                //console.dir(type1);
                if (type1 == 0) {
                    feature[i].getStyle().setImage(new ol.style.Icon({
                        anchor: [0.5, 1.5],
                        scale: 1,
                        rotation: rotation1,
                        src: 'images/002mark.png'
                    }));
                } else if (type1 == 1) {
                    feature[i].getStyle().setImage(new ol.style.Icon({
                        anchor: [0.5, 1.5],
                        scale: 1,
                        rotation: rotation1,
                        src: 'images/0041mark.png'
                    }));
                } else if (type1 == 3) {
                    feature[i].getStyle().setImage(new ol.style.Icon({
                        anchor: [0.5, 1.5],
                        scale: 1,
                        rotation: rotation1,
                        src: 'images/0042mark.png'
                    }));
                }
                types = type1;
                boat_source.changed();
                var params = {};
                params.sid = "get_realshiplocation";
                params.condition = "shipNo='" + name + "'";
                $.post("QueryDataServlet", params, function (mdata) {
                    var data = JSON.parse(mdata);
                    if (data.code == 0) {
                        //成功
                        var items = data.result.data;
                        console.dir(items);
                        if (items != null && items != undefined) {
                            var item = items[0];
                            shipNo = item.shipNo;
                            iname = item.shipName;
                            shipTon = item.shipTon;
                            shipLong = item.shipLong;
                            shipWide = item.shipWide;
                            sraft = item.sraft;
                            longitude = item.longitude.substring(0, 3) + "." + item.longitude.substring(4, 9);
                            latitude = item.latitude.substring(0, 2) + "." + item.latitude.substring(3, 8);
                            var longitude1 = parseInt(item.longitude.replace(/\./g, "").substring(0, 11)) / 1000000;
                            var latitude1 = parseInt(item.latitude.replace(/\./g, "").substring(0, 11)) / 1000000;
                            speed = item.speed;
                            lastTime = item.lastTime;
                            isSelfShip = item.isSelfShip;
                            rotation = parseInt(item.headBearing);
                            map.getView().setCenter(ol.proj.fromLonLat([longitude1, latitude1]));
                            content.innerHTML = "<input type='radio'name='check' id='active1'style='display:none;' checked><label for='active1' onclick='showBoat()'>船舶信息</label><input type='radio'name='check' id='active2'style='display:none;' checked><label for='active2' onclick='showStaff()'>人员信息</label><p>MMSI：" + item.shipNo + "</p>" + "<p>船舶名称：" + item.shipName + "</p>" + "<p>船首向：" + rotation + "</p>" + "<p>吨位：" + item.shipTon + "</p>" + "<p>船长：" + item.shipLong + "</p>" + "<p>船宽：" + item.shipWide + "</p>" + "<p>吃水：" + item.sraft + "</p>" + "<p>航速：" + item.speed + "</p>" + "<p>最后时间：" + item.lastTime + "</p>" + "<p>是否公司船舶：" + item.isSelfShip + "</p><p style='height:25px'><label for='speed1' style='margin-left: 5px;margin-top: 0px'>速度：<input id='speed1' type='range' min='10' max='999' step='10' value='60' style='width:50%'></label></p><p style='height:25px'><button id='routereplay' style='margin-left:80%;margin-bottom: 20px;height: 25px;background:blue;color:white;' onclick='routereplay()'>轨迹</button></p>";
                        }
                    }
                });

                overlay.setPosition(coordinates1);
                map.addOverlay(overlay);
            }
        }
    });
    map.getView().on('change:resolution', changeScale);
}
function changeScale() {
    var feature = boat_source.getFeatures();
    // console.dir(map.getView().getZoom());

    if (map.getView().getZoom() > 11) {

    } else {
        clearAllGif();
        for (var i = 0; i < feature.length; i++) {
            var rotation = feature[i].get('rotation');
            var type = feature[i].get('type');
            //设置图标大小
            if (type == 0) {
                feature[i].getStyle().setImage(new ol.style.Icon({
                    anchor: [0.5, 1.5],
                    //scale: map.getView().getZoom() * TEXT_SCALE*0.01,
                    rotation: rotation,
                    src: 'images/ship.png'
                }));
            } else if (type == 1) {
                feature[i].getStyle().setImage(new ol.style.Icon({
                    anchor: [0.5, 1.5],
                    //scale: map.getView().getZoom() * TEXT_SCALE*0.01,
                    rotation: rotation,
                    src: 'images/ship2.png'
                }));
            } else if (type == 3) {
                feature[i].getStyle().setImage(new ol.style.Icon({
                    anchor: [0.5, 1.5],
                    //scale: map.getView().getZoom() * TEXT_SCALE*0.01,
                    rotation: rotation,
                    src: 'images/ship1.png'
                }));
            }
        }
        text_layer.setVisible(false);
    }

    // 重新设置文字的缩放率，基于层级20来做缩放
    features = text_source.getFeatures();
    for (var i = 0; i < features.length; i++) {
        //设置文字大小
        features[i].getStyle().getText().setScale(map.getView().getZoom() * TEXT_SCALE * 0.5);
    }
    features = station_source.getFeatures();
    for (var i = 0; i < features.length; i++) {
        //设置文字大小
        features[i].getStyle().getText().setScale(map.getView().getZoom() * TEXT_SCALE * 0.5);
    }

    features = person_source.getFeatures();
    for (var i = 0; i < features.length; i++) {
        //设置图标大小
        features[i].getStyle().getImage().setScale(map.getView().getZoom() * IMG_SCALE);
        //设置文字大小
        features[i].getStyle().getText().setScale(map.getView().getZoom() * TEXT_SCALE);
    }

}
// 根据参数名称获取参数值   
function getParamValue(name) {
    var paramsArray = getUrlParams();
    if (paramsArray != null) {
        for (var i = 0; i < paramsArray.length; i++) {
            for (var j in paramsArray[i]) {
                if (j == name) {
                    return paramsArray[i][j];
                }
            }
        }
    }
    return null;
}
//分解url获得数据部分  
function getUrlParams() {
    var search = window.location.search;
    // 写入数据字典   
    var tmparray = search.substr(1, search.length).split("&");
    var paramsArray = new Array;
    if (tmparray != null) {
        for (var i = 0; i < tmparray.length; i++) {
            var reg = /[=|^==]/; // 用=进行拆分，但不包括==   
            var set1 = tmparray[i].replace(reg, '&');
            var tmpStr2 = set1.split('&');
            var array = new Array;
            array[tmpStr2[0]] = tmpStr2[1];
            paramsArray.push(array);
        }
    }
    // 将参数数组进行返回   
    return paramsArray;
}
var forEachPoint = function (func) {
    return function (input, opt_output, opt_dimension) {
        var len = input.length;
        var dimension = opt_dimension ? opt_dimension : 2;
        var output;
        if (opt_output) {
            output = opt_output;
        } else {
            if (dimension !== 2) {
                output = input.slice();
            } else {
                output = new Array(len);
            }
        }
        for (var offset = 0; offset < len; offset += dimension) {
            func(input, output, offset)
        }
        return output;
    };
};

var sphericalMercator = {}

var RADIUS = 6378137;
var MAX_LATITUDE = 85.0511287798;
var RAD_PER_DEG = Math.PI / 180;

sphericalMercator.forward = forEachPoint(function (input, output, offset) {
    var lat = Math.max(Math.min(MAX_LATITUDE, input[offset + 1]), -MAX_LATITUDE);
    var sin = Math.sin(lat * RAD_PER_DEG);

    output[offset] = RADIUS * input[offset] * RAD_PER_DEG;
    output[offset + 1] = RADIUS * Math.log((1 + sin) / (1 - sin)) / 2;
});

sphericalMercator.inverse = forEachPoint(function (input, output, offset) {
    output[offset] = input[offset] / RADIUS / RAD_PER_DEG;
    output[offset + 1] = (2 * Math.atan(Math.exp(input[offset + 1] / RADIUS)) - (Math.PI / 2)) / RAD_PER_DEG;
});


var baiduMercator = {}

var MCBAND = [12890594.86, 8362377.87,
    5591021, 3481989.83, 1678043.12, 0];

var LLBAND = [75, 60, 45, 30, 15, 0];

var MC2LL = [
    [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331,
        200.9824383106796, -187.2403703815547, 91.6087516669843,
        -23.38765649603339, 2.57121317296198, -0.03801003308653,
        17337981.2],
    [-7.435856389565537e-9, 0.000008983055097726239,
        -0.78625201886289, 96.32687599759846, -1.85204757529826,
        -59.36935905485877, 47.40033549296737, -16.50741931063887,
        2.28786674699375, 10260144.86],
    [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616,
        59.74293618442277, 7.357984074871, -25.38371002664745,
        13.45380521110908, -3.29883767235584, 0.32710905363475,
        6856817.37],
    [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591,
        40.31678527705744, 0.65659298677277, -4.44255534477492,
        0.85341911805263, 0.12923347998204, -0.04625736007561,
        4482777.06],
    [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062,
        23.10934304144901, -0.00023663490511, -0.6321817810242,
        -0.00663494467273, 0.03430082397953, -0.00466043876332,
        2555164.4],
    [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8,
        7.47137025468032, -0.00000353937994, -0.02145144861037,
        -0.00001234426596, 0.00010322952773, -0.00000323890364,
        826088.5]];

var LL2MC = [
    [-0.0015702102444, 111320.7020616939, 1704480524535203,
        -10338987376042340, 26112667856603880,
        -35149669176653700, 26595700718403920,
        -10725012454188240, 1800819912950474, 82.5],
    [0.0008277824516172526, 111320.7020463578, 647795574.6671607,
        -4082003173.641316, 10774905663.51142, -15171875531.51559,
        12053065338.62167, -5124939663.577472, 913311935.9512032,
        67.5],
    [0.00337398766765, 111320.7020202162, 4481351.045890365,
        -23393751.19931662, 79682215.47186455, -115964993.2797253,
        97236711.15602145, -43661946.33752821, 8477230.501135234,
        52.5],
    [0.00220636496208, 111320.7020209128, 51751.86112841131,
        3796837.749470245, 992013.7397791013, -1221952.21711287,
        1340652.697009075, -620943.6990984312, 144416.9293806241,
        37.5],
    [-0.0003441963504368392, 111320.7020576856, 278.2353980772752,
        2485758.690035394, 6070.750963243378, 54821.18345352118,
        9540.606633304236, -2710.55326746645, 1405.483844121726,
        22.5],
    [-0.0003218135878613132, 111320.7020701615, 0.00369383431289,
        823725.6402795718, 0.46104986909093, 2351.343141331292,
        1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]];


function getRange(v, min, max) {
    v = Math.max(v, min);
    v = Math.min(v, max);

    return v;
}

function getLoop(v, min, max) {
    var d = max - min;
    while (v > max) {
        v -= d;
    }
    while (v < min) {
        v += d;
    }

    return v;
}

function convertor(input, output, offset, table) {
    var px = input[offset];
    var py = input[offset + 1];
    var x = table[0] + table[1] * Math.abs(px);
    var d = Math.abs(py) / table[9];
    var y = table[2]
            + table[3]
            * d
            + table[4]
            * d
            * d
            + table[5]
            * d
            * d
            * d
            + table[6]
            * d
            * d
            * d
            * d
            + table[7]
            * d
            * d
            * d
            * d
            * d
            + table[8]
            * d
            * d
            * d
            * d
            * d
            * d;

    output[offset] = x * (px < 0 ? -1 : 1);
    output[offset + 1] = y * (py < 0 ? -1 : 1);
}

baiduMercator.forward = forEachPoint(function (input, output, offset) {
    var lng = getLoop(input[offset], -180, 180);
    var lat = getRange(input[offset + 1], -74, 74);

    var table = null;
    var j;
    for (j = 0; j < LLBAND.length; ++j) {
        if (lat >= LLBAND[j]) {
            table = LL2MC[j];
            break;
        }
    }
    if (table === null) {
        for (j = LLBAND.length - 1; j >= 0; --j) {
            if (lat <= -LLBAND[j]) {
                table = LL2MC[j];
                break;
            }
        }
    }
    output[offset] = lng;
    output[offset + 1] = lat;
    convertor(output, output, offset, table);
});

baiduMercator.inverse = forEachPoint(function (input, output, offset) {
    var y_abs = Math.abs(input[offset + 1]);

    var table = null;
    for (var j = 0; j < MCBAND.length; j++) {
        if (y_abs >= MCBAND[j]) {
            table = MC2LL[j];
            break;
        }
    }

    convertor(input, output, offset, table);
});

var gcj02 = {}

var PI = Math.PI;
var AXIS = 6378245.0;
var OFFSET = 0.00669342162296594323;  // (a^2 - b^2) / a^2

function delta(wgLon, wgLat) {
    var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
    var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
    var radLat = wgLat / 180.0 * PI;
    var magic = Math.sin(radLat);
    magic = 1 - OFFSET * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((AXIS * (1 - OFFSET)) / (magic * sqrtMagic) * PI);
    dLon = (dLon * 180.0) / (AXIS / sqrtMagic * Math.cos(radLat) * PI);
    return [dLon, dLat];
}

function outOfChina(lon, lat) {
    if (lon < 72.004 || lon > 137.8347) {
        return true;
    }
    if (lat < 0.8293 || lat > 55.8271) {
        return true;
    }
    return false;
}

function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
}

gcj02.toWGS84 = forEachPoint(function (input, output, offset) {
    var lng = input[offset];
    var lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
        var deltaD = delta(lng, lat);
        lng = lng - deltaD[0];
        lat = lat - deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
});

gcj02.fromWGS84 = forEachPoint(function (input, output, offset) {
    var lng = input[offset];
    var lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
        var deltaD = delta(lng, lat);
        lng = lng + deltaD[0];
        lat = lat + deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
});

var bd09 = {}

var PI = Math.PI;
var X_PI = PI * 3000 / 180;

function toGCJ02(input, output, offset) {
    var x = input[offset] - 0.0065;
    var y = input[offset + 1] - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    output[offset] = z * Math.cos(theta);
    output[offset + 1] = z * Math.sin(theta);
    return output;
}

function fromGCJ02(input, output, offset) {
    var x = input[offset];
    var y = input[offset + 1];
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
    output[offset] = z * Math.cos(theta) + 0.0065;
    output[offset + 1] = z * Math.sin(theta) + 0.006;
    return output;
}

bd09.toWGS84 = function (input, opt_output, opt_dimension) {
    var output = forEachPoint(toGCJ02)(input, opt_output, opt_dimension);
    return gcj02.toWGS84(output, output, opt_dimension);
};

bd09.fromWGS84 = function (input, opt_output, opt_dimension) {
    var output = gcj02.fromWGS84(input, opt_output, opt_dimension);
    return forEachPoint(fromGCJ02)(output, output, opt_dimension);
};


var projzh = {}

projzh.smerc2bmerc = function (input, opt_output, opt_dimension) {
    var output = sphericalMercator.inverse(input, opt_output, opt_dimension);
    output = bd09.fromWGS84(output, output, opt_dimension);
    return baiduMercator.forward(output, output, opt_dimension);
};

projzh.bmerc2smerc = function (input, opt_output, opt_dimension) {
    var output = baiduMercator.inverse(input, opt_output, opt_dimension);
    output = bd09.toWGS84(output, output, opt_dimension);
    return sphericalMercator.forward(output, output, opt_dimension);
};

projzh.bmerc2ll = function (input, opt_output, opt_dimension) {
    var output = baiduMercator.inverse(input, opt_output, opt_dimension);
    return bd09.toWGS84(output, output, opt_dimension);
};

projzh.ll2bmerc = function (input, opt_output, opt_dimension) {
    var output = bd09.fromWGS84(input, opt_output, opt_dimension);
    return baiduMercator.forward(output, output, opt_dimension);
};

projzh.ll2smerc = sphericalMercator.forward;
projzh.smerc2ll = sphericalMercator.inverse;



var extent = [72.004, 0.8293, 137.8347, 55.8271];

var baiduMercatorProj = new ol.proj.Projection({
    code: 'baidu',
    extent: ol.extent.applyTransform(extent, projzh.ll2bmerc),
    units: 'm'
});

ol.proj.addProjection(baiduMercatorProj);
ol.proj.addCoordinateTransforms('EPSG:4326', baiduMercatorProj, projzh.ll2bmerc, projzh.bmerc2ll);
ol.proj.addCoordinateTransforms('EPSG:3857', baiduMercatorProj, projzh.smerc2bmerc, projzh.bmerc2smerc);

var bmercResolutions = new Array(19);
for (var i = 0; i < 19; ++i) {
    bmercResolutions[i] = Math.pow(2, 18 - i);
}

//百度坐标转高德（传入经度、纬度）
function bd_decrypt(bd_lng, bd_lat) {
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return {lng: gg_lng, lat: gg_lat}
}
//高德坐标转百度（传入经度、纬度）
function bd_encrypt(gg_lng, gg_lat) {
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = gg_lng, y = gg_lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return {
        bd_lat: bd_lat,
        bd_lng: bd_lng
    };
}