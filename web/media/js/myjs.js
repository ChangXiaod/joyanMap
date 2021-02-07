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
    if ($("input,select").each(function (i, input) {
        var val = $("#" + input.id).val();
        if (val != "" && val != null && val != undefined) {
            //设置键值对
            params[input.id] = val;
            //如果遍历结束，则返回结果
            if (i == $("input,select").size() - 1) {
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
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记  
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