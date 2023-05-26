import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import ProductRouter from './routes/ProductRouter.js';
import CartRouter from './routes/CartRouter.js';
import __dirname from './utils.js';
import { PRODUCT_CREATED_EVENT, PRODUCT_DELETED_EVENT } from './constants.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductManager('./src/persistence/products.json');
const cartManager = new CartManager('./src/persistence/carts.json');
const productRouter = new ProductRouter(productManager).router;
const cartRouter = new CartRouter(cartManager).router;

app.engine('handlebars', handlebars.engine({
    defaultLayout: "",
    layoutsDir: "",
}));
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.set('io', io)
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const port = 8080;

server.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
