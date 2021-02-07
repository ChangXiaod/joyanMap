function HashMap()
{
    /** Map 大小 **/
    var size = 0;
    /** 对象 **/
    var entry = new Object();
    /** 存 **/
    this.put = function (key, value)
    {
        if (!this.containsKey(key))
        {
            size++;
        }
        entry[key] = value;
    }

    /** 取 **/
    this.get = function (key)
    {
        return this.containsKey(key) ? entry[key] : null;
    }

    /** 删除 **/
    this.remove = function (key)
    {
        if (this.containsKey(key) && (delete entry[key]))
        {
            size--;
        }
    }

    /** 是否包含 Key **/
    this.containsKey = function (key)
    {
        return (key in entry);
    }

    /** 是否包含 Value **/
    this.containsValue = function (value)
    {
        for (var prop in entry)
        {
            if (entry[prop] == value)
            {
                return true;
            }
        }
        return false;
    }

    /** 所有 Value **/
    this.values = function ()
    {
        var values = new Array();
        for (var prop in entry)
        {
            values.push(entry[prop]);
        }
        return values;
    }

    /** 所有 Key **/
    this.keys = function ()
    {
        var keys = new Array();
        for (var prop in entry)
        {
            keys.push(prop);
        }
        return keys;
    }

    /** Map Size **/
    this.size = function ()
    {
        return size;
    }

    /* 清空 */
    this.clear = function ()
    {
        size = 0;
        entry = new Object();
    }
}

//检查浏览器类型和版本号
function checkBrowser() {
    var agent = navigator.userAgent.toLowerCase(),
            opera = window.opera,
            browser = {
                //检测当前浏览器是否为IE  
                ie: /(msie\s|trident.*rv:)([\w.]+)/.test(agent),
                //检测当前浏览器是否为Opera  
                opera: (!!opera && opera.version),
                //检测当前浏览器是否是webkit内核的浏览器  
                webkit: (agent.indexOf(' applewebkit/') > -1),
                //检测当前浏览器是否是运行在mac平台下  
                mac: (agent.indexOf('macintosh') > -1),
                //检测当前浏览器是否处于“怪异模式”下  
                quirks: (document.compatMode == 'BackCompat')
            };
    //检测当前浏览器内核是否是gecko内核  
    browser.gecko = (navigator.product == 'Gecko' && !browser.webkit && !browser.opera && !browser.ie);
    var version = 0;
    // Internet Explorer 6.0+  
    if (browser.ie) {
        var v1 = agent.match(/(?:msie\s([\w.]+))/);
        var v2 = agent.match(/(?:trident.*rv:([\w.]+))/);
        if (v1 && v2 && v1[1] && v2[1]) {
            version = Math.max(v1[1] * 1, v2[1] * 1);
        } else if (v1 && v1[1]) {
            version = v1[1] * 1;
        } else if (v2 && v2[1]) {
            version = v2[1] * 1;
        } else {
            version = 0;
        }
//检测浏览器模式是否为 IE11 兼容模式  
        browser.ie11Compat = document.documentMode == 11;
        //检测浏览器模式是否为 IE9 兼容模式  
        browser.ie9Compat = document.documentMode == 9;
        //检测浏览器模式是否为 IE10 兼容模式  
        browser.ie10Compat = document.documentMode == 10;
        //检测浏览器是否是IE8浏览器  
        browser.ie8 = !!document.documentMode;
        //检测浏览器模式是否为 IE8 兼容模式  
        browser.ie8Compat = document.documentMode == 8;
        //检测浏览器模式是否为 IE7 兼容模式  
        browser.ie7Compat = ((version == 7 && !document.documentMode) || document.documentMode == 7);
        //检测浏览器模式是否为 IE6 模式 或者怪异模式  
        browser.ie6Compat = (version < 7 || browser.quirks);
        browser.ie9above = version > 8;
        browser.ie9below = version < 9;
    }
// Gecko.  
    if (browser.gecko) {
        var geckoRelease = agent.match(/rv:([\d\.]+)/);
        if (geckoRelease) {
            geckoRelease = geckoRelease[1].split('.');
            version = geckoRelease[0] * 10000 + (geckoRelease[1] || 0) * 100 + (geckoRelease[2] || 0) * 1;
        }
    }
//检测当前浏览器是否为Chrome, 如果是，则返回Chrome的大版本号  
    if (/chrome\/(\d+\.\d)/i.test(agent)) {
        browser.chrome = +RegExp['\x241'];
    }
//检测当前浏览器是否为Safari, 如果是，则返回Safari的大版本号  
    if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)) {
        browser.safari = +(RegExp['\x241'] || RegExp['\x242']);
    }
// Opera 9.50+  
    if (browser.opera)
        version = parseFloat(opera.version());
    // WebKit 522+ (Safari 3+)  
    if (browser.webkit)
        version = parseFloat(agent.match(/ applewebkit\/(\d+)/)[1]);
    //检测当前浏览器版本号  
    browser.version = version;
    return browser;
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
//发送邮件
function sandEmail(email, title, content, silence) {
    var params = {};
    params.emails = email;
    //判断收件人地址是否为空
    if (params.emails == "" || params.emails == undefined || params.emails == null) {
        if (!silence)
            $.alert({
                title: '警告!',
                content: '对不起，收件人地址不能为空!',
            });
        return;
    }
    params.title = title;
    //判断邮件标题是否为空
    if (params.title == "" || params.title == undefined || params.title == null) {
        if (!silence)
            $.alert({
                title: '警告!',
                content: '对不起，邮件标题不能为空!',
            });
        return;
    }
    params.content = content;
    //发送邮件
    $.post("SendEmailServlet", params, function (mdata) {
//                    alert(mdata);
        //如果用户设置为静默发送模式，则不用提示是否发送成功
        if (silence == true) {
            return;
        }
        var data = JSON.parse(mdata);
        if (data.code == 0) {
            //成功
            $.alert({
                title: '提示!',
                content: '恭喜您，发送邮件成功!',
            });
        } else {
            $.alert({
                title: '提示!',
                content: '对不起，发送邮件失败!',
            });
        }
        ////返回到用户管理页面
        window.history.back();
    });
}
//判断文件类型是否为doc或者pdf格式
function checkFileExt(filename)
{
    var flag = false; //状态
    var arr = ["doc", "docx", "pdf"];
    //取出上传文件的扩展名
    var index = filename.lastIndexOf(".");
    var ext = filename.substr(index + 1);
    //循环比较
    for (var i = 0; i < arr.length; i++)
    {
        if (ext == arr[i])
        {
            flag = true; //一旦找到合适的，立即退出循环
            break;
        }
    }
    //条件判断
    return flag;
}


