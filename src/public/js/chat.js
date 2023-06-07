const socket = io();
let user;
const chatBox = document.getElementById('chatBox');
const submitButton = document.getElementById('submitButton');

Swal.fire({
    title: 'Identifícate',
    input: "text",
    text: "Ingresa el usuario para identificarte con el chat",
    inputValidator: (value) => {
        return !value && '¡Nombre de usuario requerido!'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
})

chatBox.addEventListener('keyup', (e) => {
    if (e.code === "Enter" && chatBox.value.trim().length > 0) {
        socket.emit("message", { user: user, message: chatBox.value });
        chatBox.value = ""
    }
});

socket.on('messageLogs', (data) => {
    const log = document.getElementById('messageLogs');
    log.innerHTML += `<p>[${data.createdAt}] - ${data.user} dice: ${data.message}</p>`;
});