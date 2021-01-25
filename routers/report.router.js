const router = require('express').Router();
const reportCtl = require('../controllers/report.ctl');
const deviceCtl = require('../controllers/device.ctl')
const auth = require('../middlewares/auth.mdw');
const reportModel = require('../models/report.model');
router.get('/', auth, reportCtl.getAllReport);
router.get('/allPage', reportCtl.allPage);
router.get('/historyUser', auth, reportCtl.getReportOne);
router.get('/historyBorrow', auth, reportCtl.historyBorrow);
router.get('/historyReturn', auth, reportCtl.historyReturn);
router.get('/historyGet', auth, reportCtl.historyGet);
router.get('/historyOrder', auth, reportCtl.historyOrder);
router.get('/exportExcel',auth, reportCtl.exportExcel);
router.get('/exportsBorrow', reportCtl.exportBorrow);
router.get('/exportsReturn', reportCtl.exportBack);
router.get('/exportsGet', reportCtl.exportGet);
router.get('/remaining', auth, reportCtl.deviceRemaining);
router.post('/unlockReport', auth, reportCtl.unlockReport);
router.get('/inventory',auth, deviceCtl.inventory);// n
module.exports = router;