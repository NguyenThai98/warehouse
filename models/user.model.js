const db = require('../utils/db');
const TBL_USERS = 'account';

module.exports = {
    findUser: async function (username, rfid) {
        const user = await db.load(`select * from ${TBL_USERS} where (user_name = '${username}' and isLive = 1) or (rfid = '${rfid}' and isLive = 1)`);
        return user[0];
    },
    addUser: function (entity) {
        db.add(TBL_USERS, entity);
    },
    allUser: function () {
        return db.load(`select * from ${TBL_USERS}`);
    },
    selectIdUser: async function () {
        const id_account = await db.load(`select * from account  ORDER BY id_account DESC`);
        return id_account[0].id_account;
    },
    findUser_RFID: async function (rfid) {
        const user = await db.load(`select * from ${TBL_USERS} where  rfid = '${rfid}' `);
        return user[0];
    },
    updatePw: function (entity, condition) {
        return db.patch(TBL_USERS, entity, condition);
    },
    updateIsLive: function (entity, condition) {
        return db.patch(TBL_USERS, entity, condition);
    },
    modifyProfile: function (entity, condition) {
        return db.patch(TBL_USERS, entity, condition);
    }
}
