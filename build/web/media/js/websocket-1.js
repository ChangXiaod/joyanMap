/* 
 * 1、websocket相关函数
 * 2、页面公用函数
 * 3、其他
 */
//弹出加载层
function loadWaiting() {
    $("<div class=\"datagrid-mask\"></div>").css({display: "block", width: "100%", height: $(window).height()}).appendTo("body");
    $("<div class=\"datagrid-mask-msg\"></div>").html("正在连接车载终端，请稍候......").appendTo("body").css({display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2});
}

//取消加载层
function disLoadWaiting() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}
function submitByWebsocket(msg) {
    //var wsUrl="ws://echo.websocket.org/echo";
//    var wsUrl = "ws://" + document.location.host +"/XdNav/websocket"; 
    var wsUrl = "ws://" + document.location.host + "/XdNav/common/"+sessionStorage.getItem("userName");
    var ws_submit_socket = new WebSocket(wsUrl);
    var strJsonMsg = JSON.stringify(msg);
    handleInWebsocket(strJsonMsg, ws_submit_socket);
    loadWaiting();
}

function traceByWebsocket(msg) {
    //var wsUrl="ws://echo.websocket.org/echo";
    var wsUrl = "ws://" + document.location.host + "/XdNav/trace";
    var ws_trace_socket = new WebSocket(wsUrl);
    var strJsonMsg = JSON.stringify(msg);    
    handleInWebsocket(strJsonMsg, ws_trace_socket);
}
//var ws_location_socket = null;
//function locationByWebsocket(toId) {
//    //var wsUrl="ws://echo.websocket.org/echo";
//    var wsUrl = "ws://" + document.location.host + "/XdNav/location";
//    if(ws_location_socket == null){
//        ws_location_socket = new WebSocket(wsUrl);
//    }
//    handleInWebsocket(toId,ws_location_socket);
//}
var ws_route_socket = null;
function routeByWebsocket(msg) {
    //var wsUrl="ws://echo.websocket.org/echo";
    var wsUrl = "ws://" + document.location.host + "/XdNav/route";  
    if(ws_route_socket == null){
        ws_route_socket = new WebSocket(wsUrl);
    }
    var strJsonMsg = JSON.stringify(msg);    
    handleInWebsocket(strJsonMsg,ws_route_socket); 
}
function handleInWebsocket(msg, ws) {
    ws.onopen = function(e) {
        console.log("已连接！");
        sendMessage(ws, msg);
    };

    ws.onmessage = function(e) {
        disLoadWaiting();      
        console.log("收到的反馈:" + e.data);         
        if(show(e.data)){
            try {
                loadReceivedMessage(e.data);
            } catch (e) {
                console.dir(e);
            }            
        }
        //   ws.close();//接收到服务端的响应消息后，关闭连接释放资源
    };
    ws.onerror = function(e) {
        $.messager.show({
            title: "",
            msg: e.reason
        });
        console.log("出错信息： " + e.reason);
    };
    ws.onclose = function(e) {
        console.log("关闭连接的原因：" + e.reason);
    };
}
function sendMessage(ws, msg) {
    ws.send(msg);
    console.log("已发送的信息：" + msg);
}
function show(msg) {
    var isLoadReceivedMessage = true;
    //var text1 = "{’ackSn':81,'msgHeader':{'encrypType':0,'msgId':32769,'msgLen':0,'msgPackId':0,'msgPackNum':0,'packageFlag':0,'sn':81,'terNum':'015151542766'},'reqMsgId':1212,'result':1}";    
    //{"ackSn":16,"header":{"encrypType":0,"msgId":1,"msgLen":5,"msgPackId":0,"msgPackNum":0,"packageFlag":0,"sn":2925,"terNum":"[0, 1, 4, 7, 2, 7, 7, 3, 6, 7, 3, 0]"},"reqMsgId":33027,"result":0} 
    //{"res_info":"终端666发送消息33281超时!请重试","result":11,"simno":"666"}
    if(!isJson(msg)){      
        return false;
    }    
    var objData = JSON.parse(msg);
    if (!objData) {
        return false;
    }    
    var vehicleNo = '';
    if (objData.hasOwnProperty('header')) {
        var simNo = formatSimNo(objData.header.terNum);
        vehicleNo = sessionStorage.getItem(simNo);
        //后续分包不弹窗，但需要刷新进度
        if(objData.header.msgPackId > 1){
            return true;
        }
    }
    if (objData.hasOwnProperty('simno')) {
        vehicleNo = sessionStorage.getItem(objData.simno);
    }
    if (objData.hasOwnProperty('result')) {
        isLoadReceivedMessage = objData.result === 0 ? true : false;
        var resultInfo = '';
        switch (objData.result)
        {
            case 0:
                resultInfo = '成功';
                break;
            case 1:
                resultInfo = '失败';
                break;
            case 2:
                resultInfo = '消息有误';
                break;
            case 11:
                resultInfo = '网络连接超时!';
                break;
            default:
                resultInfo = '不支持';
        }
        var options = {
            title: "指令反馈：",
            msg: '对车辆[' + vehicleNo + ']下达指令 ' + resultInfo,
            showType: 'slide',
            width: 500,
            timeout: 5000
        };
        $.messager.show(options);        
    }
    return isLoadReceivedMessage;
}

