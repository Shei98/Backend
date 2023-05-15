import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const productManager = new ProductManager('./src/products.json');

// Endpoint para obtener todos los productos o limitar el número de resultados
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        let products;

        if (limit) {
            const allProducts = await productManager.getProducts();
            products = allProducts.slice(0, parseInt(limit));
        } else {
            products = await productManager.getProducts();
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
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

// Puerto en el que se ejecutará el servidor
const port = 8080;

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
