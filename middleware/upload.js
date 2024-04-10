const path = require('path')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});

let upload = multer ({
    storage: storage,
    fileFilter: function(req, file, callback) {
        if (
            file.mimetype === 'application/pdf'
        ) {
            callback(null, true)
        }
        else {
            console.log('only pdf accepted')
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
}).single('cvFile'); // Use the field name 'resume'


module.exports = upload