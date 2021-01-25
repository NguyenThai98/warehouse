const router = require('express').Router();
const menuCtrl = require('../controllers/menu.ctl');
router.post('/Submenu', menuCtrl.selectChildMenu);
router.post('/getShelf', menuCtrl.selectShefl);
router.post('/getCategory', menuCtrl.selectCategory);
router.post('/getProduct', menuCtrl.selectProduct);
router.post('/getDevice', menuCtrl.selectDevice);
router.post('/getDevicebyId', menuCtrl.getDeviceId);
module.exports = router;