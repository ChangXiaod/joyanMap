var key = 1;    //开关
var newpoint;   //一个经纬度
var points = [];    //数组，放经纬度信息
var polyline = new BMap.Polyline(); //折线覆盖物

function startTool() {   //开关函数
    if (key === 1) {
        var dev_id = document.getElementById("dev_id").value;
        if (dev_id === "") {
            alert("请输入设备号！");
            document.getElementById("startBtn").class = "btn btn-primary";
            document.getElementById("startBtn").value = "线路规划";
            key = 1;
        } else {
            document.getElementById("startBtn").style.background = "green";
            document.getElementById("startBtn").style.color = "white";
            document.getElementById("startBtn").value = "开始规划";
            key = 0;
        }
    }
    else {
        document.getElementById("startBtn").style.background = "red";
        document.getElementById("startBtn").value = "结束规划";
        key = 1;
    }
}
map.addEventListener("click", function(e) {   //单击地图，形成折线覆盖物
    newpoint = new BMap.Point(e.point.lng, e.point.lat);
    if (key === 0) {
        points.push(newpoint);  //将新增的点放到数组中
        polyline.setPath(points);   //设置折线的点数组
        map.addOverlay(polyline);   //将折线添加到地图上
        //document.getElementById("info").innerHTML += "new BMap.Point(" + e.point.lng + "," + e.point.lat + "),</br>";    //输出数组里的经纬度
    }
});
function createXMLHttpRequest()
{
    if (window.ActiveXObject)
    {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest)
    {
        xmlHttp = new XMLHttpRequest();
    }
    else
    {
        alert("Unsupport explorer!");
    }
}
var all_points = "";
function queryData()
{
    createXMLHttpRequest();
    len = points.length;
    for (i = 0; i < len; i++) {
        p0 = points[i].lng + "|" + points[i].lat + ";";
        all_points = all_points + p0;
    }
    var dev_id = document.getElementById("dev_id").value;
    var flag = "line";
    try
    {
        if (confirm("确认提交？") === true) {
            xmlHttp.open("get", "insert_path?dev_id=" + dev_id + "&length=" + points.length + "&all_points=" + all_points + "&flag=" + flag, true);
            alert("线路规划成功！");
            points = [];
            all_points = "";
            xmlHttp.send(null);
            map.clearOverlays();
            points = [];
            all_points = '';
        } else {
            alert("您取消了本次线路规划！");
            map.clearOverlays();
            points = [];
            all_points = '';
            return false;
        }
    }
    catch (exception)
    {
        alert("xmlHttp Fail");
    }
}
//创建和初始化地图函数：
function initMap() {
    createMap();//创建地图
    setMapEvent();//设置地图事件
    addMapControl();//向地图添加控件
    addPolyline();//向地图中添加线
}

//创建地图函数：
function createMap() {
    var map = new BMap.Map("map_container");//在百度地图容器中创建一个地图
    map.centerAndZoom(new BMap.Point(108.814139, 33.842403), 13);
    window.map = map;//将map变量存储在全局
    alert($("#map_container").toString());
}

//地图事件设置函数：
function setMapEvent() {
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard();//启用键盘上下左右键移动地图
}

//地图控件添加函数：
function addMapControl() {
    //向地图中添加缩放控件
    var ctrl_nav = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE});
    map.addControl(ctrl_nav);
    //向地图中添加缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_TOP_RIGHT, isOpen: 1});
    map.addControl(ctrl_ove);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
    map.addControl(ctrl_sca);
}
//向地图中添加线函数
function addPolyline() {
    for (var i = 0; i < plPoints.length; i++) {
        var json = plPoints[i];
        var points = [];
        for (var j = 0; j < json.points.length; j++) {
            var p1 = json.points[j].split("|")[0];
            var p2 = json.points[j].split("|")[1];
            points.push(new BMap.Point(p1, p2));
        }
        var line = new BMap.Polyline(points, {strokeStyle: json.style, strokeWeight: json.weight, strokeColor: json.color, strokeOpacity: json.opacity});
        map.addOverlay(line);
    }
}

//向地图中添加文字标注函数dd
function addRemark() {
    for (var i = 0; i < lbPoints.length; i++) {
        var json = lbPoints[i];
        var p1 = json.point.split("|")[0];
        var p2 = json.point.split("|")[1];
        var label = new BMap.Label("<div style='padding:2px;'>" + json.content + "</div>", {point: new BMap.Point(p1, p2), offset: new BMap.Size(3, -6)});
        map.addOverlay(label);
        label.setStyle({borderColor: "#999"});
    }
}
$(function() {
    $("[data-toggle='popover']").popover();
});