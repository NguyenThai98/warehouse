const db = require('../utils/db');
const TBL_CATEGORY = 'category';
module.exports = {
    selectMenu: function () {
        return db.load(`select * from menu`);
    },
    selectShefl: function () {
        return db.load(`select * from shelf`);
    },
    selectCategory: function (id_shelf) {
        return db.load(`select * from ${TBL_CATEGORY} where id_shelf = ${id_shelf}`);
    },
    selectProduct: function (id_category) {
        return db.load(`select * from product where id_category = ${id_category}`);
    },
    selectDevice: function (id_product) {
        return db.load(`select * from device where id_product = ${id_product}`);
    },
    getDevice: function (id_device) {
        return db.load(`select * from device where id_device = ${id_device}`);
    }
}