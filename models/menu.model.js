const db = require('../utils/db');
const TBL_PRODUCT = 'product';
const TBL_DEVICE = 'device';

module.exports = {
    loadMenu: function (id_menu, name_product, table) {
        if (table == TBL_PRODUCT) {
            return db.load(`select DISTINCT p.name_product from menu m JOIN category c on m.id_menu = c.id_menu join product p on c.id_category = p.id_category WHERE m.id_menu = ${id_menu}`);
        } else if (table == TBL_DEVICE) {
            return db.load(`SELECT * FROM device d WHERE 
            (d.id_product in (SELECT id_product from product p WHERE p.name_product LIKE '%${id_menu}%') and d.isLive = 1 and d.status = 1) or (d.id_product in (SELECT id_product from product p WHERE p.name_product LIKE '%${id_menu}%') and d.isLive = 1 and d.status = 0) or
            (d.id_product in (SELECT id_product from product p WHERE p.name_product LIKE '%${id_menu}%') and d.isLive = 2 and d.status = 0) or (d.id_product in (SELECT id_product from product p WHERE p.name_product LIKE '%${id_menu}%') and d.isLive = 2 and d.status = 1)`);
        }
    }
}