//登出
function logout() {
    //服务端清理session
    $.post('LogoutServlet', function(result) {
        if (result.success) {
            //客户端清理、跳转到登录页面
            sessionStorage.clear();
            window.location.replace("index.html");
        } else {
            $.messager.show({// show error message
                title: '失败',
                msg: result.msg
            });
        }
    }, 'json');
}

//页面鉴权
function authentication() {
    //1、检查referrer是否正确，否则注销后进入登录页面
    console.dir(document.referrer);
    if (document.referrer === '') {
        logout();
        return;
    }
    //2、根据框架页面中的关键元素ID检查是否从本系统框架中打开，否则注销后进入登录页面
    var count = 0;
    $.each(['centerTabs', 'menuBar', 'southTabs', 'tree'], function(i, n) {
        if (parent.window.document.getElementById(n)) {
            count = i;
        } else {
            return false;
        }
    });
    if (count < 3) {
        logout();
        return;
    }
}
//列表页面根据枚举类型获取枚举值
function get_ddlname(ddlType, row) {
    var data = $('#' + ddlType).combobox('getData');
    for (var i = 0; i < data.length; i++) {
        if (eval('row.' + ddlType + ' == data[i].ddlcode')) {
            return data[i].ddlname;
        }
    }
    return '';
}
//根据页面中参数key和808协议中的参数id打包成参数对象
function get_paraobj(paraKey, paraId) {
    var obj = new Object();
    var paraValue = document.getElementById(paraKey).value;
    obj.paraId = parseInt(paraId, 16);
    obj.paraLen = paraValue.length;
    obj.paraString = paraValue;
    return obj;
}
function push_paraobj(paraKey, paraId, arrayParaItem) {
    var paraValue = document.getElementById(paraKey).value;
    if (paraValue.length === 0) {
        return;
    }
    var obj = new Object();
    obj.paraId = parseInt(paraId, 16);
    obj.paraLen = paraValue.length;
    obj.paraString = paraValue;

    arrayParaItem.push(obj);
}
//判断是否undefined
function undefined2blank(obj) {
    if (obj == undefined) {
        return '';
    } else {
        return obj;
    }
}
//判断日期间隔
function checkDateInterval(beginTime,endTime,objTime){
    var dateInterval_ms = new Date(endTime).getTime() - new Date(beginTime).getTime();
    var objTime_ms = 1000 * 3600 * 24 * objTime;
    return dateInterval_ms > objTime_ms;
}
//获取正确格式的sim卡号
function formatSimNo(terNum){
    var simNo = '';
    if(terNum){
        var simNo = terNum.replace("[","");
        simNo = simNo.replace("]","");
        simNo = simNo.replace(new RegExp(",","gm"),"");
        simNo = simNo.replace(new RegExp(" ","gm"),"");
    }else{
        console.log("terNum： " + terNum);
    }        
    return simNo;
}
//判断是否json对象
function isJson(strJson){
    var isjson = strJson.indexOf(":") > 0 ? true : false;
    return isjson >= 0;
}
//获取用户设置的中心点
function getCenterPoint(){
    var lng = sessionStorage.getItem("lng");
    var lat = sessionStorage.getItem("lat");  
    if(lng){        
        var r = new Object();
        r.lng = lng;
        r.lat = lat;
        return r;
    }
    return null;
}
//判断是否无效的车牌号
function invalidVehicleNo(value){
    //全大写：^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$
    //兼容大小写：^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{5}$
    var reg='^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{5}$'; //兼容大小写
    return value.search(reg) === -1 ? true : false;
}
//判断是否无效的手机号
function invalidSimNo(value){
    var reg=/^1[3|4|5|7|8]\d{9}$/; 
    return value.search(reg) === -1 ? true : false;
}
//获取去0后的手机号
function get_SimNo(zeroSimNo){
    console.dir(zeroSimNo);
    if(zeroSimNo.charAt(0) === '0'){
       return zeroSimNo.substr(1);
    }
    return zeroSimNo;
}
