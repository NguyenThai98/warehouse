require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const http = require('http').createServer(app);
const auth = require('./middlewares/auth.mdw');
const open = require('open');
const io = require('socket.io')(http);

require('express-async-errors');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static('public'));
require('./middlewares/session.mdw')(app);
require('./middlewares/view.mdw')(app);
require('./middlewares/locals.mdw')(app, io);
app.use('/public', express.static('public'));


app.use('/user', require('./routers/user.router'));
app.use('/admin', require('./routers/admin.router'));
app.use('/device', require('./routers/device.router'));
app.use('/report', require('./routers/report.router'));

app.use('/menu', require('./routers/menu.router'));

app.get('/', auth, function (req, res) {
    res.render('home/home');
});
io.on('connection', (socket) => {
    console.log(socket.id);
    app.set('socket', socket);
    //scanRFID
    socket.on('SCAN_RFID_REGISTER_DEVICE', (data) => {
        if (data == "SCAN_RFID" || data == "OK") {
            socket.broadcast.emit('SCAN_RFID_REGISTER_DEVICE', data);
        }
        if (data != "SCAN_RFID" && data != "OK" && data != undefined) {
            socket.broadcast.emit('CLIENT_REVICE_RFID', data);
        }
    });
    // scanRFID xxx

    // GỬI ALL KEY KIỂM KÊ,
    socket.on('SEND_KEY_ALL', (data) => {
        socket.broadcast.emit('OPEN_ALL_SHELF', "1");
    })
    socket.on('CLOSE_SHELF', (data) => {
        socket.broadcast.emit('CLOSE_SHELF', data);
    })
    // GỬI ALL KEY KIỂM KÊ xxx,
    socket.on('CLIENT_BORROW_DEVICE', (data) => {
        socket.emit('SERVER_SEND_AUTH_BORROW', `Tài khoản ${data.full_name} vừa mượn ${data.name_device}`);
    });
    socket.on('CLIENT_ORDER_DEVICE', (data) => {
        socket.emit('SERVER_SEND_AUTH_ORDER', `Tài khoản ${data.full_name} vừa đăng ký lấy ${data.name_device}`);
    });
    socket.on('CLIENT_TAKEN_DEVICE', (data) => {
        io.sockets.emit('SERVER_SEND_AUTH_TAKEN', `Tài khoản ${data.full_name} vừa lấy ${data.name_device}`);
    });
    socket.on('REGISTER_ACCOUNT', (data) => {
        socket.broadcast.emit('SERVER_SEND_REGISTER_ACCOUNT', data);
    })
    socket.on('REGISTERR_DEVICE', (data) => {
        socket.broadcast.emit('SERVER_SEND_REGISTER_DEVICE', data);
    })
    socket.on('SCAN_PLC_SYSTEM', (data) => {
        socket.join('PLC');
        data = data.toString();
        socket.broadcast.emit('RECIVE_DATA_SYSTEM', data);
    });
    socket.on('SCAN_READER_SYSTEM', (data) => {
        socket.join('READER');
        socket.broadcast.emit('RECIVE_READER_SYSTEM', data);
    });
    // Mượn
    socket.on('OPEN_SHELF', (data) => {
        socket.broadcast.emit('OPENED_SHELF', data);
    });
    socket.on('CHECK_OPEN_SHELF', (data) => {
        socket.broadcast.emit('CHECK_OPEN_SHELFF', data);
    });
    socket.on('LISTEN_OPEN_SHELF',data =>{
        socket.broadcast.emit('LISTEN_OPEN_SHELF', data);
    })
    // LAY DUNG CU
    socket.on('TAKEN_DEVICE', (data) => {
        socket.broadcast.emit('OPENED_SHELF_TAKEN', data);
    })
    socket.on('CHECK_OPEN_SHELF_TAKEN', (data) => {
        socket.broadcast.emit('CHECK_OPEN_SHELF_TAKEN', data);
    });
    socket.on('LISTEN_OPEN_SHELF_TAKEN',data =>{
        socket.broadcast.emit('LISTEN_OPEN_SHELF_TAKEN', data);
    })
    // ĐĂNG KÝ DUNG CU
    socket.on('REGISTER_DEVICE', (data) => {
        socket.broadcast.emit('OPENED_SHELF_REGISTER', data);
    })
    socket.on('CHECK_OPEN_SHELF_REGISTER', (data) => {
        socket.broadcast.emit('CHECK_OPEN_SHELF_REGISTER', data);
    });
    socket.on('LISTEN_OPEN_SHELF_REGISTER',data =>{
        socket.broadcast.emit('LISTEN_OPEN_SHELF_REGISTER', data);
    })
    // ĐĂNG KÝ DUNG CU xxx


    // TRẢ DUNG CU
    socket.on('RETURN_DEVICE', (data) => {
        socket.broadcast.emit('OPENED_SHELF_RETURN', data);
    })
    socket.on('CHECK_OPEN_SHELF_RETURN', (data) => {
        socket.broadcast.emit('CHECK_OPEN_SHELF_RETURN', data);
    });
    socket.on('LISTEN_OPEN_SHELF_RETURN',data =>{
        socket.broadcast.emit('LISTEN_OPEN_SHELF_RETURN', data);
    })
    // TRẢ DUNG CU xxx

    // ROMM QUOC
    var tmp = "";
    socket.on("room", function (da11) {
        tmp = da11;
        socket.join(da11);
    });

    socket.on("PUB_READER", function (data) {
        io.sockets.in(tmp).emit('PLC', data);
    });

    socket.on("PUB_PLC", function (data) {
        io.sockets.in(tmp).emit('READER', data);
    });
    // ROMM QUOC XXX

    socket.on('disconnect', function () {
        if (io.sockets.adapter.rooms['PLC'] == undefined) {
            socket.broadcast.emit('RECIVE_DATA_SYSTEM', null);
        }
        if (io.sockets.adapter.rooms['READER'] == undefined) {
            socket.broadcast.emit('RECIVE_READER_SYSTEM', null);
        }
    });
})
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res) {
    res.render('notification/404', { layout: false });
})
app.use(function (err, req, res, next) {
    res.status(500).render('notification/404', { layout: false });
})
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`start sever at port http://localhost:${PORT}`);
})
