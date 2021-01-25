const db = require('../utils/db');
const TBL_PRODUCT = 'product';
const TBL_DEVICE = 'device';

module.exports = {
    loadMenu: function (id, table) {
        if (table == TBL_PRODUCT) {
            return db.load(`select p.name_product,p.id_product from menu m JOIN category c on m.id_menu = c.id_menu join product p on c.id_category = p.id_category WHERE m.id_menu = ${id}`);
        } else if (table == TBL_DEVICE) {
            return db.load(`select * from ${TBL_DEVICE} d where ( d.id_product = ${id} and d.isLive = 1 and d.status = 1) or (d.id_product = ${id} and d.isLive = 1 and d.status = 0) or
            (d.id_product = ${id} and d.isLive = 2 and d.status = 0) or (d.id_product = ${id} and d.isLive = 2 and d.status = 1)
            `);
        }
    }
}  