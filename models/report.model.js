const db = require('../utils/db');
const TBL_REPORT = 'report';
const TBL_DEVICE = 'device';

module.exports = {
    all: function (limit, offset) {
        return db.load(`select * from ${TBL_REPORT} LIMIT ${limit} OFFSET ${offset}`);
    },
    findOne: async function (id) {
        const report = await db.load(`select * from ${TBL_REPORT} r JOIN ${TBL_DEVICE} d on r.id_device = d.id_device where r.id_account = ${id} ORDER BY id_report DESC LIMIT 10`);
        return report;
    },
    total_page: async function () {
        const total_page = await db.load(`select COUNT(*) AS total_page from ${TBL_REPORT}`);
        return total_page;
    },
    insertReport: function (entity) {
        return db.add(TBL_REPORT, entity);
    },
    updateReport: function (entity, condition) {
        return db.patch(TBL_REPORT, entity, condition);
    },
    findReport: async function (date_rent, date_back, id_report) {
        const report = await db.load(`select * from ${TBL_REPORT} where date_rent = '${date_rent}' and id_report = ${id_report} and date_back = '${date_back}' `);
        return report;
    },
    allPageBorrow: async function (id_account) {
        const allpage = await db.load(
            `SELECT COUNT(*) as totalPage FROM
            (select d.name_device from report r 
            JOIN account a on r.id_account = a.id_account 
            JOIN report_status rs on r.id_report_status = rs.id_report_status
            JOIN device d on r.id_device = d.id_device
            join product p 
            on d.id_product = p.id_product
            join category c
            on p.id_category=c.id_category
            join shelf s
            on c.id_shelf = s.id_shelf
            where a.id_account = ${id_account} and rs.id_report_status = 1 
            order by r.id_report limit 100) as t`);
        return allpage[0].totalPage;
    },
    allPageReturn: async function (id_account) {
        const allpage = await db.load(
            `SELECT COUNT(*) as totalPage FROM
            (select d.name_device from report r 
            JOIN account a on r.id_account = a.id_account 
            JOIN report_status rs on r.id_report_status = rs.id_report_status
            JOIN device d on r.id_device = d.id_device
            join product p 
            on d.id_product = p.id_product
            join category c
            on p.id_category=c.id_category
            join shelf s
            on c.id_shelf = s.id_shelf
            where a.id_account = ${id_account} and rs.id_report_status = 2 
            order by r.id_report limit 100) as t`);
        return allpage[0].totalPage;
    },
    allPageGet: async function (id_account) {
        const allpage = await db.load(
            `SELECT COUNT(*) as totalPage FROM
            (select d.name_device from report r 
            JOIN account a on r.id_account = a.id_account 
            JOIN report_status rs on r.id_report_status = rs.id_report_status
            JOIN device d on r.id_device = d.id_device
            join product p 
            on d.id_product = p.id_product
            join category c
            on p.id_category=c.id_category
            join shelf s
            on c.id_shelf = s.id_shelf
            where a.id_account = ${id_account} and rs.id_report_status = 4 
            order by r.id_report limit 100) as t`);
        return allpage[0].totalPage;
    },
    allPageOrder: async function (id_account) {
        const allpage = await db.load(
            `SELECT COUNT(*) as totalPage FROM
            (select d.name_device from report r 
            JOIN account a on r.id_account = a.id_account 
            JOIN report_status rs on r.id_report_status = rs.id_report_status
            JOIN device d on r.id_device = d.id_device
            join product p 
            on d.id_product = p.id_product
            join category c
            on p.id_category=c.id_category
            join shelf s
            on c.id_shelf = s.id_shelf
            where a.id_account = ${id_account} and rs.id_report_status = 3 
            order by r.id_report limit 100) as t`);
        return allpage[0].totalPage;
    },
    allPageBorrowAdmin: async function () {
        const allpage = await db.load(
            `SELECT COUNT(*) as totalPage FROM
            (select d.name_device from report r 
            JOIN account a on r.id_account = a.id_account 
            JOIN report_status rs on r.id_report_status = rs.id_report_status
            JOIN device d on r.id_device = d.id_device
            join product p 
            on d.id_product = p.id_product
            join category c
            on p.id_category=c.id_category
            join shelf s
            on c.id_shelf = s.id_shelf
            where rs.id_report_status = 1 
            order by r.id_report limit 100) as t`);
        return allpage[0].totalPage;
    },
    allPageReturnAdmin: async function () {
        const allpage = await db.load(
            `SELECT COUNT(*) as totalPage FROM
        (select d.name_device from report r 
        JOIN account a on r.id_account = a.id_account 
        JOIN report_status rs on r.id_report_status = rs.id_report_status
        JOIN device d on r.id_device = d.id_device
        join product p 
        on d.id_product = p.id_product
        join category c
        on p.id_category=c.id_category
        join shelf s
        on c.id_shelf = s.id_shelf
        where rs.id_report_status = 2 
        order by r.id_report limit 100) as t`);
        return allpage[0].totalPage;
    },
    allPageGetAdmin: async function () {
        const allpage = await db.load(
            `SELECT COUNT(*) as totalPage FROM
            (select d.name_device from report r 
            JOIN account a on r.id_account = a.id_account 
            JOIN report_status rs on r.id_report_status = rs.id_report_status
            JOIN device d on r.id_device = d.id_device
            join product p 
            on d.id_product = p.id_product
            join category c
            on p.id_category=c.id_category
            join shelf s
            on c.id_shelf = s.id_shelf
            where rs.id_report_status = 4 
            order by r.id_report limit 100) as t`);
        return allpage[0].totalPage;
    },
    allPageOrderAdmin: async function () {
        const allpage = await db.load(
            `SELECT COUNT(*) as totalPage FROM
            (select d.name_device from report r 
            JOIN account a on r.id_account = a.id_account 
            JOIN report_status rs on r.id_report_status = rs.id_report_status
            JOIN device d on r.id_device = d.id_device
            join product p 
            on d.id_product = p.id_product
            join category c
            on p.id_category=c.id_category
            join shelf s
            on c.id_shelf = s.id_shelf
            where rs.id_report_status = 3 
            order by r.id_report limit 100) as t`);
        return allpage[0].totalPage;
    },
    historyBorrowPage: async function (id_account, limit, offset) {
        const historyAction = await db.load(`select r.date_rent,r.date_back, a.full_name,a.rfid,rs.name_report_status,d.name_device, s.name_shelf
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
        WHERE a.id_account = ${id_account} and rs.id_report_status = 1
        order by r.id_report desc limit ${limit} offset ${offset}`);
        return historyAction;
    },
    historyReturnPage: async function (id_account, limit, offset) {
        const historyAction = await db.load(`select r.date_rent,r.date_back, a.full_name,a.rfid,rs.name_report_status,d.name_device, s.name_shelf
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
        WHERE a.id_account = ${id_account} and rs.id_report_status = 2
        order by r.id_report desc limit ${limit} offset ${offset}`);
        return historyAction;
    },
    historyGetPage: async function (id_account, limit, offset) {
        const historyAction = await db.load(`select r.date_rent,r.date_back, a.full_name,a.rfid,rs.name_report_status,d.name_device, s.name_shelf
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
        WHERE a.id_account = ${id_account} and rs.id_report_status = 4
        order by r.id_report desc limit ${limit} offset ${offset}`);
        return historyAction;
    },
    historyOrderPage: async function (id_account, limit, offset) {
        const historyOrder = await db.load(`select r.date_rent,r.date_back, d.rfid as rfidDevice,
        a.full_name,a.rfid,rs.name_report_status,
        d.name_device, s.name_shelf, r.isApprove
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
        WHERE a.id_account = ${id_account} and rs.id_report_status = 3
        order by r.id_report desc limit ${limit} offset ${offset}`);
        return historyOrder;
    },
    historyBorrowPageAdmin: async function (limit, offset) {
        const historyAction = await db.load(`select r.date_rent,r.date_back, a.full_name,a.rfid,rs.name_report_status,d.name_device, s.name_shelf
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
        where rs.id_report_status = 1
        order by r.id_report desc limit ${limit} offset ${offset}`);
        return historyAction;
    },
    historyReturnPageAdmin: async function (limit, offset) {
        const historyAction = await db.load(`select r.date_rent,r.date_back, a.full_name,a.rfid,rs.name_report_status,d.name_device, s.name_shelf
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
        where rs.id_report_status = 2
        order by r.id_report desc limit ${limit} offset ${offset}`);
        return historyAction;
    },
    historyGetPageAdmin: async function (limit, offset) {
        const historyAction = await db.load(`select r.date_rent,r.date_back, a.full_name,a.rfid,rs.name_report_status,d.name_device, s.name_shelf
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
        where rs.id_report_status = 4
        order by r.id_report desc limit ${limit} offset ${offset}`);
        return historyAction;
    },
    historyOrderPageAdmin: async function (limit, offset) {
        const historyAction = await db.load(`select r.date_rent,r.date_back,  d.rfid as rfidDevice,
        a.full_name,a.rfid,rs.name_report_status,d.name_device, 
        s.name_shelf, r.isApprove
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
        where rs.id_report_status = 3
        order by r.id_report desc limit ${limit} offset ${offset}`);
        return historyAction;
    },
    exportBorrow: async function () {
        const exportborrow = await db.load(`select d.name_device,s.name_shelf,rs.name_report_status,r.date_rent,a.full_name,a.rfid
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
		where rs.id_report_status = 1
        order by r.id_report desc`);
        return exportborrow;
    },
    exportBorrowUser: async function (id_account) {
        const exportborrow = await db.load(`select d.name_device,s.name_shelf,rs.name_report_status,r.date_rent,a.full_name,a.rfid
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
		where rs.id_report_status = 1 and a.id_account =${id_account}
        order by r.id_report desc`);
        return exportborrow;
    },
    exportBack: async function () {
        const exportback = await db.load(`select d.name_device,s.name_shelf,rs.name_report_status,r.date_back,a.full_name,a.rfid
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
		where rs.id_report_status = 2
        order by r.id_report desc`);
        return exportback;
    }, exportBackUser: async function (id_account) {
        const exportback = await db.load(`select d.name_device,s.name_shelf,rs.name_report_status,r.date_back,a.full_name,a.rfid
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
		where rs.id_report_status = 2 and a.id_account =${id_account}
        order by r.id_report desc`);
        return exportback;
    },
    exportGet: async function () {
        const exportget = await db.load(`select d.name_device,s.name_shelf,rs.name_report_status,r.date_rent,a.full_name,a.rfid
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
		where rs.id_report_status = 4
        order by r.id_report desc`);
        return exportget;
    },
    exportGetUser: async function (id_account) {
        const exportget = await db.load(`select d.name_device,s.name_shelf,rs.name_report_status,r.date_rent,a.full_name,a.rfid
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
		where rs.id_report_status = 4 and a.id_account =${id_account}
        order by r.id_report desc`);
        return exportget;
    },


    deviceRemaining: async () => {
        const deviceremaining = await db.load(`select d.name_device, d.rfid, s.name_shelf, w.name_warehoue
        from device d 
        join product p 
        on d.id_product = p.id_product
        join category c
        on p.id_category=c.id_category
        join shelf s
        on c.id_shelf = s.id_shelf
        join warehouse w 
        on s.id_wh = w.id_wh
        where d.status = 0 and isLive = 1`)
        return deviceremaining;
    },
    pageRemaining: async function () {
        const allpage = await db.load(
            `SELECT COUNT(*) as totalPage
        from device d 
        join product p 
		on d.id_product = p.id_product
		join category c
		on p.id_category=c.id_category
		join shelf s
		on c.id_shelf = s.id_shelf
		where d.status = 0`);
        return allpage[0].totalPage;
    },
    exportExcel: async function () {
        const exportreport = await db.load(`SELECT d.name_device,d.rfid, d.status, d.isLive from device d`);
        return exportreport;
    },
    updateReportOrder: (id_device, id_account) => {
        return db.load(`UPDATE report r SET r.isApprove = 1 WHERE r.id_device =${id_device} AND r.id_account=${id_account}`);
    },
    updateRejectReport: (id_device, id_account) => {
        return db.load(`UPDATE report r SET r.isApprove = 2 WHERE r.id_device =${id_device} AND r.id_account=${id_account}`);
    },
    updateAutoRejectReport: (id_device) => {
        return db.load(`UPDATE report r SET r.isApprove = 2 WHERE r.id_device =${id_device} AND r.isApprove = 0`);
    },
    getReportOrder: (id_account, id_device) => {
        return db.load(`SELECT r.id_report, r.date_rent, d.name_device, d.pos_x,d.pos_y, d.image, r.isApprove
        FROM report r 
        JOIN device d ON r.id_device = d.id_device where r.id_account =${id_account} and r.id_device=${id_device} and r.isApprove =0`);
    },
    checkReportOrder: (id_account, id_device) => {
        return db.load(`SELECT * FROM ${TBL_REPORT} r WHERE (r.id_account = ${id_account} and r.id_device=${id_device} and r.isApprove = 1 AND r.id_report_status = 3)
        or (r.id_device=${id_device} and r.isApprove = 0 AND r.id_report_status = 3)
        `)
    },
    updateReportGetOrder: (id_device, id_account) => {
        return db.load(`UPDATE report r SET r.id_report_status = 4, r.id_account = ${id_account}
         WHERE (r.id_device =${id_device} AND r.isApprove = 1 And r.id_account = ${id_account})
         or (r.id_device =${id_device} AND r.isApprove = 0)`)
    },
    allPageInventory: async function () {
        try {
            const allpage = await db.load(
                `SELECT COUNT(*) as totalPage
                from (SELECT p.name_product, COUNT(d.id_product) AS "So_luong"
                 FROM device d
                 RIGHT JOIN product p on d.id_product = p.id_product
                 GROUP BY p.name_product) as total 
                WHERE total.name_product = total.name_product`);
            return allpage[0].totalPage;
        } catch (error) {
            console.log(error);
        }

    },

}