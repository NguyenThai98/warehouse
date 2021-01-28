const db = require('../utils/db');
module.exports = {
    Requests_Register_account: () => {
        return db.load(`select * from account where isLive = 0`);
    },
    Requests_Register_device: () => {
        return db.load(`select * from device where isLive = 0 and status = 0`);
    },
    Requests_Order_device: () => {
        return db.load(`select a.full_name,d.name_device,d.rfid,r.date_rent,r.id_device,r.id_account
        from report r 
        join account a on r.id_account = a.id_account
        join device d on d.id_device = r.id_device
        where r.id_report_status = 3 and r.isApprove = 0 and d.isLive=2`);
    },
    delAccountRole: function (id_account_role){
        const entity = {
            id_account_role: id_account_role
        }
        return db.del('account_role',entity);
    },
    delAccount: async function (id_account){
        const entity = {
            id_account: id_account
        }
        return db.del('account',entity);
    },
    selectAllAccounts: function (id_account){
        return db.load(`select * from account_role WHERE id_account = ${id_account} `);
    }
}