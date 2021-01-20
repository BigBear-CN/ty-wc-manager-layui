/**
 * @description: 工具类
 */

let utils = {
    // 格式化选项集合（json对象），供xmSelect使用
    formatDataForSelect: function (optionsJsonObj,name,value) {
        let data = [];
        for(let key in optionsJsonObj){
            let option = optionsJsonObj[key];
            data.push({
                name: option[name]
                ,value: option[value]
                ,selected: option["selected"]==="selected"
            })
        }
        return data;
    },

    errorMsg: function (msg) {
        layer.msg("<span class='tip_fail_sm'>" + msg + "<span>",{icon:5});
    },

    successMsg: function (msg) {
        layer.msg("<span class='tip_success_sm'>" + msg + "<span>",{icon:6});
    },

    isEmpty: function (str) {
        return str===null || str==="undefined" || str==='';
    },

    clearForm: function (formId) {
        let id = "#" + formId;
        $(id)[0].reset();
    },

    renderTable: function (tableId, url, toolbarId, cols, formatResult) {
        layui.table.render({
            elem: '#'+tableId
            ,height: 520
            ,cellMinWidth:80
            ,defaultToolbar: []
            ,url: url
            ,method: 'post'
            ,contentType: 'application/json;charset=UTF-8'
            ,request: {
                pageName: 'pageIndex'
                ,limitName: 'pageSize'
            }
            ,page: true
            ,limit:10
            ,limits:[10,20,30,40,50]
            ,toolbar:'#'+toolbarId
            ,cols: cols
            ,parseData: function(result){ //res 即为原始返回的数据
                return formatResult(result);
            }
        });
    },

    reloadTable: function (tableId, paramsJsonObj) {
        layui.table.reload(tableId,{
            where: paramsJsonObj
            ,page: {
                curr: 1
            }
        });
    },

    formatState: function (state) {
        switch(state){
            case 1:
                return "<div class='tip_success_sm'>正常</div>";
            case 0:
                return "<div class='tip_fail_sm'>锁定</div>";
            default :
                return "<div>未知</div>"
        }
    },

    formatResult: function (result) {
        return {
            "code": result.code,
            "msg": result.msg,
            "count": result.data.totalElements,
            "data": result.data.content
        };
    },
};
const CODE = {
    success:0
    ,failed:10000
};

