var utils = {

    tableObj: {
        elem: '#table1'
        //, url: 'getRoles' //数据接口
        //, page: {} //开启分页
        , cols: []
        , request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'size' //每页数据量的参数名，默认：limit
        }
        , id: 'listData'
        , size: 'lg'
        , defaultToolbar: []
        , done: function (res, curr, count) {

        }
    },
    /**
     * ajax 请求
     * @param obj
     */
    ajax: function (obj) {
        if (obj.title) {
            this.confirm(obj.title, function (index) {
                utils.privateAjax(obj);
                layui.layer.close(index);
            });
        } else {
            utils.privateAjax(obj);
        }
    },

    // ajax 请求
    privateAjax: function (obj) {
        $.ajax({
            type: obj.type,
            url: obj.url,
            data: obj.data,
            success: function (data) {
                if (utils.isFunction(obj.success)) {
                    obj.success(data);
                } else if (data.code == 0) {
                    utils.successMsg(utils.getI18nValue("common.layui.msg.success"));// 统一提示操作成功
                } else {
                    utils.errorMsg(utils.getI18nValue("common.layui.msg.error"));// 统一提示成功失败
                }
            },
            error: function () {
                if (utils.isFunction(obj.error)) {
                    obj.error();
                } else {
                    utils.serverErrorMsg(); // 统一提示服务器内部错误
                }
            }
        });
    },

    /**
     * 判断是否为函数
     * @param fun
     * @returns {boolean}
     */
    isFunction: function (fun) {
        return typeof fun === "function";
    },

    /**
     * 获取表单的数据
     * @param form
     * @returns {*}
     */
    getFormData: function (form) {
        var formValues = $('#' + form).serialize().replace(/\+/g, " ");
        return this.conveterParamsToJson(decodeURIComponent(formValues));
    },

    // 参数格式 name=zhangsan&age=18&sex=1
    conveterParamsToJson: function (paramsAndValues) {
        var jsonObj = {};
        var param = paramsAndValues.split("&");
        for (var i = 0; param != null && i < param.length; i++) {
            var para = param[i].split("=");
            jsonObj[para[0]] = para[1];
        }
        return jsonObj;
    },

    /**
     * 判断是否为json字符串
     * @param str
     * @returns {boolean}
     */
    isJsonString: function (str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch (e) {

        }
        return false;
    },

    /**
     * 时间戳转化成日期格式
     * @param unixTime 时间戳
     * @param isFull 是否全显示
     * @param timeZone 时区
     * @returns {string} yyyy-MM-dd [HH:mm:ss]
     */
    unixToDate: function (unixTime, isFull, timeZone) {
        if (!unixTime) {
            return "";
        }
        if (unixTime.toString().length == 10) {
            unixTime = parseInt(unixTime) * 1000;
        }
        var t = null;
        timeZone = utils.getTimeZone();
        //if (typeof timeZone == 'number') {
        var correctionTime = parseInt(timeZone) * 60 * 60 * 1000;
        t = parseInt(unixTime) + correctionTime;
        /*console.log(t);
        unixTime == parseInt(unixTime) + correctionTime;*/
        //}
        var time = null;
        if (t == null) {
            time = new Date(unixTime);
        } else {
            time = new Date(t);
        }
        //var time = new Date(unixTime);
        var year = time.getUTCFullYear();
        var month = time.getUTCMonth() + 1;
        var day = time.getUTCDate();
        var hour = time.getUTCHours();
        var min = time.getUTCMinutes();
        var sec = time.getUTCSeconds();
        var ymdhis = year + "-";
        ymdhis += this.parseOneToTwo(month) + "-";
        ymdhis += this.parseOneToTwo(day);
        if (isFull === true) {
            ymdhis += " " + this.parseOneToTwo(hour) + ":";
            ymdhis += this.parseOneToTwo(min) + ":";
            ymdhis += this.parseOneToTwo(sec);
        }
        return ymdhis;
    },

    parseOneToTwo: function (data) {
        if (data < 10) {
            return "0" + data;
        }
        return "" + data;
    },

    /**
     * 根据日期格式转换成时间戳
     * @param date 日期格式
     * @returns {number} 时间戳
     */
    dateToUnix: function (date) {
        if (!date) {
            return 0;
        }
        var d = new Date(date);
        return d.getTime() - utils.getTimeZoneOffset();
    },

    loadTimeZone: function (fun) {
        utils.ajax({
            url: "../timeZone/get",
            type: "get",
            data: {},
            success: function (data) {
                if (data.code == 0) {
                    sessionStorage.setItem("timeZone", parseInt(data.obj));
                    if (utils.isFunction(fun)) {
                        fun();
                    }
                } else {
                    utils.loadErrorMsg();
                }
            },
            error: function () {
                utils.loadErrorMsg();
            }
        })
    },

    getTimeZone: function () {
        var timezone = sessionStorage.getItem("timeZone");
        if (timezone == null || timezone == '') {
            utils.loadTimeZone(utils.getTimeZone);
        } else {
            return timezone;
        }
    },
    getTimeZoneOffset: function () {
        var localZone = new Date().getTimezoneOffset() / 60;
        //console.log(utils.getTimeZone());
        var offset = (parseInt(utils.getTimeZone()) + localZone) * 60 * 60 * 1000;
        //console.log(offset);
        return offset;
    },

    /**
     * 请求国际化语言
     */
    loadLanguageProperties: function (lang) {
        var settings = {
            name: "message",
            path: "./i18n/",
            mode: "map",
            //namespace: "i18n",
            cache: true,
            language: lang,
            callback: function () {
                //console.log($.i18n);
                sessionStorage.setItem("i18n_lang", JSON.stringify($.i18n.map));
                sessionStorage.setItem("lang", lang);
                //console.log(sessionStorage.getItem("i18n_lang"));
            }
        };
        $.i18n.properties(settings);
    },
    /**
     * 根据key值获取国际化语言
     * @param key key值
     * @returns {*}
     */
    getI18nValue: function (key) {
        var langs = JSON.parse(sessionStorage.getItem("i18n_lang"));
        if (langs && langs.hasOwnProperty(key)) {
            return langs[key];
        } else {
            return key;
        }
    },

    getI18nValueFormat: function (key, value) {
        return this.format(this.getI18nValue(key), value)
    },

    /**
     * 获取当前语言
     * @returns {string}
     */
    getLang: function () {
        return sessionStorage.getItem("lang");
    },

    /**
     * 基于layer.open封装的国际化confirm
     */
    confirm: function (content, fun) {
        layui.layer.open({
            title: this.getI18nValue("common.layui.confirm.title"),
            content: content,
            btn: [this.getI18nValue("common.layui.confirm.btn.confirm"), this.getI18nValue("common.layui.confirm.btn.cancel")],
            yes: function (index, layero) {
                if (utils.isFunction(fun)) {
                    fun(index);
                }
            }
        });
    },

    /**
     * 基于layer.open封装的国际化alert
     * @param content
     */
    alert: function (content, func) {
        layui.layer.open({
            title: this.getI18nValue("common.layui.alert.title"),
            content: content,
            btn: [this.getI18nValue("common.layui.alert.btn.confirm")],
            yes: function (index, layero) {
                if (utils.isFunction(func)) {
                    func(index);
                }
                layui.layer.close(index);
            }
        });
    },
    alertSuccess: function () {
        utils.alert(utils.getI18nValue("common.layui.msg.success"), function () {
            // 获得frame索引
            var index = parent.layer.getFrameIndex(window.name);
            //关闭当前frame
            parent.layer.close(index);
        });
    },
    alertNotAllNull: function () {
        utils.alert(utils.getI18nValue("common.search.alert.no.null"));
    },

    /**
     * 提示操作成功信息
     * @param content
     */
    successMsg: function (content) {
        if (!content) {
            content = utils.getI18nValue("common.layui.msg.success");
        }
        layui.layer.msg(content, {
            icon: 6,
            time: 3000
        });
    },
    /**
     * 提示操作失败信息
     * @param content
     */
    errorMsg: function (content) {
        if (!content) {
            content = utils.getI18nValue("common.layui.msg.error");
        }
        layui.layer.msg(content, {
            icon: 5,
            time: 3000
        });
    },

    loadErrorMsg: function () {
        layui.layer.msg(utils.getI18nValue("common.load.error"));
    },

    /**
     * 服务器内部错误消息
     */
    serverErrorMsg: function () {
        layui.layer.msg(utils.getI18nValue("common.server.internal.error"));
    },

    /**
     * 操作太频繁了
     */
    oftenMsg: function () {
        layui.layer.msg(utils.getI18nValue("common.too.often"));
    },

    tableInit: function (url, page, titleUrl, size) {
        utils.tableObj.url = url;
        if (!page) {
            utils.tableObj.page = {
                lang: utils.getLang()
            };
        }
        if (size) {
            delete utils.tableObj.size;
        }
        utils.getTableTitle(titleUrl);
    },

    getTableTitle: function (url) {
        utils.ajax({
            type: "get",
            url: url ? url : "getTableTitle",
            data: {},
            success: function (data) {
                if (data.code == 0) {
                    var obj = data.obj;
                    if (obj.hasOwnProperty("toolbar") && obj.toolbar) {
                        utils.tableObj.toolbar = obj.toolbar;
                    }
                    if (obj.hasOwnProperty("defaultToolbar") && obj.defaultToolbar) {
                        utils.tableObj.defaultToolbar = obj.defaultToolbar;
                    }
                    if (obj.hasOwnProperty("cols")) {
                        obj.cols.forEach(function (value) {
                            if (value.hasOwnProperty("templet") && value.templet != null && value.templet != '') {
                                var templet = value.templet;
                                if (templet == "unixToDate") {  // 时间戳转日期+时间
                                    value.templet = function (d) {
                                        return utils.unixToDate(parseInt(d[value.field]), true, 8);
                                    }
                                } else if (templet == "unixToDateShort") { // 时间戳转日期
                                    value.templet = function (d) {
                                        return utils.unixToDate(parseInt(d[value.field]), false, 8);
                                    }
                                } else if (templet == "unix1000ToDate") {
                                    value.templet = function (d) {
                                        return utils.unixToDate(parseInt(d[value.field]) * 1000, true, 8);
                                    }
                                } else if (templet == "getI18nValue") { // 国际化语言
                                    value.templet = function (d) {
                                        return utils.getI18nValue(d[value.field]);
                                    }
                                } else if (templet.indexOf("Boolean") != -1) { // bool值转化
                                    value.templet = function (d) {
                                        if (d[value.field]) {
                                            return utils.getI18nValue(obj[templet][1]);
                                        } else {
                                            return utils.getI18nValue(obj[templet][0]);
                                        }
                                    }
                                } else {
                                    value.templet = function (d) {
                                        if (d[value.field] >= obj[templet].length) {
                                            return d[value.field];
                                        }
                                        return utils.getI18nValue(obj[templet][d[value.field]]);
                                    }
                                }
                            }
                        });
                        utils.tableObj.cols.push(obj.cols);
                    }
                } else {
                    layui.layer.msg(utils.getI18nValue("user.get.table.title.error"));
                }
            }
        });
    },

    /**
     * 判断表单得输入条件是否全为空，全为空返回true
     * @param formId
     * @returns {boolean}
     */
    isAllNull: function (formId) {
        var inputs = document.querySelectorAll("#" + formId + " input")
        var flag = true;
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value != null && inputs[i].value != "") {
                flag = false;
                break;
            }
        }
        return flag;
    },

    chooseOneMsg: function () {
        layui.layer.msg(utils.getI18nValue("common.choose.one"));
    },

    /**
     * 格式化替换
     * @param source {0}{1}string
     * @param params  ["1","2"]
     * @returns {*}  12string
     */
    format: function (source, params) {
        if (arguments.length === 1) {
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args)
            }
        }
        if (arguments.length > 2 && params.constructor !== Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                return n;
            });
        });
        return source;
    },

    /**
     * 确认提示框
     * @param param add--添加，edit--修改，delete--删除，batch--批量删除
     * @returns {*}
     */
    confirmPrompt: function (param) {
        if (param == "add") {
            return utils.getI18nValue("common.confirm.add");
        } else if (param == "edit") {
            return utils.getI18nValue("common.confirm.edit");
        } else if (param == "delete") {
            return utils.getI18nValue("common.confirm.delete");
        } else if (param == "batch") {
            return utils.getI18nValue("common.confirm.delete.batch");
        } else if (param == "refresh") {
            return utils.getI18nValue("common.confirm.refresh");
        } else if (param == "push") {
            return utils.getI18nValue("common.confirm.push");
        } else {
            return utils.getI18nValue("common.confirm");
        }
    },
    /**
     * 生成日期控件
     * @param ids 数组
     */
    layuidate: function (ids) {
        layui.use('laydate', function () {
            var laydate = layui.laydate;
            for (var x in ids) {
                //执行一个laydate实例
                laydate.render({
                    elem: ids[x] //指定元素
                    , type: 'datetime'
                    , lang: utils.getLang() == "zh_CN" ? "cn" : "en"  // 'en',只支持中文和英文
                });
            }
        });
    },

    formAndTableInit: function (fieldObj, auto) {
        layui.use(['form', 'layer'], function () {
            $ = layui.jquery;
            var form = layui.form, layer = layui.layer;

            //自定义验证规则
            form.verify({
                ip: function (value) {
                    if (!/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/.test(value)) {
                        return utils.getI18nValue("webServer.add.ip");
                    }
                }
            });
            if (auto) {
                utils.privateTableInit(fieldObj, form);
            } else {
                //监听提交
                form.on('submit(search)', function (d) {
                    utils.privateTableInit(fieldObj, form);
                    return false;
                });
            }
        });
    },

    privateTableInit: function (fieldObj, form) {
        if (fieldObj.isAllNull) {
            if (utils.isAllNull('searchForm')) {
                utils.alertNotAllNull();
                return false;
            }
        }
        var reqObj = utils.getFormData('searchForm');

        layui.use('table', function () {
            var table = layui.table;
            if (fieldObj.sort) {
                reqObj['sort'] = fieldObj.sort.key;
                reqObj['order'] = fieldObj.sort.order;
            }
            var editCol = null;
            if (fieldObj.isEdit || fieldObj.isDelete) {
                editCol = {field: '', title: utils.getI18nValue("common.bar.edit"), toolbar: '#bar'};
            }
            var toolBar = "";
            if (fieldObj.isDeleteBatch || fieldObj.isAdd) {
                toolBar = "#toolbar";
            }

            var tableObj = {
                elem: '#table1'
                , url: fieldObj.url.get //数据接口
                , cols: [[]]
                , toolbar: toolBar
                // , defaultToolbar: ['exports']
                , request: {
                    pageName: 'page' //页码的参数名称，默认：page
                    , limitName: 'size' //每页数据量的参数名，默认：limit
                }
                , where: reqObj
                , id: 'listData'
                , size: 'lg'
            };

            if (fieldObj.isPaging) {
                tableObj.page = {
                    lang: utils.getLang()
                }
            }

            // 首列
            if (fieldObj.firstColumnType) {
                tableObj.cols[0].push({
                    field: '',
                    type: fieldObj.firstColumnType
                })
            }
            var columns = fieldObj.columns;
            for (var x in columns) {
                if (columns[x]["isShow"]) {
                    var col = {
                        field: columns[x]["field"],
                        title: columns[x]["title"],
                        sort: columns[x]["sort"] ? true : false,
                    };
                    // 这里使用匿名函数是的变量x可以在回调函数中使用
                    (function (x) {
                        var fieldName = columns[x]["isShow"]["field"] ? columns[x]["isShow"]["field"] : columns[x]["field"];
                        if (columns[x]["type"]) {
                            if (columns[x]["type"]["type"] == 'alert') { // 弹窗
                                col.templet = function (d) {
                                    var ret = '<a onclick="x_admin_show(\'' + columns[x]['type']['name'] + '\',\'' + columns[x]['type']['url'];
                                    var params = columns[x]["type"]["param"];
                                    console.log(params);
                                    if (params) {
                                        ret += "?";
                                        for (var i = 0; i < params.length; i++) {
                                            if (params[i].type == 'column') {
                                                var key = params[i].value;
                                                ret += params[i].key + "=" + d[key];
                                            } else if (params[i].type == 'value') {
                                                ret += params[i].key + "=" + params[i].value;
                                            } else if (params[i].type == 'reqObj') {
                                                var key = params[i].value;
                                                ret += params[i].key + "=" + reqObj[key];
                                            }
                                            ret += "&";
                                        }
                                        ret = ret.substr(0, ret.length - 1);
                                    }

                                    ret += '\')">' + columns[x]['type']['content'] + '</a>';
                                    return ret;
                                }
                            } else if (columns[x]["type"]["type"] == 'percent') {  // 数值转换成百分比
                                col.templet = function (d) {
                                    var end = d[fieldName] * 5;
                                    var start = end - 4;
                                    if (d[fieldName] == 1) {
                                        start = 0;
                                    }
                                    return start + "~" + end + "%";
                                }
                            }
                        } else if (columns[x]["selected"]) {  // 选择列
                            col.templet = function (d) {
                                for (var index in columns[x]["selected"]["option"]) {
                                    if (columns[x]["selected"]["option"][index]["value"] == d[fieldName]) {
                                        return columns[x]["selected"]["option"][index]["label"];
                                    }
                                }
                            }
                        } else if (columns[x]["picker"]) { // 日期列
                            col.templet = function (d) {
                                return utils.unixToDate(d[fieldName], columns[x]["picker"]["type"] == "datetime", 8);
                            }
                        } else {
                            col.templet = function (d) {
                                return d[fieldName] ? d[fieldName] : d[fieldName] == 0 ? 0 : '';
                            }
                        }
                    })(x);

                    tableObj.cols[0].push(col)
                }
            }
            tableObj.cols[0].push(editCol);

            //第一个实例
            table.render(tableObj);

            //监听工具条
            table.on('tool(listData)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的DOM对象

                if (layEvent === 'del') { //删除
                    if (!fieldObj.isDelete) {
                        return;
                    }
                    var key = fieldObj.primaryKey;
                    var d = {};
                    for (var i = 0; i < key.length; i++) {
                        d[key[i]] = data[key[i]];
                    }
                    if (fieldObj.hidden) {
                        for (var i = 0; i < fieldObj.hidden.length; i++) {
                            var hiddenKey = fieldObj.hidden[i].key;
                            var value = fieldObj.hidden[i].value == "reqObj" ? reqObj[hiddenKey] : fieldObj.hidden[i].value;
                            d[hiddenKey] = value;
                        }
                    }
                    utils.ajax({
                        type: 'post',
                        url: fieldObj.url.delete,
                        data: d,
                        title: utils.confirmPrompt("delete"),
                        success: function (data) {
                            if (data.code == 0) {
                                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                utils.successMsg();
                            } else {
                                utils.errorMsg();
                            }
                        }
                    });

                } else if (layEvent === 'edit') { //编辑
                    if (!fieldObj.isEdit) {
                        return;
                    }
                    var picker = [];
                    var updateReqObj = [];

                    var html = '<div class="x-body">';
                    html += '<form class="layui-form" id="editForm">';

                    for (var x in fieldObj.columns) {
                        if (fieldObj.columns[x].isEdit) {
                            // 该字段是否要上传
                            if (fieldObj.columns[x].isEdit.upload) {
                                var fieldName = columns[x]["isShow"] ? columns[x]["isShow"]["field"] ? columns[x]["isShow"]["field"] : columns[x]["field"] : columns[x]["field"];
                                var uploadObj = {};
                                uploadObj[fieldObj.columns[x].field] = data[fieldName];
                                uploadObj.picker = fieldObj.columns[x].picker;
                                updateReqObj.push(uploadObj);
                            }

                            html += '<div class="layui-form-item">';
                            html += '<label for="' + fieldObj.columns[x].field + '" class="layui-form-label">';
                            html += fieldObj.columns[x].title;
                            html += '</label>';

                            html += '<div class="layui-input-block">';
                            // 该字段是否显示编辑
                            if (fieldObj.columns[x].isEdit.disabled) {
                                html += '<input type="text" lay-verify="' + fieldObj.columns[x].filter + '" value="' + data[fieldObj.columns[x].field] + '" id="' + fieldObj.columns[x].field + '" name="' + fieldObj.columns[x].field + '" autocomplete="off" class="layui-input layui-disabled" disabled>';
                                var obj = {};
                                obj[fieldObj.columns[x].field] = data[fieldObj.columns[x].field]
                                updateReqObj.push(obj);
                            } else {
                                if (fieldObj.columns[x].selected) {  // 选择列
                                    html += '<select name="' + fieldObj.columns[x].field + '" id="' + fieldObj.columns[x].field + '" lay-filter="' + fieldObj.columns[x].field + 'Select">';
                                    for (var index in fieldObj.columns[x].selected.option) {
                                        if (data[fieldObj.columns[x].field] == fieldObj.columns[x].selected.option[index].value) {
                                            html += '<option value="' + fieldObj.columns[x].selected.option[index].value + '" selected>' + fieldObj.columns[x].selected.option[index].label + '</option>';
                                        } else {
                                            html += '<option value="' + fieldObj.columns[x].selected.option[index].value + '">' + fieldObj.columns[x].selected.option[index].label + '</option>';
                                        }
                                    }
                                    html += '</select>'
                                } else if (fieldObj.columns[x].picker) { // 日期列
                                    html += '<input type="text" id="' + fieldObj.columns[x].field + '" name="' + fieldObj.columns[x].field + '" autocomplete="off" class="layui-input">';
                                    picker.push({
                                        id: fieldObj.columns[x].field,
                                        value: data[fieldObj.columns[x].field]
                                    });
                                } else { // input
                                    var realValue = data[fieldObj.columns[x].field] ? data[fieldObj.columns[x].field] : data[fieldObj.columns[x].field] == 0 ? 0 : '';
                                    html += '<input type="text" lay-verify="' + fieldObj.columns[x].filter + '" value="' + realValue + '" id="' + fieldObj.columns[x].field + '" name="' + fieldObj.columns[x].field + '" autocomplete="off" class="layui-input">';
                                }
                            }
                            html += '</div>';
                            html += '</div>';

                        }
                    }

                    html += '<div class="layui-form-item">';
                    html += '<label class="layui-form-label">';
                    html += '</label>';
                    html += '<button  class="layui-btn" lay-filter="edit" lay-submit="">';
                    html += utils.getI18nValue("common.btn.update");
                    html += '</button>';
                    html += '</div>';

                    html += '</form>';
                    html += '</div>';

                    var index = showEdit(utils.getI18nValue("common.btn.update"), html, 700, 620);

                    layui.form.render('select');

                    // 处理日期
                    var ids = [];
                    if (picker.length > 0) {
                        for (var x in picker) {
                            ids.push({
                                id: "#" + picker[x].id,
                                value: picker[x].value
                            });
                        }
                        layui.use('laydate', function () {
                            var laydate = layui.laydate;
                            for (var x in ids) {
                                //执行一个laydate实例
                                var time = ids[x].value.toString().length > 10 ? ids[x].value * 1 : ids[x].value * 1000;
                                laydate.render({
                                    elem: ids[x].id //指定元素
                                    , type: 'datetime'
                                    , lang: utils.getLang() == "zh_CN" ? "cn" : "en"  // 'en',只支持中文和英文
                                    , value: new Date(time + utils.getTimeZoneOffset())
                                })
                            }
                        });
                    }

                    // 监听修改按钮
                    form.on('submit(edit)', function (d) {
                        var editReqObj = utils.getFormData('editForm');
                        //editReqObj['ctime'] = utils.unixToDate(parseInt(data.createTime), true, 8);
                        updateReqObj.push(reqObj);
                        if (updateReqObj) {
                            for (var x in updateReqObj) {
                                if (updateReqObj[x].picker) {
                                    for (var key in updateReqObj[x]) {
                                        if (key == "picker") {
                                            continue;
                                        }
                                        editReqObj[key] = utils.unixToDate(updateReqObj[x][key], true, 8);
                                    }
                                } else {
                                    for (var key in updateReqObj[x]) {
                                        if (key == "picker") {
                                            continue;
                                        }
                                        editReqObj[key] = updateReqObj[x][key];
                                    }
                                }
                            }
                        }
                        if (fieldObj.hidden) {
                            for (var i = 0; i < fieldObj.hidden.length; i++) {
                                var hiddenKey = fieldObj.hidden[i].key;
                                var value = fieldObj.hidden[i].value == "reqObj" ? reqObj[hiddenKey] : fieldObj.hidden[i].value;
                                editReqObj[hiddenKey] = value;
                            }
                        }
                        utils.ajax({
                            type: 'post',
                            url: fieldObj.url.edit,
                            data: editReqObj,
                            title: utils.confirmPrompt("edit"),
                            success: function (data) {
                                if (data.code === 0) {
                                    utils.successMsg();
                                    //关闭当前frame
                                    layer.close(index);
                                    tableReload();
                                } else {
                                    utils.errorMsg();
                                }
                            }
                        });
                        return false;
                    });
                }
            });

            function tableReload() {
                table.reload('listData', tableObj);
            }

            //监听事件
            table.on('toolbar(listData)', function (obj) {
                var checkStatus = table.checkStatus(obj.config.id);
                switch (obj.event) {
                    case 'add':
                        if (!fieldObj.isAdd) {
                            return;
                        }

                        var picker = [];

                        var html = '<div class="x-body">';
                        html += '<form class="layui-form" id="addForm">';

                        for (var x in fieldObj.columns) {
                            if (fieldObj.columns[x].isAdd) {
                                html += '<div class="layui-form-item">';
                                html += '<label for="' + fieldObj.columns[x].field + '" class="layui-form-label">';
                                html += fieldObj.columns[x].title;
                                html += '</label>';
                                //html += '<div class="layui-input-inline">';
                                html += '<div class="layui-input-block">';
                                //默认值
                                var val = fieldObj.columns[x].isAdd.default ? fieldObj.columns[x].isAdd.default : '';
                                if (fieldObj.columns[x].selected) {  // 选择列
                                    html += '<select name="' + fieldObj.columns[x].field + '" id="' + fieldObj.columns[x].field + '" lay-filter="' + fieldObj.columns[x].field + 'Select">';
                                    for (var index in fieldObj.columns[x].selected.option) {
                                        if (val == fieldObj.columns[x].selected.option[index].value) {
                                            html += '<option value="' + fieldObj.columns[x].selected.option[index].value + '" selected>' + fieldObj.columns[x].selected.option[index].label + '</option>';
                                        } else {
                                            html += '<option value="' + fieldObj.columns[x].selected.option[index].value + '">' + fieldObj.columns[x].selected.option[index].label + '</option>';
                                        }
                                    }
                                    html += '</select>'
                                } else if (fieldObj.columns[x].picker) { // 日期列
                                    html += '<input type="text" id="' + fieldObj.columns[x].field + '" name="' + fieldObj.columns[x].field + '" autocomplete="off" class="layui-input">';
                                    picker.push({id: fieldObj.columns[x].field});
                                } else { // input
                                    html += '<input type="text" value="' + val + '" lay-verify="' + fieldObj.columns[x].filter + '" id="' + fieldObj.columns[x].field + '" name="' + fieldObj.columns[x].field + '" autocomplete="off" class="layui-input">';
                                }
                                html += '</div>';
                                html += '</div>';
                            }
                        }


                        html += '<div class="layui-form-item">';
                        html += '<label class="layui-form-label">';
                        html += '</label>';
                        html += '<button  class="layui-btn" lay-filter="add" lay-submit="">';
                        html += utils.getI18nValue("common.btn.add");
                        html += '</button>';
                        html += '</div>';

                        html += '</form>';
                        html += '</div>';

                        var index = showEdit(utils.getI18nValue("common.btn.add"), html, 700, 620);

                        layui.form.render('select');

                        // 处理日期
                        var ids = [];
                        if (picker.length > 0) {
                            for (var x in picker) {
                                ids.push("#" + picker[x].id);
                                utils.layuidate(ids);
                            }
                        }

                        // 监听修改按钮
                        form.on('submit(add)', function (d) {
                            var addReqObj = utils.getFormData('addForm');
                            if (fieldObj.hidden) {
                                for (var i = 0; i < fieldObj.hidden.length; i++) {
                                    var hiddenKey = fieldObj.hidden[i].key;
                                    var value = fieldObj.hidden[i].value == "reqObj" ? reqObj[hiddenKey] : fieldObj.hidden.value[i];
                                    console.log(value);
                                    addReqObj[hiddenKey] = value;
                                }
                            }
                            console.log(addReqObj);
                            utils.ajax({
                                type: 'post',
                                url: fieldObj.url.add,
                                data: addReqObj,
                                title: utils.confirmPrompt("add"),
                                success: function (data) {
                                    if (data.code === 0) {
                                        utils.successMsg();
                                        //关闭当前frame
                                        layer.close(index);
                                        tableReload();
                                    } else {
                                        utils.errorMsg();
                                    }
                                }
                            });
                            return false;
                        });


                        //x_admin_show('添加游服数据库', './add', null, null, tableReload);
                        break;
                    case 'deleteBatch':
                        if (!fieldObj.isDeleteBatch) {
                            return;
                        }
                        var items = checkStatus.data;
                        if (items.length == 0) {
                            utils.chooseOneMsg();
                            return;
                        }
                        var ids = '';
                        for (var i = 0; i < items.length; i++) {
                            //ids += items[i][fieldObj.primaryKey] + ",";
                            var primaryKey = fieldObj.primaryKey;
                            for (var j = 0; j < primaryKey.length; j++) {
                                ids += items[i][primaryKey[j]] + ";"
                            }
                            ids = ids.substr(0, ids.length - 1);
                            ids += ",";
                        }
                        ids = ids.substr(0, ids.length - 1);
                        var deleteObj = {ids: ids};
                        if (fieldObj.hidden) {
                            for (var i = 0; i < fieldObj.hidden.length; i++) {
                                var hiddenKey = fieldObj.hidden[i].key;
                                var value = fieldObj.hidden[i].value == "reqObj" ? reqObj[hiddenKey] : fieldObj.hidden[i].value;
                                deleteObj[hiddenKey] = value;
                            }
                        }
                        utils.ajax({
                            type: 'post',
                            url: fieldObj.url.delBatch,
                            data: deleteObj,
                            title: utils.confirmPrompt("batch"),
                            success: function (data) {
                                if (data.code == 0) {
                                    utils.successMsg();
                                    tableReload();
                                } else {
                                    utils.errorMsg();
                                }
                            }
                        });
                        break;
                }
                ;
            });
        });
    },

    sleep: function (numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }

};

$(document).ajaxComplete(function (event, request, settings) {
    if (utils.isJsonString(request.responseText)) {
        var jsonResp = JSON.parse(request.responseText);
        if (jsonResp && jsonResp.code == 5) {
            alert(utils.getI18nValue("error.code.session.timeout.error"));
            parent.location.href = 'login';
        }
    }

});

utils.loadTimeZone();
