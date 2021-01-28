const router = require('express').Router();
const auth = require('../middlewares/auth.mdw');
const isAdmin = require('../middlewares/isAdmin.mdw');
const adminCtl = require('../controllers/admin.ctl');
const userModel = require('../models/user.model');
const authorization = require('../middlewares/authrization.mdw');
 
router.get('/accepts', auth, authorization.DUYET_DUNG_CU, adminCtl.accepts); // n

router.post('/accept', adminCtl.accept);
router.post('/refuse', adminCtl.refuse);
router.post('/acceptAccount_Device', adminCtl.acceptAccount_Device);
router.post('/rejectAccount_Device', adminCtl.rejectAccount_Device);

router.get('/auth',auth, async (req, res) => {
    const all_accounts = await userModel.allUser(res.locals.lcAuthUser.id_account);
    res.render('auth/authorization', { all_accounts });
});
router.post('/acceptOrder',auth, adminCtl.acceptOrder);
router.post('/rejectOrder',auth, adminCtl.rejectOrder);
router.post('/delAccount',auth, adminCtl.delAccount);
router.get('/system',auth, (req, res) => {
    res.render('admin/system');
});
module.exports = router;