//自动获取所有的输入参数
function getInputs() {
    var params = {};
    if ($("input,select,textarea").each(function (i, input) {
        var val = $("#" + input.id).val();
        if (val != "" && val != null && val != undefined) {
            //设置键值对
            params[input.id] = val;
            //如果遍历结束，则返回结果
            if (i == $("input,select,textarea").size() - 1) {
                return true;
            }
        }
    })) {
//返回参数值
        return params;
    } else {
        return null;
    }
}

//自动设置元素的值
function setInputs(item) {
    $("input,textarea").each(function (i, input) {
//从输入值中取出id相同的值
        var val = item[input.id];
        //判断值是否为空
        if (val != "" && val != null && val != undefined) {
            $("#" + input.id).val(val);
        }
    });
    $("select").each(function (i, input) {
//从输入值中取出id相同的值
        var val = item[input.id];
        //判断值是否为空
        if (val != "" && val != null && val != undefined) {
//            alert(input.id + "-" + val)
            $("#" + input.id).val(val);
            $("#" + input.id).find("option[value='" + val + "']").attr("selected", true);
        }
    });
}

//自动情况所有输入框中的数据
function clearInputs() {
    $("input").each(function (i, input) {
//判断值是否为空
        $("#" + input.id).val("");
    });
    $("select").each(function (i, input) {
//判断值是否为空
        $("#" + input.id).val("");
    });
}

//取出html格式
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, ""); //去掉所有的html标记  
}

//imei正则验证 
function checkImei(imei) {
    var regImei = /^\d{15}$/;
    if (regImei.test(imei)) {
        return true;
    } else {
        return false;
    }
}
//判断是否无效的身份证编号
function checkIdNo(value) {
    var regNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (regNo.test(value)) {
        return true;
    } else {
        return false;
    }
}

//用户名正则验证
function checkUserName(name) {
    var regName = /^[\u4E00-\u9FA5]{2,6}$/;
    if (regName.test(name)) {
        return true;
    } else {
        return false;
    }
}
//sim卡号验证
function checkSimNo(value) {
    var regSim = /^\d{13}$/;
    if (regSim.test(value)) {
        return true;
    } else {
        return false;
    }
}

//年龄正则验证（年龄只能0~99，两位数）
function checkUserAge(age)
{
    var regNum = /^[0-9]{1,2}$/;
    if (regNum.test(age)) {
        return true;
    } else {
        return false;
    }
}
//验证电话号码（手机或固定电话）
function checkPhoneNo(value) {
    var regPhone = /^((0\d{2,3}-\d{7,8})|(0\d{2,3}\d{7,8})|(\d{7,8})|(1[3584]\d{9}))$/;
    if (regPhone.test(value)) {
        return true;
    } else {
        return false;
    }
}

//4到16位（字母，数字，下划线，减号）
function checkLoginUser(value) {
    var regLogin = /^[a-zA-Z0-9_-]{4,16}$/;
    if (regLogin.test(value)) {
        return true;
    } else {
        return false;
    }
}
//邮箱验证
function checkEmail(value) {
    var emailPatten = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (emailPatten.test(value)) {
        return true;
    } else {
        return false;
    }
}
//移动电话号码验证
function checkMobileNo(value) {
    var mPattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
    if (mPattern.test(value)) {
        return true;
    } else {
        return false;
    }
}
//固定电话验证
function checkTelNo(value) {
    var regTelNo = /(^0\d{2,3}-\d{7,8}$)|(^0\d{2,3}\d{7,8}$)|(^\d{7,8}$)/;
    //var regTelNo = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)/; 
    if (regTelNo.test(value)) {
        return true;
    } else {
        return false;
    }
}

//验证不能为空
function checkNull(value) {
    if (value == "" || value == null || value == undefined) {
        return true;
    } else {
        return false;
    }
}
function addCircle(vectorSource, xy, radius, circleName, ds_id, strokeColor, strokeWidth, fillColor,
        //文本文字的大小
        font_size) {
    var circle = new ol.geom.Circle(xy, radius);
    var circleFeature = new ol.Feature({geometry: circle, name: circleName, ds_id: ds_id});
//    circleFeature.setGeometryName(circleName);
//    var circleFeature = new ol.Feature(circle);
    circleFeature.setStyle(
            new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fillColor,
                }),
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: strokeWidth
                }),
                text: new ol.style.Text({
                    text: circleName,
                    scale: font_size,
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
    vectorSource.addFeature(circleFeature);
}

function addPolygon(vectorSource, values, polygonName, ds_id, strokeColor, strokeWidth, fillColor,
        //文本文字的大小
        font_size) {
    var polygon = new ol.geom.Polygon(values);
//    var polygonFeature = new ol.Feature(polygon);
    //忽略默认的名称
    if (polygonName == "geometry") {
        polygonName = "Polygon";
    }
    var polygonFeature = new ol.Feature({geometry: polygon, name: polygonName, ds_id: ds_id});
//    polygonFeature.setGeometryName(polygonName);
    polygonFeature.setStyle(
            new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fillColor,
                }),
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: strokeWidth
                }),
                text: new ol.style.Text({
                    text: polygonName,
                    scale: font_size,
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
    vectorSource.addFeature(polygonFeature);
}
function addLineString(vectorSource, xy, lineStringName, ds_id, dash, strokeColor, strokeWidth,
        //文本文字的大小
        font_size) {
    var lineString = new ol.geom.LineString(xy);
//    var lineStringFeature = new ol.Feature(lineString);
    var lineStringFeature = new ol.Feature({geometry: lineString, name: lineStringName, ds_id: ds_id});
//    lineStringFeature.setGeometryName(lineStringName);
    lineStringFeature.setStyle(
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    lineDash: dash,
                    color: strokeColor,
                    width: strokeWidth
                }),
                text: new ol.style.Text({
                    text: lineStringName,
                    scale: font_size,
                    fill: new ol.style.Fill({
                        color: '#000000',
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffff99',
                        width: 1
                    })
                }),
            })
            );
    vectorSource.addFeature(lineStringFeature);
}

