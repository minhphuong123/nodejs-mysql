const multer = require('multer');

const imageFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback('Yêu cầu chọn ảnh', false);
    }
};

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __basedir + "/uploads/");
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);

    }
});

var uploadfile = multer({ storage: storage, fileFilter: imageFilter });

module.exports = uploadfile;