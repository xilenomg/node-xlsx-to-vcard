var express = require('express');
var router = express.Router();
var HomeRequestController = require('../requestControllers/HomeRequestController');
var FileRequestController = require('../requestControllers/FileRequestController');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/../../public/uploads/spreadsheets');
    },
    filename: function(req, file, callback) {
        var extensao = file.originalname;
        if (file.originalname.indexOf(".") !== -1) {
            var array = file.originalname.split('.');
            extensao = '.' + array[array.length - 1];
        }
        callback(null, file.fieldname + '-' + Date.now() + extensao);
    }
});
var upload = multer({ storage: storage }).single('spreadsheet');

router.get('/', HomeRequestController.index);

router.post('/upload', upload, FileRequestController.upload);

module.exports = router;
