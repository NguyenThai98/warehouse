const menuModel = require('../models/menu.model');
const categoryModel = require('../models/category.model');
const menuCtrl = {
    selectChildMenu: async function (req, res) {
        const { id, table } = req.body;
        const subMenu = await menuModel.loadMenu(id, table);
        res.json(subMenu);
    },
    selectShefl: async function (req, res) {
        const selectMenu = await categoryModel.selectShefl();
        res.json(selectMenu);
    },
    selectCategory: async function (req, res) {
        const {id_shelf} = req.body;
        const selectCategory = await categoryModel.selectCategory(id_shelf);
        res.json(selectCategory);
    },
    selectProduct: async function (req, res) {
        const {id_category} = req.body;
        const selectProduct = await categoryModel.selectProduct(id_category);
        res.json(selectProduct);
    },
    selectDevice: async function(req,res){
        const {id_product} = req.body;
        const selectDevice = await categoryModel.selectDevice(id_product);
        res.json(selectDevice)
    },
    getDeviceId: async function(req,res){
        const {id_device} = req.body;
        const getDevice = await categoryModel.getDevice(id_device);
        res.json(getDevice[0])
    }
}

module.exports = menuCtrl;