const router = require('express').Router();
const deviceCtl = require('../controllers/device.ctl');
const deviceModel = require('../models/device.model');
const auth = require('../middlewares/auth.mdw');
const authorization = require('../middlewares/authrization.mdw');
const multer = require('multer');

const upload = multer({
    dest: 'public/img/'
});

router.get('/addDevice', auth, authorization.THEM_DUNG_CU, (req, res) => {
    res.render('device/addDevice');
}); // n
router.post('/addDevice', upload.single('image'), deviceCtl.addDevice); // n
router.post('/modifyDevice',auth,upload.single('image'), deviceCtl.modifyDevice)
router.post('/uploadShelf', upload.single('image'), async (req, res) => {
    try {
        const { position_sheft } = req.body;
        await deviceModel.updateShefl({ ImgShelf: req.file.filename }, { id_shelf: +position_sheft })
        res.json({ msgSuccess: "Upload successfully", img: req.file.filename });
    } catch (error) {
        res.status(400).json({ msgError: error.message });
    }

}) // n
router.post('/addDevice', upload.single('image'), deviceCtl.addDevice); // n
router.post('/showPosition', async (req, res) => {
    const { id_shelf } = req.body;
    const aPosition = await deviceModel.getPosition(id_shelf);
    let data = [];
    for (let index = 0; index < aPosition.length; index++) {
        let position_device = aPosition[index].pos_x + "-" + aPosition[index].pos_y;
        data.push(position_device);
    }
    res.json(data);
})
router.post('/getShefl', async function (req, res) {
    const { id_shelf } = req.body;
    const shelf = await deviceModel.selectShefl(id_shelf);
    res.json(shelf[0]);

})


router.get('/importList', (req, res) => {
    res.render('device/importList');
}); // n
router.get('/checkShelf',auth, (req, res) => {
    res.render('device/checkShelf');
}); // n
router.get('/layout',auth,authorization.THEM_DUNG_CU, (req, res) => {
    res.render('device/layout');
}); // n

router.get('/', auth, deviceCtl.getAllDevice);
router.post('/get-device',auth, deviceCtl.getDevice);
router.post('/getBorrow', deviceCtl.getBorrow);// n
router.post('/GetDevice', deviceCtl.DeviceGet);//lay dung cu
router.post('/OrderDevice', deviceCtl.OrderDevice);//dk lay dung cu
router.post('/historyGet', deviceCtl.historyGet);//n
router.get('/historyTakenTool/:id', auth, deviceCtl.historyUserTakeTool);
router.post('/taken-tool', auth, deviceCtl.takenTool);
router.post('/register-tool', auth, deviceCtl.registerTool);
router.post('/historyAllTool', auth, deviceCtl.historyAllUserTakeTool);
router.get('/registerGetDevice',auth, (req, res) => {
    res.render('device/registerGetDevice');
});
 
router.get('/borrowDevice', auth, (req, res) => {
    res.render('device/borrowDevice__n');
});
router.get('/TakenDevice', auth, (req, res) => {
    res.render('device/takenDevice');
});
router.get('/returnDevice', auth, deviceCtl.backDevice);
router.post('/backDevice', deviceCtl.returnDevice);// n
router.get('/modifies', auth, deviceCtl.modifies)
module.exports = router;