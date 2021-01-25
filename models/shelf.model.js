const db = require('../utils/db');
const TBL_SHELF = 'shelf';

module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_SHELF}`);
    },
    updateShelf: function (entity, condition) {
        return db.patch(TBL_SHELF, entity, condition);
    },
}