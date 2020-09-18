var express = require('express');
var app = express();
var path = require('path');
var multer = require('multer');
const bodyParser = require('body-parser');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

// global.__basedir = __dirname;

app.get('/', (req, res) => {
    res.render('index');
});

let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Định nghĩa nơi file upload sẽ được lưu lại
        callback(null, __dirname + "/uploads");
    },
    filename: (req, file, callback) => {
        // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
        // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
        let math = ["image/png", "image/jpeg", "image/jpg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `Tệp <strong>${file.originalname}</strong> không hợp lệ. Chỉ
   cho phép đuôi mở rộng jpeg + png.`;
            return callback(errorMess, null);
        }
        // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
        let filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);

    }
});
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
var uploadFile = multer({ storage: diskStorage }).array("fileupload", 12)
    // Route này Xử lý khi client thực hiện hành động upload file
app.post("/uploads", (req, res) => {
    // Thực hiện upload file, truyền vào 2 biến req và res
    uploadFile(req, res, (error) => {
        // Nếu có lỗi thì trả về lỗi cho client.
        // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên

        if (error) {
            return res.send(`Có lỗi khi cố tải tệp hình ảnh lên máy chủ: ${error}`);
        }
        console.log(`------Request body-----`);
        console.log(req.body);
        console.log(`------Request file-----`);
        console.log(req.file);
        console.log(`------Test Done-----`)
            // Không có lỗi thì lại render cái file ảnh về cho client.
            // Đồng thời file đã được lưu vào thư mục uploads
            // res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`));
        res.send('Bạn đã upload thành công!');
    });

});

// const uploadFile = require('./uploadmulti');
// app.post('/uploads', uploadFile.array("fileupload", 2), (req, res) => {

//     res.end();
// });

app.listen(3000, "localhost", () => {
    console.log(`Hello Everybody, I'm running at localhost:3000/`);
});