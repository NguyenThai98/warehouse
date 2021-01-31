const deviceModel = require('../models/device.model');
const userModel = require('../models/user.model');
const reportModel = require('../models/report.model');
const adminModel = require('../models/admin.model');
const deviceCtl = require('./device.ctl');
const adminCtl = {
    accepts: async function (req, res) {
        const Requests_Register_account = await adminModel.Requests_Register_account();
        const Requests_Register_device = await adminModel.Requests_Register_device();
        const Requests_Order_device = await adminModel.Requests_Order_device();
        for (let index = 0; index < Requests_Order_device.length; index++) {
            if (Requests_Order_device[index].date_rent != null) {
                let date = new Date(+Requests_Order_device[index].date_rent);
                let y = date.getFullYear();
                let m = date.getMonth();
                let d = date.getDate();
                let time = d + '/' + (m+1) + '/' + y 
                Requests_Order_device[index].date_rent = time;
            }
        }
        res.render('admin/listAcceptDevice', {
            Requests_Register_account,
            Requests_Register_device,
            Requests_Order_device
        });
    },
    accept: async function (req, res) {
        const { date_rent, date_back, id_report, id_device } = req.body;
        if (!date_rent || !date_back || !id_report) return res.json({ msgErr: "Lỗi đăng ký đồ dùng." });
        const report = reportModel.findReport(date_rent, date_back, id_report);
        if (report) {
            let entity = {
                check_status: 'ACCEPT'
            };
            let condition = {
                id_report: id_report
            }
            await reportModel.updateReport(entity, condition);

            res.json({ msgSuccess: "Duyệt thành công" });
        } else {
            res.json({ msgErr: "Duyệt thất bại" });
        }
    },
    refuse: async function (req, res) {
        const { date_rent, date_back, id_report, id_device } = req.body;
        if (!date_rent || !date_back || !id_report) return res.json({ msgErr: "Lỗi đăng ký đồ dùng." });
        const report = reportModel.findReport(date_rent, date_back, id_report);
        if (report) {
            let entity = {
                check_status: 'REFUSE'
            };
            let condition = {
                id_report: id_report
            }
            await reportModel.updateReport(entity, condition);
            await deviceModel.updateStatus({ status: 'không khóa' }, { id_device });
            res.json({ msgSuccess: "Đã hủy đăng ký dụng cụ." });
        } else {
            res.json({ msgErr: "Hủy đăng ký dụng cụ thất bại." });
        }
    },
    acceptAccount_Device: async function (req, res) {
        try {
            const { rfid, table } = req.body;
            if (!rfid) return res.status(400).json({ msgErr: "Thông tin lỗi." });
            if (table == 'account') {
                await userModel.updateIsLive({ isLive: 1 }, { rfid: rfid });
                return res.json({ msgSuccess: "Tài khoản được kích hoạt." })
            } else if (table == 'device') {
                await deviceModel.updateStatus({ isLive: 1 }, { rfid: rfid });
                return res.json({ msgSuccess: "Dụng cụ được kích hoạt." })
            }
        } catch (error) {
            return res.join({ msgErr: error.message });
        }

    },
    rejectAccount_Device: async function (req, res) {
        try {
            const { rfid, table } = req.body;
            if (!rfid || !table) return res.status(400).json({ msgErr: "Thông tin lỗi." });
            if (table == "account") {
                await userModel.updateIsLive({ isLive: -1 }, { rfid: rfid });
                return res.json({ msgSuccess: "Từ chối Tài khoản thành công." });
            } else {
                await deviceModel.updateStatus({ isLive: -1 }, { rfid: rfid });
                return res.json({ msgSuccess: "Từ chối dụng cụ thành công." });
            }
        } catch (error) {
            return res.join({ msgErr: error.message });
        }

    },
    acceptOrder: async (req, res) =>{
        const {id_device} = req.body
        const {id_account} = req.body
        const updateReport = await reportModel.updateReportOrder(id_device,id_account);
        const updateStatusDevice = await deviceModel.updateStatus({ isLive: -1, status: 2 }, { id_device: id_device }) ;
        var deviceAccepted = await deviceModel.selectidDeviceAccept();
        deviceAccepted.forEach(async(device) => {
            await reportModel.updateAutoRejectReport(device.id_device);
        });
        res.json({msgSuccess: "Đồng ý thành công."});
    },
    rejectOrder: async (req, res) =>{
        const {id_device} = req.body
        const {id_account} = req.body
        const updateRejectReport = await reportModel.updateRejectReport(id_device,id_account);
        res.json({msgSuccess: "Từ chối thành công."});
    },
    delAccount: async (req, res) =>{
        let checkDelAccount = false;
        try {
            const {id_account} = req.body
            if(!id_account) return res.status(400).json({ msgErr: "Vui lòng chọn tài khoản."});
            await adminModel.delAccount(id_account, {isLive: -1});
            return res.json({msgSuccess: "Xóa tài khoản thành công."});
        
        } catch (error) {
           return res.json({msgErr: "Xóa tài khoản thất bại."});
        }
    }
}
module.exports = adminCtl;