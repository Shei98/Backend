import express, { Router } from 'express';
import ProductManager from './routes/ProductManager.js';
import CartManager from './routes/CartManager.js';
import Product from './model/Product.js';

const app = express();
app.use(express.json());
const productManager = new ProductManager('./src/persistence/products.json');
const cartManager = new CartManager('./src/persistence/carts.json');

// Router para productos
const productRouter = Router();

// Endpoint para obtener todos los productos
productRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        let products;
        if (limit) {
            const allProducts = await productManager.getProducts();
            products = allProducts.slice(0, parseInt(limit));
        } else {
            products = await productManager.getProducts();
        } res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Endpoint para obtener un producto por su ID
productRouter.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Agregar un nuevo producto
productRouter.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        const product = await productManager.addProduct(new Product(title, description, code, price, stock, category, thumbnails));
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Actualizar un producto por su ID
productRouter.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const fieldsToUpdate = req.body;
        const updatedProduct = await productManager.updateProduct(productId, fieldsToUpdate);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto por su ID
productRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Agregar el router de productos al servidor
app.use('/api/products', productRouter);

// Router para carritos
const cartRouter = Router();

// Endpoint para crear un nuevo carrito
cartRouter.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Endpoint para listar los productos de un carrito
cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
        } else {
            res.json(cart.products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
});

// Endpoint para agregar un producto al carrito
cartRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = parseInt(req.query.quantity) || 1;

        const cart = await cartManager.addProductToCart(cartId, productId, quantity);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

// Agregar el router de carritos al servidor
app.use('/api/carts', cartRouter);

// Puerto en el que se ejecutará el servidor
const port = 8080;

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
