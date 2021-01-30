const socket = io();
let notification = document.querySelector('.notification');
let left_device = document.querySelector('.left_device');
socket.on('SERVER_SEND_AUTH_BORROW', (data) => {
    notification.innerText = data;
    left_device.style.display = 'block';
})
socket.on('SERVER_SEND_AUTH_TAKEN', (data) => {
    notification.innerText = data;
    left_device.style.display = 'block';
})
socket.on('SERVER_SEND_REGISTER_ACCOUNT', (data) => {
    let notification_accept = $(".notification_acceptt");
    notification_accept.append(`<span> ${data.full_name}  ${data.msgRegister} <a onclick="redirectAccept()" href="javascript:void(0)">Duyệt</a> </span>`);
    notification_accept.css('display', 'block');
    notification_accept.css('opacity','1');
   
});
socket.on('SERVER_SEND_REGISTER_DEVICE', (data) => {
    console.log(data);
    let notification_accept = $(".notification_accept");
    notification_accept.append(`<span> ${data} <a onclick="redirectAccept()" href="javascript:void(0)">Duyệt</a> </span>`);
    notification_accept.css('display', 'block');
    notification_accept.css('opacity','1');
     
});
socket.on('SERVER_SEND_AUTH_ORDER', (data) => {
    notification.innerText = data;
    left_device.style.display = 'block';
})

function redirectAccept(){
    window.location.replace("/admin/accepts");
    let notification_accept = $(".notification_accept");
    notification_accept.append("");
}