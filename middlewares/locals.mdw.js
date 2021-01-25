const LRU = require("lru-cache");
const deviceModel = require("../models/device.model");
const categoryModel = require("../models/category.model");
const accountRoleModle = require('../models/account_role.model');
const cache = new LRU({
    max: 1000,
    maxAge: 100 * 500,
})
module.exports = function (app,io) {
    app.use(async function (req, res, next) {
        const data = cache.get('selectMenus');
        if (!data) {
            const selectMenus = await categoryModel.selectMenu();
            res.locals.selectMenus = selectMenus;
            cache.set('selectMenus', selectMenus);
        } else {
            res.locals.selectMenus = data;
        }
        next();
    })
    app.use(async function (req, res, next) {
        if (req.session.isAuthenticated === null) {
            req.session.isAuthenticated = false;
        }
        res.locals.lcIsAuthenticated = req.session.isAuthenticated;
        res.locals.lcAuthUser = req.session.authUser;
        if(res.locals.lcAuthUser){
            if(res.locals.lcAuthUser.avatar == null){
                res.locals.check_avatar = true;
            }
        }
        if (res.locals.lcAuthUser) {
            const role_accounts = await accountRoleModle.selectRoleUser(res.locals.lcAuthUser.id_account);
            for (let index = 0; index < role_accounts.length; index++) {
                if (role_accounts[index].name_role == 'PHAN_QUYEN_CAP_NHAT_MK' && role_accounts[index].status_account == 1) {
                    res.locals.PHAN_QUYEN_CAP_NHAT_MK = true;
                }
                if (role_accounts[index].name_role == 'DUYET_DUNG_CU' && role_accounts[index].status_account == 1) {
                    res.locals.DUYET_DUNG_CU = true;
                    check_DUYET_DUNG_CU = true;
                }
                if (role_accounts[index].name_role == 'THEM_DUNG_CU' && role_accounts[index].status_account == 1) {
                    res.locals.THEM_DUNG_CU = true;
                }
                if (role_accounts[index].name_role == 'MUON_TRA' && role_accounts[index].status_account == 1) {
                    res.locals.MUON_TRA = true;
                }
                if (role_accounts[index].name_role == 'LAY_DUNG_CU' && role_accounts[index].status_account == 1) {
                    res.locals.LAY_DUNG_CU = true;
                }
                if (role_accounts[index].name_role == 'DANG_KY_TU_XA' && role_accounts[index].status_account == 1) {
                    res.locals.DANG_KY_TU_XA = true;
                }
                if (role_accounts[index].name_role == 'XUAT_FILE_KIEM_KE' && role_accounts[index].status_account == 1) {
                    res.locals.XUAT_FILE_KIEM_KE = true;
                }
                if (role_accounts[index].name_role == 'TAO_TAI_KHOAN' && role_accounts[index].status_account == 1) {
                    res.locals.TAO_TAI_KHOAN = true;
                }
                if (role_accounts[index].name_role == 'CAP_NHAT_CL_DUNG_CU' && role_accounts[index].status_account == 1) {
                    res.locals.CAP_NHAT_CL_DUNG_CU = true;
                }
            } 

        } else {
            res.locals.isCustomer = true;
        }
        next();
    })
    app.use(async function (req, res, next) {
        const data = cache.get('getNameProducts');
        if (!data) {
            const getNameProducts = await deviceModel.getNameProduct();
            res.locals.getNameProducts = getNameProducts;
            cache.set('getNameProducts', getNameProducts);
        } else {
            res.locals.getNameProducts = data;

        }

        next();
    })
}