function addUserIcon(vectorSource, xy, userName, ds_id,
        //文本文字的大小
        font_size) {
    var point = new ol.geom.Point(xy);
//    var pointFeature = new ol.Feature(point);
    var pointFeature = new ol.Feature({geometry: point, name: userName, ds_id: ds_id});
    pointFeature.setStyle(
            new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 0.5],
                    crossOrigin: 'anonymous',
                    src: 'images/onlinePeople.png'
                }),
                text: new ol.style.Text({
                    text: userName,
                    scale: font_size,
                    fill: new ol.style.Fill({
                        color: '#000000',
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffff99',
                        width: 1
                    })
                }),
            })
            );
    vectorSource.addFeature(pointFeature);
}
function addMarkerIcon(vectorSource, xy, markerName, ds_id, icon,
        //图标缩放比例
        scale,
        //文本文字的大小
        font_size) {
    var point = new ol.geom.Point(xy);
    //忽略默认的名称
    if (markerName == "geometry") {
        markerName = "point";
    }
//    alert(markerName);
    var pointFeature = new ol.Feature({geometry: point, name: markerName});
    pointFeature.setStyle(
            new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    crossOrigin: 'anonymous',
                    scale: scale,
                    src: icon
                }),
                text: new ol.style.Text({
                    text: markerName,
                    scale: font_size,
                    fill: new ol.style.Fill({
                        color: '#000000',
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffff99',
                        width: 1
                    })
                }),
            })
            );
//    pointFeature.setGeometryName(markerName);
    vectorSource.addFeature(pointFeature);
}
//function addCameraIcon(vectorSource, xy, cameraName){
//    var point = new ol.geom.Point(xy);
//    var pointFeature = new ol.Feature(point);
//    pointFeature.setStyle(
//        new ol.style.Style({
//            image: new ol.style.Icon({
//               anchor: [0.5, 0.5],
//               crossOrigin: 'anonymous',
//               src : 'images/camera.png'
//            }),
//            text: new ol.style.Text({
//                text: cameraName,
//                scale: 1,
//                fill : new ol.style.Fill({
//                    color: '#000000',
//                }),
//                stroke: new ol.style.Stroke({
//                    color: '#ffff99',
//                    width: 3.5
//                })
//            }), 
//        })
//    );
//    vectorSource.addFeature(pointFeature);
//}

//获得当前的日期时间，格式“yyyy-MM-dd HH:MM:SS”
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentDate;
}

//显示提示消息
function showTip(content) {
    $('#tip_msg').text(content);
    $('#tip_dialog').modal('show');
}

//显示格式化时间
Date.prototype.format = function (format)
{
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

/**
 * @author zhangxinxu(.com)
 * @licence MIT
 * @description http://www.zhangxinxu.com/wordpress/?p=7362
 */
CanvasRenderingContext2D.prototype.fillTextVertical = function (text, fontSzie, color, x, y) {
    var context = this;
    var canvas = context.canvas;
    var arrText = text.split('');
    var arrWidth = arrText.map(function (letter) {
        return context.measureText(letter).width;
    });
    var align = context.textAlign;
    var baseline = context.textBaseline;
    if (align == 'left') {
        x = x + Math.max.apply(null, arrWidth) / 2;
    } else if (align == 'right') {
        x = x - Math.max.apply(null, arrWidth) / 2;
    }
    if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
        y = y - arrWidth[0] / 2;
    } else if (baseline == 'top' || baseline == 'hanging') {
        y = y + arrWidth[0] / 2;
    }
    context.font = fontSzie;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    // 开始逐字绘制
    arrText.forEach(function (letter, index) {
        // 确定下一个字符的纵坐标位置
        var letterWidth = arrWidth[index];
        // 是否需要旋转判断
        var code = letter.charCodeAt(0);
        if (code <= 256) {
            context.translate(x, y);
            // 英文字符，旋转90°
            context.rotate(90 * Math.PI / 180);
            context.translate(-x, -y);
        } else if (index > 0 && text.charCodeAt(index - 1) < 256) {
            // y修正
            y = y + arrWidth[index - 1] / 2;
        }
        context.fillText(letter, x, y);
        // 旋转坐标系还原成初始态
        context.setTransform(1, 0, 0, 1, 0, 0);
        // 确定下一个字符的纵坐标位置
        var letterWidth = arrWidth[index];
        y = y + letterWidth;
    });
    // 水平垂直对齐方式还原
    context.textAlign = align;
    context.textBaseline = baseline;
};
/*
 * 函数名称:drawDashedLine
 * 函数功能:在画布上绘制虚线
 * 参数说明:
 * ctx:画布句柄
 * width:线的宽度
 * color:线的颜色
 * x1, y1, x2, y2:起点和终点的xy坐标
 * dashLength:短线的长度
 */
