const deviceModel = require('../models/device.model');
const shelfModel = require('../models/shelf.model');
const reportModel = require('../models/report.model');
const fs = require('fs');
const userModel = require('../models/user.model');
const accountRoleModle = require('../models/account_role.model');
const { log } = require('console');
const deviceCtl = {
    getAllDevice: async (req, res) => {
        const allDevices = await deviceModel.all();
        const { role_account } = res.locals.lcAuthUser;
        let newDevices = [];
        for (let index = 0; index < allDevices.length; index++) {
            const item = {
                device: allDevices[index],
                isPremium: allDevices[index].role == 0 ? false : true,
            }
            newDevices.push(item);
        }
        if (role_account) {
            res.json({ newDevices })
            // res.render('device/listDevice', { newDevices });
        }
    },
    getDevice: async (req, res) => {
        const { id } = req.body;
        const {id_account} = res.locals.lcAuthUser;
        const getReportOrder = await reportModel.getReportOrder(id_account, id);
        const getDevice = await deviceModel.findDevice(id);
        
        if ((getDevice.status == 0 && getDevice.isLive == 1)||(getDevice.status == 0 && getDevice.isLive == 2)) {
            if(getReportOrder.length>0){
                return res.json(getReportOrder[0])
            }
            else{
                return res.json(getDevice);
            }
        } else if (getDevice.status == 1  && getDevice.isLive == 1) {
            const getDeviceBr = await deviceModel.findDeviceBR(getDevice.id_device);
            getDeviceBr.id_shelf = getDevice.id_shelf;
            getDeviceBr.name_shelf = getDevice.name_shelf;
            return res.json(getDeviceBr);
        } else {
            return res.status(400).json({ msgErr: "Dụng cụ không tồn tại." })
        }

    },
 
    editDevice: async (req, res) => {
        const { id } = req.params;
        const device = await deviceModel.findDevice(id);
        res.render('device/editDevice', { device });
    },
    getBorrow: async (req, res) => {
        try {
            //let listUserAuthBorrow = await accountRoleModle.listUserAuthBorrow();
            const { rfid, note_report, date_rent } = req.body;
            const {id_account} = res.locals.lcAuthUser;
            if (!date_rent) return res.status(400).json({ msgErr: "Chưa Nhập Ngày Mượn" });
            const device = await deviceModel.findDeviceRFID(rfid);
            const shelf = await deviceModel.selectSlot(device.id_device);
            const entityReport = {
                total_slot: shelf.total_slot > 0 ? shelf.total_slot - 1 : 0,
                total_slotEmpty: shelf.total_slotEmpty + 1
            }
            const conditionReport = {
                id_shelf: shelf.id_shelf
            }
            await shelfModel.updateShelf(entityReport, conditionReport);
            let newReport = {
                id_account,
                id_device: device.id_device,
                date_rent,
                note_report: note_report || "",
                id_report_status: 1
            };
            await reportModel.insertReport(newReport);
            await deviceModel.updateStatus({ status: 1 }, { rfid });
            res.json({ msgSuccess: "Mượn Thành Công." });

        } catch (error) {
            return res.status(400).json({ msgErr: error.message });
        }
    },
    DeviceGet: async (req, res) => {
        try {      
            const { rfid, note_report, date_rent } = req.body;
            const { id_account } = res.locals.lcAuthUser;
            if (!date_rent) return res.status(400).json({ msgErr: "Chưa Nhập Ngày Lấy" });
            const device = await deviceModel.findDeviceRFID(rfid);
            const shelf = await deviceModel.selectSlot(device.id_device);
            const entityReport = {
                total_slot: shelf.total_slot > 0 ? shelf.total_slot - 1 : 0,
                total_slotEmpty: shelf.total_slotEmpty + 1
            }
            const conditionReport = {
                id_shelf: shelf.id_shelf
            }
            await shelfModel.updateShelf(entityReport, conditionReport);
            let newReport = {
                id_account,
                id_device: device.id_device,
                date_rent,
                note_report: note_report || "",
                id_report_status: 4
            };
            const checkReportOrder = await reportModel.checkReportOrder(id_account,device.id_device);
            if(checkReportOrder.length <=0){
                await reportModel.insertReport(newReport);
            }else{
                await reportModel.updateReportGetOrder(device.id_device,id_account);
            }
            await deviceModel.updateStatus({ status: 2,isLive: -1 }, { rfid });
            res.json({ msgSuccess: "Lấy thành công" });
        } catch (error) {
            return res.status(400).json({ msgErr: error.message });
        }
    },
    OrderDevice: async (req, res) => {
        try {
            const { rfid, note_report, date_rent } = req.body;
            const { id_account } = res.locals.lcAuthUser;
            if (!date_rent) return res.status(400).json({ msgErr: "Chưa Nhập Ngày Đăng Ký" });
            const device = await deviceModel.findDeviceRFID(rfid);
            const shelf = await deviceModel.selectSlot(device.id_device);
            const entityReport = {
                total_slot: shelf.total_slot > 0 ? shelf.total_slot - 1 : 0,
                total_slotEmpty: shelf.total_slotEmpty + 1
            }
            const conditionReport = {
                id_shelf: shelf.id_shelf
            }
            await shelfModel.updateShelf(entityReport, conditionReport);
            let newReport = {
                id_account,
                id_device: device.id_device,
                date_rent,
                note_report: note_report || "",
                id_report_status: 3,
                isApprove: 0
            };
            await reportModel.insertReport(newReport);
            await deviceModel.updateStatus({ status: 0,isLive: 2}, { rfid });
            res.json({ msgSuccess: "Đăng Ký Chờ Duyệt" });
        } catch (error) {
            return res.status(400).json({ msgErr: error.message });
        }
    },
    historyGet: async (req, res) => {
        try {
        const limit = 10;
        const { rfid } = req.body;
        let historyGet = [];
        historyGet = await deviceModel.historyGet(limit, rfid);
        for (let index = 0; index < historyGet.length; index++) {
            if (historyGet[index].date_rent != null) {
                let date = new Date(+historyGet[index].date_rent);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let hh = date.getHours();
                let pp = date.getMinutes();
                let time = d + '/' + (m+1) + '/' + y + "  " + hh + ":" + pp;
                historyGet[index].date_rent = time;
            }
        }
        res.json(historyGet)
        } catch (error) {
            return res.status(400).json({ msgErr: error.message });
        }
    },
    historyUserTakeTool: async function (req, res) {
        const { id } = req.params;
        const listUserTakenTool = await deviceModel.selectUserTakenTool(id);
        res.json(listUserTakenTool);
    },
    historyAllUserTakeTool: async function (req, res) {
        const { name_device } = req.body;
        const historyAllUserTakeTool = await deviceModel.historyTakenTool(name_device);
        res.json(historyAllUserTakeTool);
    },
    getProduct: async function (req, res) {
        const { id_product } = req.params;
        if (id_product) {
            const products = await deviceModel.getProduct(id_product);
            res.render('device/listProducts', products);
        }
    },
    takenTool: async function (req, res) {
        const { date_rent, date_back, note_report, rfid } = req.body;
        if (!date_rent || !date_back) return res.status(400).json({ msgErr: "Bạn Chưa Nhập ngày mượn và ngày trả" });
        if (!note_report) return res.status(400).json({ msgErr: "Bạn chưa nhập lý do lấy." });
        const { role_account, id_account } = res.locals.lcAuthUser;
        const device = await deviceModel.findDevice(rfid);
        if (+device.role > role_account) {
            return res.status(400).json({ msgErr: "Bạn Không đủ quyền mượn." });
        }
        const shelf = await deviceModel.selectSlot(device.id_device);
        const entityReport = {
            total_slot: shelf.total_slot > 0 ? shelf.total_slot - 1 : 0,
            blank: shelf.blank + 1
        }
        const conditionReport = {
            id_shelf: shelf.id_shelf
        }
        await shelfModel.updateShelf(entityReport, conditionReport);
        let newReport = {
            id_account,
            id_device: device.id_device,
            date_rent,
            date_back,
            note_report: note_report || "",
            check_status: "TAKEN"
        };
        await reportModel.insertReport(newReport);
        await deviceModel.updateStatus({ status: 'khóa' }, { rfid });
        res.json({ msgSuccess: "Mượn thành công." });
    },
    registerTool: async function (req, res) {
        const { rfid, date_rent, date_back, note_report } = req.body;
        if (!rfid || !date_rent || !date_back || !note_report) return res.status(400).json({ msgErr: "Bạn vui lòng điền đủ thông tin." })
        const { role_account, id_account } = res.locals.lcAuthUser;
        const device = await deviceModel.findDevice(rfid);
        let newReport = {
            id_account,
            id_device: device.id_device,
            date_rent,
            date_back,
            note_report: note_report || "",
            check_status: "REGISTER"
        };
        await reportModel.insertReport(newReport);
        await deviceModel.updateStatus({ status: 'khóa' }, { rfid });
        res.json({ msgSuccess: "Register tool success." });
    },
    addDevice: async function (req, res) {
        const {data_in, pos_x,pos_y,name_device, id_product, rfid } = req.body;
        const { filename, size, mimetype } = req.file;
        let maxSizeImg = 1024 * 1024;
        if(!data_in || !pos_y || !pos_x || !name_device || !id_product || !rfid || !filename){
            return res.status(400).json({ msgErr: "Vui lòng điền đầy đủ thông tin"});
        }
        const device = await deviceModel.findDeviceRFID(rfid);
        if(device) return res.status(400).json({ msgErr: "RFID cụ đã tồn tại."})
        if (size && size > maxSizeImg) {
            removeTmp(req.file.path);
            return res.status(400).json({ msgErr: "Kích thước ảnh lớn hơn > 1mb"})
        }
        const dataDevice = {
            name_device,
            id_product,
            rfid,
            image: filename,
            isLive: 0,
            status: 0,
            date_in: data_in,
            pos_x,
            pos_y
        }
        try {
            await deviceModel.addDevice(dataDevice);
            res.json({msgSuccess: "Thêm Dụng cụ thành công, chờ dụng cụ được duyệt.",keyAddDevice: 1});
        } catch (error) {
            return res.status(400).json({ msgErr: "Thêm dụng cụ thất bại.",keyAddDevice: -1 });
        }
    },
    backDevice: async function (req, res) {
        const { id_account } = res.locals.lcAuthUser;
        const limit = 10;
        let page = req.query.page || 1;
        if (page < 0) {
            page = 1;
        }
        let offset = (page - 1) * limit;
        var listDevice = await deviceModel.backDevice(id_account, limit, offset);
        var allPage = await deviceModel.allPageBack(id_account);
        const nTrang = Math.ceil(allPage / limit);
        let pages_item = [];
        for (let i = 1; i <= nTrang; i++) {
            const item = {
                value: i,
                isActive: i == page
            }
            pages_item.push(item);
        }
        res.render('device/returnDevice', {
            listDevice,
            pages_item,
            next: +page + 1,
            prev: +page - 1,
            can_go_prev: page <= 1,
            can_go_next: page >= nTrang,
        })
    },
    returnDevice: async (req, res) => {
        try {
            const { rfid, date_back } = req.body;
            const { id_account } = res.locals.lcAuthUser;
            const device = await deviceModel.findDeviceRFID(rfid);
            const shelf = await deviceModel.selectSlot(device.id_device);
            const entityReport = {
                total_slot: shelf.total_slot > 0 ? shelf.total_slot + 1 : 0,
                total_slotEmpty: shelf.total_slotEmpty - 1
            }
            const conditionReport = {
                id_shelf: shelf.id_shelf
            }
            await shelfModel.updateShelf(entityReport, conditionReport);
            let newReport = {
                id_account,
                id_device: device.id_device,
                date_back,
                id_report_status: 2
            };
            await reportModel.insertReport(newReport);
            await deviceModel.updateStatus({ status: 0 }, { rfid });
            return res.json({ msgSuccess: "Trả thành công." });
        } catch (error) {
            return res.status(400).json({ msgErr: error.message });
        }
    },
    inventory: async(req,res) =>{
        const limit = 10;
        let page = req.query.page || 1;
        if (page < 0) {
            page = 1;
        }
        let offset = (page - 1) * limit;
        let listInventory = []
        listInventory = await deviceModel.inventory(limit, offset);
        for (let index = 0; index < listInventory.length; index++) {
            let amount = listInventory[index].So_luong;
            if(amount<5){
                listInventory[index].checkAmount = true;
            }else{
                listInventory[index].checkAmount = false;
            }
        }
        allPage = await reportModel.allPageInventory();
        const nTrang = Math.ceil(allPage / limit);
        let pages_item = [];
        for (let i = 1; i <= nTrang; i++) {
            const item = {
                value: i,
                isActive: i == page
            }
            pages_item.push(item);
        }
        res.render('report/Inventory', {
            listInventory,
            pages_item,
            next: +page + 1,
            prev: +page - 1,
            can_go_prev: page <= 1,
            can_go_next: page >= nTrang,
        })
    },
    modifies: async(req,res) =>{
        res.render('device/Modifies')
    },
    modifyDevice: async(req,res) =>{
        const{note,id_device} = req.body;
        if(req.file){
            const{filename} = req.file;
            var entity={
                    note: note,
                    image: filename
             }
        }else{
            var entity={
                note: note
         }
        }
        const condition ={
           id_device: +id_device
        }
        const updateDevice = await deviceModel.modifyDevice(entity,condition);
        return res.json(updateDevice)
    }
}
const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}
module.exports = deviceCtl;