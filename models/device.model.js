const db = require('../utils/db');
const TBL_DEVICE = 'device';

module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_DEVICE}`);
    },
    findDevice: async function (id) {
        const device = await db.load(`select * from device d JOIN product p on d.id_product = p.id_product JOIN category c on p.id_category = c.id_category join shelf s on c.id_shelf = s.id_shelf
        where (id_device = ${id} and isLive = 1) or (id_device = ${id} and isLive = 2)`);
        return device[0];
    },
    findDeviceRFID: async function (rfid) {
        const device = await db.load(`select * from ${TBL_DEVICE} where rfid = '${rfid}'`);
        return device[0];
    },
    findDeviceBR: async function (id) {
        const deviceBR = await db.load(`select * from device d JOIN report r on d.id_device = r.id_device join account a on r.id_account = a.id_account WHERE d.id_device = ${id} and r.id_report_status = 1 and d.isLive = 1 ORDER BY id_report DESC`);
        return deviceBR[0];
    }, // n
    selectSlot: async function (id) {
        const shelf = await db.load(`SELECT DISTINCT s.id_shelf, s.total_slot,s.total_slotEmpty FROM device d join product p on d.id_product = p.id_product join category c on p.id_category = p.id_category join shelf s on c.id_shelf = s.id_shelf WHERE d.id_device = ${id}`);
        return shelf[0];
    },
    updateStatus: function (entity, condition) {
        return db.patch(TBL_DEVICE, entity, condition);
    },
    modifyDevice:(entity,condition)=>{
        return db.patch(TBL_DEVICE, entity, condition);
    },
    selectUserTakenTool: function (id_device) {
        return db.load(`select a.full_name,r.date_rent,r.date_back from report r JOIN account a on r.id_account = a.id_account WHERE r.id_device = ${id_device} and check_status = 'TAKEN' `);
    },
    getDevice: async function (rfid) {
        const device = await db.load(`select * from report r JOIN account a on r.id_account = a.id_account join device d on d.id_device = r.id_device WHERE d.rfid = '${rfid}' GROUP BY r.id_report DESC LIMIT 1`);
        return device[0];
    },
    historyTakenTool: async function (name_device) {
        const device = await db.load(`select * from report r JOIN account a on r.id_account = a.id_account join device d on d.id_device = r.id_device WHERE d.name_device = '${name_device}' and r.check_status = 'TAKEN' GROUP BY r.id_report DESC limit 5`);
        return device;
    },
    getNameProduct: async function () {
        return await db.load(`select p.name_product,p.id_product from product p`);
    },
    getProduct: async function (id_product) {
        return await db.load(`select * from product p JOIN device d on p.id_product = d.id_product WHERE d.id_product = ${id_product}`);
    },
    addDevice: function (entity) {
        db.add(TBL_DEVICE, entity);
    },
    backDevice: async function (id_account, limit, offset) {
        const backdevice = await db.load(`SELECT d.id_device, d.name_device, d.rfid, s.name_shelf FROM device d
        JOIN product p on d.id_product = p.id_product
        JOIN category c ON p.id_category = c.id_category
        JOIN shelf s ON c.id_shelf = s.id_shelf
        WHERE d.status=1
        limit ${limit} offset ${offset}`)
        return backdevice;
    },
    allPageBack: async function (id_account) {
        const allPage = await db.load(`SELECT COUNT(*) as totalPage
        FROM device d
        JOIN product p on d.id_product = p.id_product
        JOIN category c ON p.id_category = c.id_category
        JOIN shelf s ON c.id_shelf = s.id_shelf
        WHERE d.id_auth_account = ${id_account} and d.status=1`);
        return allPage[0].totalPage;
    },
    historyGet: async function (limit, rfid) {
        const historyGetDevice = db.load(`
        select r.date_rent,r.date_back, a.full_name,a.rfid,rs.name_report_status,d.name_device, s.name_shelf
        from report r 
        JOIN account a on r.id_account = a.id_account 
        JOIN report_status rs on r.id_report_status = rs.id_report_status
        JOIN device d on r.id_device = d.id_device
        join product p 
		on d.id_product = p.id_product
		join category c
		on p.id_category=c.id_category
		join shelf s
        on c.id_shelf = s.id_shelf
        where rs.id_report_status = 4 and d.rfid = "${rfid}"
        order by r.id_report desc limit ${limit}
        `)
        return historyGetDevice;
    },
    unlockforReport: () => {
        const selectAllByRfid = db.load(`SELECT rfid from ${TBL_DEVICE} `)
        return selectAllByRfid;
    },
    listDeviceOrdered: () => {
        return db.load(`select d.id_device from ${TBL_DEVICE} d where d.isLive = 2 and d.status = 0`);
    },
    selectShefl: (id_shelf) => {
        return db.load(`select * from shelf where id_shelf = ${id_shelf}`);
    },
    updateShefl: function (entity, condition) {
        return db.patch('shelf', entity, condition);
    },
    getPosition: function(id_shelf){
        return db.load(`SELECT d.id_device,d.pos_x,d.pos_y FROM device d join product p on d.id_product = p.id_product join category c on p.id_category = c.id_category join shelf s on c.id_shelf = s.id_shelf WHERE (s.id_shelf = ${id_shelf} and d.isLive = 1 and d.status = 1) or (s.id_shelf = ${id_shelf} and d.isLive = 1 and d.status = 0) or (s.id_shelf = ${id_shelf} and d.isLive = 2 and d.status = 0) or (s.id_shelf = ${id_shelf} and d.isLive = 2 and d.status = 1);`);
    },
    selectidDeviceAccept: ()=>{
        return db.load(`select d.id_device from ${TBL_DEVICE} d where d.isLive = -1 and d.status = 2`);
    },
    inventory: (limit, offset)=>{
        return db.load(`SELECT p.name_product, COUNT(d.id_product) AS "So_luong"
        FROM device d
        RIGHT JOIN product p on d.id_product = p.id_product where d.isLive = 1 and d.status = 0
        GROUP BY p.name_product limit ${limit} offset ${offset}`)
    }
}