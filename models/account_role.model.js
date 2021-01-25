const db = require('../utils/db');
const TBL_ACCOUNT_ROLE = 'account_role';

module.exports = {
    insert_account_role: function (entity) {
        db.add(TBL_ACCOUNT_ROLE, entity);
    },
    selectRoleUser: function (id_account) {
        return db.load(`select r.id_role,r.name_role,ar.status_account from account_role ar join role r on ar.id_role = r.id_role WHERE ar.id_account = ${id_account} and status_account = 1 ORDER BY r.id_role `)
    },
    updateStatusRole: function (entity, condition, condition2) {
        return db.patchTwoCondition(TBL_ACCOUNT_ROLE, entity, condition, condition2);
    },
    listUserAuthBorrow: function () {
        return db.load(`select id_account FROM account_role WHERE id_role = 3 and status_account = 1`);
    }
}