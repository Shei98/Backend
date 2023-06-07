const socket = io();
socket.emit('message', 'Hello from client');

socket.on('productCreated', (product) => {
    const productItem = document.createElement('li');
    productItem.id = product.id;
    productItem.innerText = product.title + ' - ' + product.description;
    document.getElementById('productList').appendChild(productItem);
});

socket.on('productDeleted', (productId) => {
    const productItem = document.getElementById(productId);
    if (productItem) {
        productItem.remove();
    }
});
