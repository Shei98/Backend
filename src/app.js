import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import ProductRouter from './routes/ProductRouter.js';
import CartRouter from './routes/CartRouter.js';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import ChatRouter from './routes/ChatRouter.js';
import Product from './dao/models/Product.js';
import Chat from './dao/models/Chat.js';
import moment from 'moment/moment.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productRouter = new ProductRouter().router;
const cartRouter = new CartRouter().router;
const chatRouter = new ChatRouter().router;
dotenv.config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {

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
    app.use('/api/chats', chatRouter);

    handlebars.create().handlebars.registerHelper('formatDate', (date) => {
        return moment(date).format('DD/MM/yyyy h:mma')
    });

    app.get('/', async (req, res) => {
        Product.find().lean()
            .then((products) => {
                res.render('home', { products });
            }).catch((error) => {
                res.status(500).json({ error: 'Error al obtener los productos', message: error.message });

            });
    });

    app.get('/realtimeproducts', async (req, res) => {
        Product.find().lean()
            .then((products) => {
                res.render('realTimeProducts', { products });
            }).catch((error) => {
                res.status(500).json({ error: 'Error al obtener los productos', message: error.message });
            });
    });

    app.get('/chat', async (req, res) => {
        Chat.find().lean()
            .then((messages) => {
                res.render('chat', { messages });
            }).catch((error) => {
                res.status(500).json({ error: 'Error al obtener el chat ', message: error.message });
            });
    });

    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        socket.on('message', (data) => {
            Chat.create({ message: data.message, createdAt: new Date(), user: data.user })
                .then((chat) => {
                    io.emit('messageLogs', { createdAt: moment(chat.createdAt).format('DD/MM/yyyy h:mma'), user: chat.user, message: chat.message });
                })
                .catch((error) => {
                    console.log(error);
                });
        });
        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });

    const port = 8080;

    server.listen(port, () => {
        console.log(`Servidor Express escuchando en el puerto ${port}`);
    });

}).catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
});