function drawDashedLine(ctx, width, color, pointers) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash([1, 2]);
    //按照拐点绘制虚线
    if (pointers.length > 0) {
        ctx.moveTo(pointers[0].x, pointers[0].y);
        for (var i = 0; i < pointers.length; i++) {
            var point = pointers[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}

/*
 * 函数名称:drawLine
 * 函数功能:在画布上绘制实现
 * 参数说明:
 * ctx:画布句柄
 * width:线的宽度
 * color:线的颜色
 * x1, y1, x2, y2:起点和终点的xy坐标
 * dashLength:短线的长度
 */
function drawLine(ctx, width, color, pointers) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash([0]);
    //按照拐点绘制实线
    if (pointers.length > 0) {
        ctx.moveTo(pointers[0].x, pointers[0].y);
        for (var i = 0; i < pointers.length; i++) {
            var point = pointers[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}

/*
 * 函数名称:showStatus
 * 函数功能:显示指定设备的工作状态,运行正常显示绿色,异常显示红色
 * 参数说明:
 * ctx:上下文
 * status:设备状态,true为运行正常,显示绿色,false为运行故障,显示红色
 * x, y:显示的位置
 */
function showStatus(ctx, status, x, y) {
    //设定填充图形的样式
    if (status) {
        ctx.fillStyle = "green";
    } else {
        ctx.fillStyle = "red";
    }
    //绘制图形
    ctx.fillRect(x, y, 10, 10);
}

// Canvas居中写字，参数（context对象，要写的字，字体，颜色，绘制的高度）
function canvas_text(ctx, text, fontSzie, color, x, y) {
    // 放大倍数
    ctx.scale(ratio, ratio);
    ctx.font = fontSzie;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
}

/*
 * 函数名称:clearObject
 * 功能描述:清楚指定区域内的对象
 * 参数说明:
 * ctx: canvas上下文
 * x,y:坐标值
 * width,height:宽度和高度
 * 
 */
function clearObject(ctx, x, y, width, height) {
    ctx.clearRect(x, y, width, height);
}

/*
 /* 函数名称:drawImage
 * 函数功能:在画布上绘制一张图片
 * 参数说明:
 * ctx:canvas句柄
 * src:图片的url地址
 * x:图片显示位置的x坐标
 * y:图片显示位置的y坐标
 * width:图片的宽度
 * height:图片的高度
 * label:图片的标题文字
 * label_position:标题文字显示的相对位置:left,right
 * h_v: 标题文字是横排还是竖排,如果true为横排,如果false为竖排
 */
function drawImage(ctx, src, x, y, width, height, label, label_position, h_v) {
    var status_position = {};
    //创建新的图片对象
    var img = new Image();
    //指定图片的URL
    img.src = src;
    //浏览器加载图片完毕后再绘制图片
    img.onload = function () {
        //以Canvas画布上的坐标(10,10)为起始点，绘制图像
        //图像的宽度和高度分别缩放到350px和100px
        ctx.drawImage(img, x, y, width, height);
    };
    //绘制文本
    if (h_v) {
        if (label_position == "left") {
            //绘制告警块
            showStatus(ctx, true, x - 60, y + height / 4 - 6);
            //记录状态小方块的位置,以便更新状态
            status_position.x = x - 60;
            status_position.y = y + height / 4 - 6;
            //绘制文字
            canvas_text(ctx, label, "12pt 宋体", "blue", x - 45, y + height / 4);
        } else {
            //绘制告警块
            showStatus(ctx, true, x + width + 5, y + height / 4 - 6);
            //记录状态小方块的位置,以便更新状态
            status_position.x = x + width + 5;
            status_position.y = y + height / 4 - 6;
            //绘制文字
            canvas_text(ctx, label, "12pt 宋体", "blue", x + width + 15, y + height / 4);
        }
    } else {
        if (label_position == "left") {
            //绘制告警块
            showStatus(ctx, true, x - 20, y - 10);
            //记录状态小方块的位置,以便更新状态
            status_position.x = x - 20;
            status_position.y = y - 10;
            //绘制文字
            ctx.fillTextVertical(label, "12pt 宋体", "blue", x - 25, y + 10);
        } else {
            //绘制告警块
            showStatus(ctx, true, x + width + 14, y + height / 4 - 18);
            //记录状态小方块的位置,以便更新状态
            status_position.x = x + width + 14;
            status_position.y = y + height / 4 - 18;
            //绘制文字
            ctx.fillTextVertical(label, "12pt 宋体", "blue", x + width + 10, y + height / 4);
        }
    }
    //范围运行状态小方块的位置
    return status_position;
}

//将rgba颜色转换为16进制颜色
function hexify(color) {
    var values = color
            .replace(/rgba?\(/, '')
            .replace(/\)/, '')
            .replace(/[\s+]/g, '')
            .split(',');
    var a = parseFloat(values[3] || 1),
            r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
            g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
            b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
    return "#" +
            ("0" + r.toString(16)).slice(-2) +
            ("0" + g.toString(16)).slice(-2) +
            ("0" + b.toString(16)).slice(-2);
}

//获得一个随机数
function getRandom() {
    return Math.floor((Math.random() * 10000) + 1);
}

//初始化菜单
function initMenu() {
    var params = {};
    params.sid = "get_role";
    //默认为第一个职位
    var roles = JSON.parse(sessionStorage.getItem("role_id")); //获得保存的职位信息
    if (roles != null && roles != undefined && roles != "") {
        params.role_id = roles[0];
        //params.condition="id in(13,14)"
    } else {
        //如果没有职位定义，则返回
        return;
    }

    //调用查询服务  查询这个ID下应该显示什么菜单
    $.post("QueryMenu", params, function (mdata) {
//                    mdata这个职位下应该显示的菜单
        var data = JSON.parse(mdata);
        if (data.code == 0) {
            //默认加载第一个职位
            var items = JSON.parse(data.result[0].resource);
//                        alert(JSON.stringify(items));
            updateMenu(items); //更新左边菜单
        }
    });
}

//更新菜单
function updateMenu(items) {
    if (items != null && items != undefined) {
        //动态添加菜单
        var menu_html = "";
        var i = 0;
        //全局变量，暂时保存重新归并后的菜单项
        var menu_hash = resortMenu(items);
        for (; i < items.length; i++) {
            //单个node
            var item = items[i];
            //   alert(JSON.stringify(item));
            //判断node的类型，如果是一级菜单，直接生成菜单
            if (item.parentid == '0') {
                var menu = menu_hash.get(item.id);
                var submenu = menu.submenu;
                //有子菜单的情况
                if (submenu != null && submenu != undefined) {
                    menu_html += "<li class=\"dropdown\">\n\
                                                <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" style=\"color:white;font-size:10pt;\">\n\
                                                  " + item.name + "\n\
                                                  <span class=\"caret \"></span>\n\
                                                </a><ul class=\"dropdown-menu\">";
                    var j = 0;
                    for (; j < submenu.length; j++) {
                        var sub = submenu[j];
                        // alert(sub.url); 
                        menu_html += "<li>\n\
                                                    <a href=\"" + sub.url + "\" target=\"_self\">\n\
                                " + sub.name + "</a></li>";
                        // alert(menu_html);
                    }

                    menu_html += "</ul></li>";
                } else {

                    menu_html += "<li class=\"\">\n\
                                             <a href=\"" + (item.url == "" ? "" : item.url) + "\" target=\"_self\" \n\
                                             style=\"color:white;font-size:10pt;\">" + item.name + "</a></li>";
                    //  alert(menu_html);
                }
            }
        }
//                      alert(menu_html);
        document.getElementById("menu_list").innerHTML = menu_html;
    }
}

//对菜单数据进行归并处理
function resortMenu(items) {
    if (items != null && items != undefined) {
        var i = 0;
        //归并的主要目的是将菜单和子菜单集中到一起
        var menu_hash = new HashMap();
        for (; i < items.length; i++) {
            var item = items[i];
            if (item.parentid == 0) {//第一级菜单
                menu_hash.put(item.id, item);
            } else {
                var menu = menu_hash.get(item.parentid);
                if (menu != null && menu != undefined) {
                    //如果已经存在子菜单，就将这个子菜单添加进去
                    if (menu.submenu != null && menu.submenu != undefined) {
                        menu.submenu.push(item);
                    } else {//如果还没有子菜单，就新建一个子菜单数组
                        var submenu = [];
                        submenu.push(item);
                        menu.submenu = submenu;
                    }
                }
            }
        }
    }
    //返回归并后的菜单
    return menu_hash;
}

function logout() {
    $.post('Logout', function (data) {

        if (data == "success") {
            location.href = "index.html";
        } else {
            alert("网络连接失败，请重新退出！");
        }
    });
}

function initPage() {
    //初始化界面菜单
    App.init(); // initlayout and core plugins
//                if (document.all) { window.resizeTo(screen.availWidth,screen.availHeight);
    //显示登录信息
    $.post("QuerySessionServlet", null, function (data) {
//                    alert(data);
        var mdata = JSON.parse(data);
        if (mdata.code == 0) {
            sessionStorage.setItem("session_key", mdata.session.userName);
            sessionStorage.setItem("name", mdata.session.name);
            sessionStorage.setItem("login_depart", mdata.session.departSID);
            sessionStorage.setItem("org_name", mdata.session.org_name);
            sessionStorage.setItem("login_account", mdata.session.userName);
//                        sessionStorage.setItem("createTime", mdata.obj.createTime);
            sessionStorage.setItem("role_id", mdata.session.roleIDS);
            $('#show_account').text(mdata.session.userName);
            //调整页面高度
            document.getElementById("content").style.height = (window.innerHeight * 0.92) + 'px';
            $("#content").scrollTop(window.innerHeight);
            //根据用户权限，初始化左侧的导航菜单
            initMenu();
        } else {
            $.alert({
                title: '提示!',
                content: "对不起，会话失效，请重新登录！",
            });
            //转跳到登录页面
            location.href = "index.html";
        }
    });
}

//计算途损和盈亏
function calculateTusun(kuangfaliang, jingzhong) {
    //矿发>=净重
    //  当（矿发-净重）>=矿发的0.012倍时，途损为：矿发的0.012倍，例如序号1；盈亏为（矿发-净重）-矿发的0.012倍，例如序号1。
    //  当（矿发-净重）<矿发的0.012倍时，途损为：（矿发-净重），例如序号8；盈亏为 0，如序号8。
    //矿发<净重
    //  途损为0，盈亏为（矿发-净重），例如序号11。
    var result = {};
    var tusun = 0, yingkui = 0;
    //矿发>=净重
    if (kuangfaliang >= jingzhong) {
        var tmp = kuangfaliang - jingzhong;
        //当（矿发-净重）>=矿发的0.012倍时，途损为：矿发的0.012倍，例如序号1；盈亏为（矿发-净重）-矿发的0.012倍
        if (tmp >= kuangfaliang * 0.012) {
            tusun = kuangfaliang * 0.012;
            yingkui = tmp - kuangfaliang * 0.012;
        }
        // 当（矿发-净重）<矿发的0.012倍时，途损为：（矿发-净重），例如序号8；盈亏为 0，如序号8。
        else
        {
            tusun = tmp;
            yingkui = 0;
        }
    }
    //矿发<净重:途损为0，盈亏为（矿发-净重），例如序号11。
    else
    {
        tusun = 0;
        yingkui = kuangfaliang - jingzhong;
    }
    //返回计算结果
    result.tusun = toDecimal(tusun);
    result.yingkui = toDecimal(yingkui);
    return result;
}

//在本地缓存表中保存数据
function saveLines(line, items) {
    if (line == 'a') {
        localStorage.data_line_a = JSON.stringify(items);
    } else {
        localStorage.data_line_b = JSON.stringify(items);
    }
}

//在本地缓存表中添加记录数据
function addLine(line, id, item) {
    var db = null;
    if (line == 'a') {
        db = JSON.parse(localStorage.data_line_a);
        //第一次还没有创建本地存储
        if (db == null) {
            db = [];
        }
        if (id >= db.length) {
            //保存数据
            db.push(item);
        } else {
            //更新数据
            db[id] = item;
        }
        localStorage.data_line_a = JSON.stringify(db);
    } else {
        db = JSON.parse(localStorage.data_line_b);
        //第一次还没有创建本地存储
        if (db == null) {
            db = [];
        }
        if (id >= db.length) {
            //保存数据
            db.push(item);
        } else {
            //更新数据
            db[id] = item;
        }
        localStorage.data_line_b = JSON.stringify(db);
    }
}

//清空记录缓存
function clearLines(line) {
    if (line == 'a') {
        localStorage.data_line_a = "[]";
        localStorage.INDEX_A = 0;
    } else {
        localStorage.data_line_b = "[]";
        localStorage.INDEX_B = 0;
    }
}

//更新指定记录
function updateLine(line, id, item) {
    var db = null;
    if (line == 'a') {
        db = JSON.parse(localStorage.data_line_a);
        if (id < db.length) {
            db[id] = item;
            //保存数据
            localStorage.data_line_a = JSON.stringify(db);
        }
    } else {
        db = JSON.parse(localStorage.data_line_b);
        if (id < db.length) {
            db[id] = item;
            //保存数据
            localStorage.data_line_b = JSON.stringify(db);
        }
    }
}

//替换或插入记录
function replaceLine(line, id, item) {
    var db = null;
    if (line == 'a') {
        db = JSON.parse(localStorage.data_line_a);
        //如果没有保存过记录，初始化数组
        if (db == null) {
            db = [];
        }
        //指定位置赋值
        db[id] = item;
        //保存数据
        localStorage.data_line_a = JSON.stringify(db);
    } else {
        db = JSON.parse(localStorage.data_line_b);
        //如果没有保存过记录，初始化数组
        if (db == null) {
            db = [];
        }
        //指定位置赋值
        db[id] = item;
        //保存数据
        localStorage.data_line_b = JSON.stringify(db);
    }
}
//更新数据保存状态
function updateSyncStatus(line, id) {
    var db = null;
    if (line == 'a') {
        db = JSON.parse(localStorage.data_line_a);
        //如果没有保存过记录，初始化数组
        if (db == null) {
            db = [];
        }
        //指定位置赋值
        if (id < db.length) {
            var row = JSON.parse(db[id]);
            row.is_sync = '1';
            db[id] = JSON.stringify(row);
            //保存数据
            localStorage.data_line_a = JSON.stringify(db);
        }
    } else {
        db = JSON.parse(localStorage.data_line_b);
        //如果没有保存过记录，初始化数组
        if (db == null) {
            db = [];
        }
        //指定位置赋值
        if (id < db.length) {
            var row = JSON.parse(db[id]);
            row.is_sync = '1';
            db[id] = JSON.stringify(row);
            //保存数据
            localStorage.data_line_b = JSON.stringify(db);
        }
    }
}
//返回所有记录
function getLines(line) {
    var db = null;
    if (line == 'a') {
        if (localStorage.data_line_a != undefined) {
            db = JSON.parse(localStorage.data_line_a);
        }
    } else {
        if (localStorage.data_line_b != undefined) {
            db = JSON.parse(localStorage.data_line_b);
        }
    }
    return db;
}

//获取缓存已保存数据大小
function getLineLength(line) {
    var db = null;
    if (line == 'a') {
        if (localStorage.data_line_a != undefined) {
            db = JSON.parse(localStorage.data_line_a);
        }
    } else {
        if (localStorage.data_line_b != undefined) {
            db = JSON.parse(localStorage.data_line_b);
        }
    }
    var num = 0;
//    alert(db);
    if (db != null) {
        //逐行扫描，查看毛重、皮重等数据
        for (var i = 0; i < db.length; i++) {
            var row = JSON.parse(db[i]);
            if (row.pizhong != 0 && row.pizhong != null) {
                num++;
            } else {
                break;
            }
        }
    }
    //返回有效记录数量
    return num;
}
//得到最后一行的记录编号
function getLastRecordNum(line) {
    var db = null;
    if (line == 'a') {
        if (localStorage.data_line_a != undefined) {
            db = JSON.parse(localStorage.data_line_a);
        }
    } else {
        if (localStorage.data_line_b != undefined) {
            db = JSON.parse(localStorage.data_line_b);
        }
    }
    //记录编号
    var record_num = 0;
//    alert(db);
    if (db != null) {
        //逐行扫描，查看毛重、皮重等数据
        for (var i = 0; i < db.length; i++) {
            var row = JSON.parse(db[i]);
            if (row.pizhong != 0 && row.pizhong != null) {
//                record_num = row.record_num;
                record_num = i;
            } else {
                break;
            }
        }
    }
    //返回最后一个记录编号
    return record_num;
}

//查找记录
function getLine(line, id) {
    var db = null;
    if (line == 'a') {
        db = JSON.parse(localStorage.data_line_a);
    } else {
        db = JSON.parse(localStorage.data_line_b);
    }
    //查找是否有相同的记录
    var len = db.length;
    if (len > 0 && id < len) {
        return db[id];
    } else {
        return null;
    }
}
//删除指定记录
function eraseLine(line, id) {
    var db = null;
    if (line == 'a') {
        db = JSON.parse(localStorage.data_line_a);
    } else {
        db = JSON.parse(localStorage.data_line_b);
    }
    //查找是否有相同的记录
    var len = db.length;
    if (len > 0 && id < len) {
        //把所有的元素往前移一下，后面的元素覆盖前面的元素
        for (var i = id; i < len - 1; i++) {
            db[i] = db[i + 1];
        }
        //删除最后一个元素
        db.pop();
    }
    //保存数据
    if (line == 'a') {
        localStorage.data_line_a = JSON.stringify(db);
    } else {
        localStorage.data_line_b = JSON.stringify(db);
    }
}

//导出表格tableId的数据
function exportData(tableId) {
    var $trs = $('#' + tableId).find('tr');
    var str = '';
    for (var i = 0; i < $trs.length; i++) {
        var $tds = $trs.eq(i).find('td,th');
        for (var j = 0; j < $tds.length; j++) {
            var tdValue = $tds.eq(j).text();
            if (tdValue === '没有找到匹配的记录') {
                $.alert({
                    title: '提示!',
                    content: '列表数据为空！'
                });
                return;
            } else {
                str += tdValue.replace(',', '，') + ',';
            }
        }
        str += '\n';
    }

    var aaaa = 'data:text/csv;charset=utf-8,\ufeff' + str;
    var link = document.createElement('a');
    link.setAttribute('href', aaaa);
    var filename = date2str(new Date());
    link.setAttribute('download', filename + '.csv');
    link.click();
}
//当前时间转字符串
function date2str(objTime) {
    var myDate = objTime.getFullYear() + '-' + (objTime.getMonth() + 1) + '-' + objTime.getDate();
    var myTime = objTime.getHours() + ':' + objTime.getMinutes() + ':' + objTime.getSeconds();
    return myDate + ' ' + myTime;
}

/**
 * 
 * @param {type} checkstr
 * @returns {Boolean}
 * 验证输入内容
 */
function checkspace(checkstr) {
    var str = '';
    for (i = 0; checkstr.length > i; i++) {
        str = str + ' ';
    }
    return (str == checkstr);
}
//显示交接班窗口
function show_jiaojieban() {
    $('#jieban_modal').modal('show');
}
//验证阶段：1为交班人第一次验证，2为第二次交班人验证
var stage = 0;
//密码验证
function pass_auth() {
    //进入第一阶段验证
    stage++;
    var name = $("#jieban_account").val();
    var pwd = $('#jieban_password').val();
    //值次
    var zhici = $('#jieban_zhici').val();
    //班次
    var banci = $('#jieban_banci').val();
    if (checkspace(name)) {
        document.getElementById("jieban_account").focus();
        document.getElementById("jieban_tips").innerHTML = "";
        $("#jieban_tips").text("用户名不能为空！");
        return false;
    }
    if (checkspace(pwd)) {
        document.getElementById("jieban_password").focus();
        document.getElementById("jieban_tips").innerHTML = "";
        $("#jieban_tips").text("密码不能为空！");
        return false;
    }
    $("#jieban_submit").text('账号密码验证中...');
    //交接班用户名密码验证
    $.post("AuthPasswordServlet", {username: name, password: pwd},
            function (mdata) {
                //解析json格式数据
                var data = JSON.parse(mdata);
                if (data.code == 0) {
                    $("#jieban_submit").text('');
                    //如果第一次验证成功，记录接班人信息，打开第二次验证窗口
                    if (stage == 1) {
                        $("#jiaojieban_title").text("交班人信息验证");
                        $("#jieban_submit").text('交班验证');
                        //清空原有信息
                        $("#jieban_account").val("");
                        $('#jieban_account').attr('placeholder', '请输入交班人账号信息');
                        $('#jieban_password').val("");
                        $('#jieban_password').attr('placeholder', '请输入交班人密码');
                        //记录接班人信息
                        sessionStorage.jieban_account = name;
                        localStorage.setItem('banci',banci);
                        localStorage.setItem('zhici', zhici);
                    } else if (stage == 2) {
                        //记录交班人信息
                        sessionStorage.jiaoban_account = name;
//                        sessionStorage.banci = banci;
//                        sessionStorage.zhici = zhici;
                        $("#jiaojieban_title").text("接班人信息验证");
                        $("#jieban_submit").text('接班验证');
                        //记录交班日志
                        jiaojieban_auth(sessionStorage.jieban_account,
                                sessionStorage.jiaoban_account,
                                '密码',
                                banci,
                                zhici);
                    } else {
                        stage = 0;
                        //清空原有信息
                        $("#jieban_account").val("");
                        $('#jieban_password').val("");
                    }
                } else {
                    stage = 0;
                    $("#jieban_tips").text(data.info);
                    $("#jiaojieban_title").text("接班人信息验证");
                    $("#jieban_submit").text('接班验证');
                    return;
                }
            });
}

//切换账户信息并正式登陆
function jiaojieban_auth(new_username, old_username, type, banci, zhici) {
    //账号合法性验证
    if (new_username == old_username) {
        $('#jieban_modal').modal('hide');
        $.alert({
            title: '提示',
            content: '对不起，交班人和接班人不能是同一人，请重新输入！'
        });
        return;
    }
    var params = {};
    params.new_account = new_username;
    params.old_account = old_username;
    params.jiaoban_type = type;
    params.banci = banci;
    params.zhici = zhici;
    //记录交接班记录
    $.post("JiaojiebanAuth", params, function (mdata) {
        var data = JSON.parse(mdata);
        if (data.code == 0) {
            //跳转到首页面
            window.location.replace("main.html");
        } else {
            showTip("对不起，交接班失败！");
            $("#jieban_tips").text(data.info);
            //清空原有信息
            $("#jieban_account").val("");
            $('#jieban_password').val("");
        }
    });
}


//指纹扫描定时器
var finger_timer = null;
//开始指纹扫描登录
function start_scan() {
//                alert("start scan!");
    //启动指纹采集程序
    window.parent.parent.JsInterface.start_finger_scaner();
    read_finger_image();
    finger_timer = setInterval('read_finger_image()', 500);
}

//开始数据审核身份指纹扫描
function start_finger_auth_scan() {
    //启动指纹采集程序
    window.parent.parent.JsInterface.start_finger_scaner();
    read_finger_auth_image(function () {
        submit_maintained_data();
    })
    finger_timer = setInterval('read_finger_auth_image(function(){submit_maintained_data();})', 500);
}

//维护数据审核指纹身份认证
function start_data_maintain_verify_scan() {
    //启动指纹采集程序
    window.parent.parent.JsInterface.start_finger_scaner();
    read_finger_auth_image(function () {
        submit_maintain_data_verify();
    })
    finger_timer = setInterval('read_finger_auth_image(function(){submit_maintain_data_verify();})', 500);
}

//结束监控指纹身份认证
function start_data_end_monitor_verify_scan() {
    //启动指纹采集程序
    window.parent.parent.JsInterface.start_finger_scaner();
    read_finger_auth_image(function () {
        submit_maintain_data_verify();
    })
    finger_timer = setInterval('read_finger_and_auth_image(function(){end_monitor_action();})', 500);
}

//开始数据恢复身份指纹扫描
function start_finger_recover_scan() {
    //启动指纹采集程序
    window.parent.parent.JsInterface.start_finger_scaner();
    read_finger_auth_image(function () {
        recover_data_from_local();
    });
    finger_timer = setInterval('read_finger_auth_image(function(){recover_data_from_local();})', 500);
}

//读取指纹并且进行验证
function read_finger_and_auth_image(callback) {
    //读取指纹文件上传成功后的路径
    var finger_file_path = window.parent.parent.JsInterface.read_finger_img();
    if (finger_file_path == undefined || finger_file_path == "02") {
        return;
    }
    //如果返回指纹文件地址，说明指纹图片上传成功
    if (finger_file_path != '02') {
        end_scan();
        //清除定时器
        if (finger_timer != null) {
            clearInterval(finger_timer);
            finger_timer = null;
        }
        //web接口参数
        var params = {};
        params.finger_file_path = finger_file_path;
        $.post("AuthFingerServlet", params, function (mdata) {
            var data = JSON.parse(mdata);
            if (data.code == 0) {
                //记录下审核账号
                second_account = data.account;
                //执行回调函数
                callback();
            } else {
                showTip(data.info);
            }
        })

    }
}
//读取指纹并且进行验证
function read_finger_auth_image(callback) {
    //读取指纹文件上传成功后的路径
    var finger_file_path = window.parent.parent.JsInterface.read_finger_img();
    if (finger_file_path == undefined || finger_file_path == "02") {
        return;
    }
    //如果返回指纹文件地址，说明指纹图片上传成功
    if (finger_file_path != '02') {
        end_scan();
        //清除定时器
        if (finger_timer != null) {
            clearInterval(finger_timer);
            finger_timer = null;
        }
        //web接口参数
        var params = {};
        params.finger_file_path = finger_file_path;
        $.post("FingerApproval", params, function (mdata) {
            var data = JSON.parse(mdata);
            if (data.code == 0) {
                //记录下审核账号
                second_account = data.account;
                //执行回调函数
                callback();
            } else {
                showTip(data.info);
            }
        })

    }
}

var stage = 0;
//开始接班人指纹扫描
function start_jiebanren_finger_scan() {
    //启动指纹采集程序
    window.parent.parent.JsInterface.start_finger_scaner();
    read_jiaojieban_finger_image();
    finger_timer = setInterval('read_jiaojieban_finger_image()', 500);
}

//接班人指纹扫描
function read_jiaojieban_finger_image() {
    //读取指纹文件上传成功后的路径
    var finger_file_path = window.parent.parent.JsInterface.read_finger_img();
    if (finger_file_path == undefined || finger_file_path == "02") {
        return;
    }
    //如果返回指纹文件地址，说明指纹图片上传成功
    if (finger_file_path != '02') {
//        end_scan();
//        //清除定时器
//        if (finger_timer != null) {
//            clearInterval(finger_timer);
//            finger_timer = null;
//        }
        //web接口参数
        var params = {};
        params.finger_file_path = finger_file_path;
        $.post("FingerLogin", params, function (mdata) {
            var data = JSON.parse(mdata);
            if (data.code == 0) {
                //转到主页面
                if (stage == 1) {
                    end_scan();
                    //清除定时器
                    if (finger_timer != null) {
                        clearInterval(finger_timer);
                        finger_timer = null;
                    }
                    $("#finger_tips").text("交班人指纹扫描通过！");
                    sessionStorage.jiaoban_account = data.account;
                    var banci = $("#finger_banci").val(); //班次
                    var zhici = $("#finger_zhici").val(); //值次
                    //记录交班日志
                    jiaojieban_auth(sessionStorage.jieban_account,
                            sessionStorage.jiaoban_account,
                            '指纹',
                            banci,
                            zhici);
                } else {
                    $("#finger_tips").text("接班人指纹扫描通过！");
                    stage = 1;
                    sessionStorage.jieban_account = data.account;
                    //记录账号
                    localStorage.setItem("account", data.account);
                    var banci = $("#finger_banci").val(); //班次
                    var zhici = $("#finger_zhici").val(); //值次
                    //最新需求增加用户的班次属性
                    sessionStorage.setItem("ban6", zhici); //值次
                    sessionStorage.setItem("ban3", banci); //班次
                    //最新需求增加用户的班次属性
                    localStorage.setItem("banci", banci); //班次:早班中班晚班
                    localStorage.setItem("zhici", zhici); //值次：一班。。。六班
                }
            } else {
                showTip(data.info);
            }
        })

    }
}
//开始指纹录入监听
function start_finger_enroll() {
    try {
        //启动指纹采集程序
        window.parent.parent.JsInterface.start_finger_scaner();
        read_finger_image();
        finger_timer = setInterval('enroll_finger_image()', 500);
    } catch (err) {
        console.info(err);
    }
}
//读取指纹图片
function read_finger_image() {
    try {
        //读取指纹文件上传成功后的路径
        var finger_file_path = window.parent.parent.JsInterface.read_finger_img();
        if (finger_file_path == undefined || finger_file_path == "02") {
            return;
        }
        //如果返回指纹文件地址，说明指纹图片上传成功
        if (finger_file_path != '02') {
            end_scan();
            //清除定时器
            if (finger_timer != null) {
                clearInterval(finger_timer);
                finger_timer = null;
            }
            //web接口参数
            var params = {};
            params.finger_file_path = finger_file_path;
            $.post("FingerLogin", params, function (mdata) {
                var data = JSON.parse(mdata);
                if (data.code == 0) {
                    //记录账号
                    localStorage.setItem("account", data.account);
                    var banci = $("#finger_banci").val(); //班次
                    var zhici = $("#finger_zhici").val(); //值次
                    //最新需求增加用户的班次属性
                    sessionStorage.setItem("ban6", zhici); //值次
                    sessionStorage.setItem("ban3", banci); //班次
                    //最新需求增加用户的班次属性
                    localStorage.setItem("banci", banci); //班次:早班中班晚班
                    localStorage.setItem("zhici", zhici); //值次：一班。。。六班
                    //转到主页面
                    window.location.replace("main.html");
                } else {
                    showTip(data.info);
                }
            })
        }
    } catch (err) {
        console.info(err);
    }
}

//记录指纹图片
function enroll_finger_image() {
//                alert("called me!");
    try {
        //读取指纹文件上传成功后的路径
        var finger_file_path = window.parent.parent.JsInterface.read_finger_img();
        if (finger_file_path == undefined || finger_file_path == "02") {
            return;
        }
        //如果返回指纹文件地址，说明指纹图片上传成功
        if (finger_file_path != '02') {
            //web接口参数
            sessionStorage.finger_file_path = finger_file_path;
            //提示
            showTip("指纹扫描成功！");
        }
    } catch (err) {
        console.info(err);
    }
}

//结束指纹录入
function end_finger_enroll() {
    try {
        window.parent.parent.JsInterface.stop_finger_scaner();
        //清除定时器
        if (finger_timer != null) {
            clearInterval(finger_timer);
            finger_timer = null;
        }
        //清除缓存指纹信息
        sessionStorage.finger_file_path = null;
    } catch (err) {
        console.info(err);
    }
}

//结束指纹扫描登录，切换为密码登录
function end_scan() {
//                alert("stop scan!");
    try {
        window.parent.parent.JsInterface.stop_finger_scaner();
        //清除定时器
        if (finger_timer != null) {
            clearInterval(finger_timer);
            finger_timer = null;
        }
    } catch (err) {
        console.info(err);
    }
}

//判断一个字符串是否为json格式，返回true或者false
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
}

//保留两位小数 
//功能：将浮点数四舍五入，取小数点后2位 
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return x;
    }
    f = Math.round(f * 100) / 100;
    return f;
}

//保留三位小数 
//功能：将浮点数四舍五入，取小数点后3位 
function toDecimal3(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return x;
    }
    f = Math.round(f * 1000) / 1000;
    return f;
}
/**
 *判断是否是数字
 *
 **/

function isRealNum(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
//    if (val === "" || val == null) {
//        return true;
//    }
    if (!isNaN(val)) {
        //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
        //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
        return true;
    } else {
        return false;
    }
}


//控制只能输入小数点后2位
function clearNoNum(value) {
    value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符   
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
    if (value.indexOf(".") < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        value = parseFloat(value);
    }
    return value;
}

//删除车次信息
function delete_pici_info(train_no) {
    var params = {};
    //备份车辆维护数据
    params.sid = 'delete_pici_info';
    var conditions = {};
    conditions.train_no = train_no;
    params.conditions = JSON.stringify(conditions);
    //执行删除操作
    $.post("DeleteDataServlet", params, function (mdata) {
        var data = JSON.parse(mdata);
        if (data.code != 0) {
            showTip("对不起，删除车次数据失败！");
            return false;
        } else {
            return true;
        }
    });
}

//返回当前时间
function get_current_time() {
    var today = new Date();
    var month = today.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    var hours = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    var mins = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    var secs = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();
    var now1 = today.getFullYear() + '-' + month + '-' + day + " " + hours + ":" + mins + ":" + secs;
    return now1;
}