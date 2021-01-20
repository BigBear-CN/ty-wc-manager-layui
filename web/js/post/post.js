/**
 * @description: 封装与后端交互的 post 方法
 */

let adminPost = {

    adminPost: function (functionUrl, jsonObj, success) {
        myPost(URL.serverHost + URL.admin + functionUrl, jsonObj, success);
    },

    login: function (username, password, success) {
        this.adminPost(URL.login, {username:username,password:password}, success);
    },

    logout: function (success) {
        this.adminPost(URL.logout, {}, success);
    },

    personal: function (success) {
        this.adminPost(URL.personal, {}, success);
    },

    add: function (adminObj, success) {
        this.adminPost(URL.add, adminObj, success);
    },

    delete: function (id, success) {
        this.adminPost(URL.delete, id, success);
    },

    deleteBatch: function (ids, success) {
        this.adminPost(URL.deleteBatch, ids, success);
    },

    update: function (adminObj, success) {
        this.adminPost(URL.update, adminObj, success);
    },

    resetPwd: function (adminId, success) {
        this.adminPost(URL.resetPwd, adminId, success);
    },

    updatePwd: function (adminObj, success) {
        this.adminPost(URL.updatePwd, adminObj, success);
    },
};

let rolePost = {

    rolePost: function (functionUrl, jsonObj, success) {
        myPost(URL.serverHost + URL.role + functionUrl, jsonObj, success);
    },

    add: function (roleObj, success) {
        this.rolePost(URL.add, roleObj, success);
    },

    delete: function (roleId, success) {
        this.rolePost(URL.delete, roleId, success);
    },

    deleteBatch: function (rolesId, success) {
        this.rolePost(URL.deleteBatch, rolesId, success);
    },

    update: function (roleObj, success) {
        this.rolePost(URL.update, roleObj, success);
    },

};

let roleMenuPost = {

    roleMenuPost: function (functionUrl, jsonObj, success) {
        myPost(URL.serverHost + URL.roleMenu + functionUrl, jsonObj, success);
    },

    updateRoleMenus: function (roleId, menusId, success) {
        this.roleMenuPost(URL.updateRoleMenus, {roleId:roleId,menusId:menusId}, success);
    },

    queryRoleMenus: function (roleId, success) {
        this.roleMenuPost(URL.queryRoleMenus, roleId, success);
    },

};

let rolePermissionPost = {

    rolePermissionPost: function (functionUrl, jsonObj, success) {
        myPost(URL.serverHost + URL.rolePermission + functionUrl, jsonObj, success);
    },

    updateRolePermissions: function (roleId, permissionsId, success) {
        this.rolePermissionPost(URL.updateRolePermissions, {roleId:roleId,permissionsId:permissionsId}, success);
    },

    queryRolePermissions: function (roleId, success) {
        this.rolePermissionPost(URL.queryRolePermissions, roleId, success);
    },

};

let menuPost = {

    menuPost: function (functionUrl, jsonObj, success) {
        myPost(URL.serverHost + URL.menu + functionUrl, jsonObj, success);
    },

    all: function (success) {
        this.menuPost(URL.all, {}, success);
    },

    add: function (menuObj, success) {
        this.menuPost(URL.add, menuObj, success);
    },

    update: function (menuObj, success) {
        this.menuPost(URL.update, menuObj, success);
    },

    delete: function (menuId, success) {
        this.menuPost(URL.delete, menuId, success);
    },

    deleteBatch: function (menusId, success) {
        this.menuPost(URL.deleteBatch, menusId, success);
    },
};

let permissionPost = {

    permissionPost: function (functionUrl, jsonObj, success) {
        myPost(URL.serverHost + URL.permission + functionUrl, jsonObj, success);
    },

    all: function (success) {
        this.permissionPost(URL.all, {}, success);
    },

    add: function (permissionObj, success) {
        this.permissionPost(URL.add, permissionObj, success);
    },

    update: function (permissionObj, success) {
        this.permissionPost(URL.update, permissionObj, success);
    },

    delete: function (permissionId, success) {
        this.permissionPost(URL.delete, permissionId, success);
    },

    deleteBatch: function (permissionsId, success) {
        this.permissionPost(URL.deleteBatch, permissionsId, success);
    },

};

let accountPost = {

    accountPost: function (functionUrl, jsonObj, success) {
        myPost(URL.serverHost + URL.account + functionUrl, jsonObj, success);
    },

    add: function (accountObj, success) {
        this.accountPost(URL.add, accountObj, success);
    },

    delete: function (id, success) {
        this.accountPost(URL.delete, id, success);
    },

    deleteBatch: function (ids, success) {
        this.accountPost(URL.deleteBatch, ids, success);
    },

    update: function (accountObj, success) {
        this.accountPost(URL.update, accountObj, success);
    },
};

let adminRolePost = {

    adminRolePost: function (functionUrl, jsonObj, success) {
        myPost(URL.serverHost + URL.adminRole + functionUrl, jsonObj, success);
    },

    allRoles: function (adminId, success) {
        this.adminRolePost(URL.allRoles, adminId, success);
    },

    updateAdminRoles: function (adminId, rolesId, success) {
        this.adminRolePost(URL.updateAdminRoles, {"adminId":adminId,"rolesId":rolesId}, success);
    },

};

const URL = {
    /**
     * 后端主机地址
     */
    serverHost: "http://localhost:27576"
    /**
     * 后端模块路径
     */
    ,admin: "/wc/api/adminInfo"
    ,account: "/wc/api/accountInfo"
    ,adminRole: "/wc/api/adminRole"
    ,role: "/wc/api/role"
    ,menu: "/wc/api/menu"
    ,permission: "/wc/api/permission"
    ,roleMenu: "/api/roleMenu"
    ,rolePermission: "/api/rolePermission"
    /**
     * 后端功能路径
     */
    ,login: "/login"
    ,logout: "/logout"
    ,personal: "/personal"
    ,addAdmin: "/addAdmin"
    ,updatePwd: "/updatePwd"
    ,add: "/add"
    ,delete: "/delete"
    ,deleteBatch: "/deleteBatch"
    ,update: "/update"
    ,list: "/list"
    ,listByCondition: "/listByCondition"
    ,resetPwd: "/resetPwd"
    ,all: "/all"
    ,allRoles: "/allRoles"
    ,updateAdminRoles: "/updateAdminRoles"
    ,queryRoleMenus: "/queryRoleMenus"
    ,updateRoleMenus: "/updateRoleMenus"
    ,queryRolePermissions: "/queryRolePermissions"
    ,updateRolePermissions: "/updateRolePermissions"
};

// post方法(封装jQuery)
function myPost(url, jsonObj, success) {
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(jsonObj),
        contentType: "application/json;charset=UTF-8",
        xhrFields: {withCredentials: true},
        success: function (result) {
            success(result);
        },
    });
}
