const reportModel = require('../models/report.model');
const excel = require('node-excel-export');
const userModel = require('../models/user.model');
const moment = require('moment');
const deviceModel = require('../models/device.model');
const styles = {
    headerDark: {
        fill: {
            fgColor: {
                rgb: 'FF000000'
            }
        },
        font: {
            color: {
                rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: true
        }
    },
    cellPink: {
        fill: {
            fgColor: {
                rgb: 'FFFFCCFF'
            }
        }
    },
    cellGreen: {
        fill: {
            fgColor: {
                rgb: 'FF00FF00'
            }
        }
    }
};
const reportCtl = {
    getAllReport: async (req, res) => {
        const { role_account } = res.locals.lcAuthUser;
        if (role_account != 1) {
            return res.status(400).json({ msg: "Account Denied" });
        } else {
            const limit = 8;
            let page = req.query.page || 1;
            if (page < 0) {
                page = 1;
            }
            let offset = (page - 1) * limit;
            const row = await reportModel.all(limit, offset);
            const total_page = await reportModel.total_page();

            const nPage = Math.ceil(total_page / limit);
            let pages_item = [];
            for (let i = 1; i <= nPage; i++) {
                const item = {
                    value: i,
                    isActive: i == page
                }
                pages_item.push(item);
            }
            res.render('report/list', {
                list: row,
                pages_item,
                next: +page + 1,
                prev: +page - 1,
                can_go_prev: page <= 1,
                can_go_next: page >= nPage,
            })
        }
    },
    getReportOne: async (req, res) => {
        const { id_account } = res.locals.lcAuthUser;
        const reportUser = await reportModel.findOne(+id_account);
        for (let index = 0; index < reportUser.length; index++) {
            if (reportUser[index].check_status == 'BORROW') {
                reportUser[index].check_status = 'Mượn';
            } else if (reportUser[index].check_status == 'TAKEN') {
                reportUser[index].check_status = 'Lấy';
            } else if (reportUser[index].check_status == 'REGISTER') {
                reportUser[index].check_status = 'Chờ duyệt';

            } else if (reportUser[index].check_status == 'RETURN_ITEM') {
                reportUser[index].check_status = 'Đã trả';

            } else if (reportUser[index].check_status == 'REFUSE') {
                reportUser[index].check_status = 'Bị từ chối';

            } else if (reportUser[index].check_status == 'ACCEPT') {
                reportUser[index].check_status = 'Đã được duyệt';
                reportUser[index].isAccept = true;

            }
        }
        res.render('report/listReportUser', {
            reportUser
        });

    },
    historyBorrow: async (req, res) => {
        const { id_account } = res.locals.lcAuthUser;
        const limit = 10;
        let page = req.query.page || 1;
        if (page < 0) {
            page = 1;
        }
        let offset = (page - 1) * limit;
        let historyAction = [];
        if (res.locals.PHAN_QUYEN_CAP_NHAT_MK) {
            historyBorrow = await reportModel.historyBorrowPageAdmin(limit, offset);
            allPage = await reportModel.allPageBorrowAdmin();
        } else {
            historyBorrow = await reportModel.historyBorrowPage(id_account, limit, offset);
            allPage = await reportModel.allPageBorrow(id_account);
        }
        for (let index = 0; index < historyBorrow.length; index++) {
            if (historyBorrow[index].date_back == null) {
                historyBorrow[index].isBack = false;
            } else {
                historyBorrow[index].isBack = true;
            }
            if (historyBorrow[index].date_back != null) {
                let date = new Date(+historyBorrow[index].date_back);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let time = d + '/' + m + '/' + y;
                historyBorrow[index].date_back = time;
            }
            if (historyBorrow[index].date_rent != null) {
                let date = new Date(+historyBorrow[index].date_rent);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let time = d + '/' + (m+1) + '/' + y;
                historyBorrow[index].date_rent = time;
            }


        }
        const nTrang = Math.ceil(allPage / limit);
        let pages_item = [];
        for (let i = 1; i <= nTrang; i++) {
            const item = {
                value: i,
                isActive: i == page
            }
            pages_item.push(item);
        }
        res.render('report/allHistory', {
            historyBorrow,
            pages_item,
            next: +page + 1,
            prev: +page - 1,
            can_go_prev: page <= 1,
            can_go_next: page >= nTrang,
        })
    }, //n
    historyReturn: async (req, res) => {
        const { id_account } = res.locals.lcAuthUser;
        const limit = 10;
        let page = req.query.page || 1;
        if (page < 0) {
            page = 1;
        }
        let offset = (page - 1) * limit;
        let historyAction = [];
        if (res.locals.PHAN_QUYEN_CAP_NHAT_MK) {
            historyReturn = await reportModel.historyReturnPageAdmin(limit, offset);
            allPage = await reportModel.allPageReturnAdmin();
        } else {
            historyReturn = await reportModel.historyReturnPage(id_account, limit, offset);
            allPage = await reportModel.allPageReturn(id_account);
        }
        for (let index = 0; index < historyReturn.length; index++) {
            if (historyReturn[index].date_back == null) {
                historyReturn[index].isBack = false;
            } else {
                historyReturn[index].isBack = true;
            }
            if (historyReturn[index].date_back != null) {
                let date = new Date(+historyReturn[index].date_back);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let time = d + '/' + (m+1) + '/' + y;
                historyReturn[index].date_back = time;
            }
            if (historyReturn[index].date_rent != null) {
                let date = new Date(+historyReturn[index].date_rent);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let time = d + '/' + (m+1) + '/' + y;
                historyReturn[index].date_rent = time;
            }
        }
        const nTrang = Math.ceil(allPage / limit);
        let pages_item = [];
        for (let i = 1; i <= nTrang; i++) {
            const item = {
                value: i,
                isActive: i == page
            }
            pages_item.push(item);
        }
        res.render('report/HistoryReturn', {
            historyReturn,
            pages_item,
            next: +page + 1,
            prev: +page - 1,
            can_go_prev: page <= 1,
            can_go_next: page >= nTrang,
        })
    }, //n
    historyGet: async (req, res) => {
        const { id_account } = res.locals.lcAuthUser;
        const limit = 10;
        let page = req.query.page || 1;
        if (page < 0) {
            page = 1;
        }
        let offset = (page - 1) * limit;
        let historyGet = [];
        if (res.locals.PHAN_QUYEN_CAP_NHAT_MK) {
            historyGet = await reportModel.historyGetPageAdmin(limit, offset);
            allPage = await reportModel.allPageGetAdmin();
        } else {
            historyGet = await reportModel.historyGetPage(id_account, limit, offset);
            allPage = await reportModel.allPageGet(id_account);
        }
        for (let index = 0; index < historyGet.length; index++) {
            if (historyGet[index].date_back == null) {
                historyGet[index].isBack = false;
            } else {
                historyGet[index].isBack = true;
            }
            if (historyGet[index].date_rent != null) {
                let date = new Date(+historyGet[index].date_rent);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let time = d + '/' + (m+1) + '/' + y;
                historyGet[index].date_rent = time;
            }
        }
        const nTrang = Math.ceil(allPage / limit);
        let pages_item = [];
        for (let i = 1; i <= nTrang; i++) {
            const item = {
                value: i,
                isActive: i == page
            }
            pages_item.push(item);
        }
        res.render('report/HistoryGet', {
            historyGet,
            pages_item,
            next: +page + 1,
            prev: +page - 1,
            can_go_prev: page <= 1,
            can_go_next: page >= nTrang,
        })
    }, //n
    historyOrder: async (req, res) => {
        const { id_account } = res.locals.lcAuthUser;
        const limit = 10;
        let page = req.query.page || 1;
        if (page < 0) {
            page = 1;
        }
        let offset = (page - 1) * limit;
        let historyOrder = [];
        if (res.locals.PHAN_QUYEN_CAP_NHAT_MK) {
            historyOrder = await reportModel.historyOrderPageAdmin(limit, offset);
            allPage = await reportModel.allPageOrderAdmin();
        } else {
            historyOrder = await reportModel.historyOrderPage(id_account, limit, offset);
            allPage = await reportModel.allPageGet(id_account);
        }
        for (let index = 0; index < historyOrder.length; index++) {
            if (historyOrder[index].date_back == null) {
                historyOrder[index].isBack = false;
            } else {
                historyOrder[index].isBack = true;
            }
            if(historyOrder[index].isApprove == 1 && res.locals.PHAN_QUYEN_CAP_NHAT_MK){
                historyOrder[index].PHAN_QUYEN_CAP_NHAT_MK = true;
            }
            if (historyOrder[index].date_rent != null) {
                let date = new Date(+historyOrder[index].date_rent);    
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let time = y + '/' + (m+1) + '/' + d
                historyOrder[index].date_rentTimeStamp = historyOrder[index].date_rent;
                historyOrder[index].date_rent = time;
            }
        }
        const nTrang = Math.ceil(allPage / limit);
        let pages_item = [];
        for (let i = 1; i <= nTrang; i++) {
            const item = {
                value: i,
                isActive: i == page
            }
            pages_item.push(item);
        }

        
        res.render('report/HistoryOrder', {
            historyOrder,
            pages_item,
            next: +page + 1,
            prev: +page - 1,
            can_go_prev: page <= 1,
            can_go_next: page >= nTrang,
        })
    }, //n
    allPage: async function (req, res) {
        const page = await reportModel.allPage();
        res.json(page)
    },
    exportExcel: async function (req, res) {
        const { id_account } = res.locals.lcAuthUser;
        const specification = {
            full_name: { // <- the key should match the actual data key
                displayName: 'Tên Dụng Cụ', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            rfid: {
                displayName: 'Mã RFID',
                headerStyle: styles.headerDark,
                width: '10' // <- width in chars (when the number is passed as string)
            },
            name_report_status: {
                displayName: 'Hanh dong',
                headerStyle: styles.headerDark,
                width: 220 // <- width in pixels
            },
            name_device: {
                displayName: 'Tên Dụng Cụ',
                headerStyle: styles.headerDark,
                
                width: 220 // <- width in pixels
            },
            name_shelf: { // <- the key should match the actual data key
                displayName: 'Tủ', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            date_rent: { // <- the key should match the actual data key
                displayName: 'Ngày', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
        }
        if (res.locals.PHAN_QUYEN_CAP_NHAT_MK) {
        var dataset = await reportModel.exportExcel();
        }
        // for (let index = 0; index < dataset.length; index++) {
        //     if(dataset[index].date_rent!=null){
        //     let date = new Date(+dataset[index].date_rent);
        //         let y = date.getFullYear();
        //         let m = date.getMonth();
        //         let d = date.getDate();
        //         let hh = date.getHours();
        //         let pp = date.getMinutes();
        //         let time = d + '/' + (m+1) + '/' + y + "  " + hh + ":" + pp;
        //         dataset[index].date_rent = time;
        //     }
        // }
        const report = excel.buildExport(
            [
                {
                    name: 'Report',

                    specification: specification,
                    data: dataset
                }
            ]
        );
        res.attachment('Report.xlsx');
        res.send(report);
    },
    exportBorrow: async function (req, res) {
        const { id_account } = res.locals.lcAuthUser;
        const specification = {
            full_name: { // <- the key should match the actual data key
                displayName: 'Họ và tên', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            rfid: {
                displayName: 'Mã RFID',
                headerStyle: styles.headerDark,
                width: '10' // <- width in chars (when the number is passed as string)
            },
            name_report_status: {
                displayName: 'Hanh dong',
                headerStyle: styles.headerDark,
                
                width: 220 // <- width in pixels
            },
            name_device: {
                displayName: 'Tên Dụng Cụ',
                headerStyle: styles.headerDark,
                
                width: 220 // <- width in pixels
            },
            name_shelf: { // <- the key should match the actual data key
                displayName: 'Tủ', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            date_rent: { // <- the key should match the actual data key
                displayName: 'Ngày', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
        }
        if (res.locals.PHAN_QUYEN_CAP_NHAT_MK) {
        var dataset = await reportModel.exportBorrow();
        }
        else{
            var dataset = await reportModel.exportBorrowUser(id_account);
        }
        for (let index = 0; index < dataset.length; index++) {
            if(dataset[index].date_rent!=null){
            let date = new Date(+dataset[index].date_rent);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let hh = date.getHours();
                let pp = date.getMinutes();
                let time = d + '/' + (m+1) + '/' + y + "  " + hh + ":" + pp;
                dataset[index].date_rent = time;
            }
        }
        const report = excel.buildExport(
            [
                {
                    name: 'ReportBorrow',

                    specification: specification,
                    data: dataset
                }
            ]
        );
        res.attachment('reportBorrow.xlsx');
        res.send(report);
    },
    exportBack: async function (req, res) {
        const { id_account } = res.locals.lcAuthUser;
        const specification = {
            full_name: { // <- the key should match the actual data key
                displayName: 'Họ và tên', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            rfid: {
                displayName: 'Mã RFID',
                headerStyle: styles.headerDark,
                width: '10' // <- width in chars (when the number is passed as string)
            },
            name_report_status: {
                displayName: 'Hanh dong',
                headerStyle: styles.headerDark,
                
                width: 220 // <- width in pixels
            },
            name_device: {
                displayName: 'Tên Dụng Cụ',
                headerStyle: styles.headerDark,
                
                width: 220 // <- width in pixels
            },
            name_shelf: { // <- the key should match the actual data key
                displayName: 'Tủ', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            date_back: { // <- the key should match the actual data key
                displayName: 'Ngày', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
        }
        if (res.locals.PHAN_QUYEN_CAP_NHAT_MK) {
        var dataset = await reportModel.exportBack();
        }
        else{
            var dataset = await reportModel.exportBackUser(id_account);
        }
        for (let index = 0; index < dataset.length; index++) {
            if(dataset[index].date_back!=null){
            let date = new Date(+dataset[index].date_back);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let hh = date.getHours();
                let pp = date.getMinutes();
                let time = d + '/' + (m+1) + '/' + y + "  " + hh + ":" + pp;
                dataset[index].date_back = time;
            }
        }
        const report = excel.buildExport(
            [
                {
                    name: 'exportReturn',

                    specification: specification,
                    data: dataset
                }
            ]
        );
        res.attachment('exportReturn.xlsx');
        res.send(report);
    },
    exportGet: async function (req, res) {
        const { id_account } = res.locals.lcAuthUser;
        const specification = {
            full_name: { // <- the key should match the actual data key
                displayName: 'Họ và tên', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            rfid: {
                displayName: 'Mã RFID',
                headerStyle: styles.headerDark,
                width: '10' // <- width in chars (when the number is passed as string)
            },
            name_report_status: {
                displayName: 'Hanh dong',
                headerStyle: styles.headerDark,
                
                width: 220 // <- width in pixels
            },
            name_device: {
                displayName: 'Tên Dụng Cụ',
                headerStyle: styles.headerDark,
                
                width: 220 // <- width in pixels
            },
            name_shelf: { // <- the key should match the actual data key
                displayName: 'Tủ', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            date_rent: { // <- the key should match the actual data key
                displayName: 'Ngày', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
        }
        if (res.locals.PHAN_QUYEN_CAP_NHAT_MK) {
        var dataset = await reportModel.exportGet();
        }
        else{
            var dataset = await reportModel.exportGetUser(id_account);
        }
        for (let index = 0; index < dataset.length; index++) {
            if(dataset[index].date_rent!=null){
            let date = new Date(+dataset[index].date_rent);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let hh = date.getHours();
                let pp = date.getMinutes();
                let time = d + '/' + (m+1) + '/' + y + "  " + hh + ":" + pp;
                dataset[index].date_rent = time;
            }
        }
        const report = excel.buildExport(
            [
                {
                    name: 'ReportGet',

                    specification: specification,
                    data: dataset
                }
            ]
        );
        res.attachment('ReportGet.xlsx');
        res.send(report);
    },
    deviceRemaining:async function(req,res){
        const { id_account } = res.locals.lcAuthUser;
        const specification = {
            name_device: { // <- the key should match the actual data key
                displayName: 'Tên Dụng Cụ', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            rfid: {
                displayName: 'Mã RFID',
                headerStyle: styles.headerDark,
                width: '10' // <- width in chars (when the number is passed as string)
            },
            name_shelf: {
                displayName: 'Ngăn Tủ',
                headerStyle: styles.headerDark,
                width: 220 // <- width in pixels
            },
            name_warehoue: {
                displayName: 'Tên Tủ',
                headerStyle: styles.headerDark,
                width: 220 // <- width in pixels
            }
        }    
        var dataset = await reportModel.deviceRemaining();
        const report = excel.buildExport(
            [
                {
                    name: 'exportRemain',
                    specification: specification,
                    data: dataset
                }
            ]
        );
        res.attachment('exportRemain.xlsx');
        res.send(report);
    },
    unlockReport: async(req,res)=>{
        let unlockByRfid = [];
        unlockByRfidArray =await deviceModel.unlockforReport();
        for (let index = 0; index < unlockByRfidArray.length; index++) {
            const element = unlockByRfidArray[index];
            unlockByRfid.push(element.rfid);
        }
        res.json(unlockByRfid);
    }
}
module.exports = reportCtl;