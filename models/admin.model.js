const db = require('../utils/db');
module.exports = {
    Requests_Register_account: () => {
        return db.load(`select * from account where isLive = 0`);
    },
    Requests_Register_device: () => {
        return db.load(`select * from device d JOIN product p on d.id_product = p.id_product JOIN category c on p.id_category = c.id_category JOIN shelf s on c.id_shelf = s.id_shelf where d.isLive = 0 and d.status = 0`);
    },
    Requests_Order_device: () => {
        return db.load(`select a.full_name,d.name_device,d.rfid,r.date_rent,r.id_device,r.id_account
        from report r 
        join account a on r.id_account = a.id_account
        join device d on d.id_device = r.id_device
        where r.id_report_status = 3 and r.isApprove = 0 and d.isLive=2`);
    },
    delAccount: function (id_account,entity){
        const condition = {
            id_account: id_account
        }
        return db.patch('account',entity,condition);
    },
}