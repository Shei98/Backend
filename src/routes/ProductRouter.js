import express from 'express';
import Product from '../model/Product.js';
import { PRODUCT_CREATED_EVENT, PRODUCT_DELETED_EVENT } from '../constants.js';

class ProductRouter {
    constructor(productManager) {
        this.productManager = productManager;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/', this.getProducts.bind(this));
        this.router.get('/:pid', this.getProductById.bind(this));
        this.router.post('/', this.addProduct.bind(this));
        this.router.put('/:pid', this.updateProduct.bind(this));
        this.router.delete('/:pid', this.deleteProduct.bind(this));
    }

    async getProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            let products;
            if (limit) {
                const allProducts = await this.productManager.getProducts();
                products = allProducts.slice(0, parseInt(limit));
            } else {
                products = await this.productManager.getProducts();
            }
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }

    async getProductById(req, res) {
        try {
            const productId = parseInt(req.params.pid);
            const product = await this.productManager.getProductById(productId);

            if (!product) {
                res.status(404).json({ error: 'Producto no encontrado' });
            } else {
                res.json(product);
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    }

    async addProduct(req, res) {
        try {
            const { title, description, code, price, stock, category, thumbnails } = req.body;
            const product = await this.productManager.addProduct(new Product(title, description, code, price, stock, category, thumbnails));
            const io = req.app.get('io');
            io.emit(PRODUCT_CREATED_EVENT, product);
            res.json(product);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al agregar el producto' });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = parseInt(req.params.pid);
            const fieldsToUpdate = req.body;
            const updatedProduct = await this.productManager.updateProduct(productId, fieldsToUpdate);
            if (updatedProduct) {
                res.json(updatedProduct);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = parseInt(req.params.pid);
            const deletedProduct = await this.productManager.deleteProduct(productId);
            if (deletedProduct) {
                res.json({ success: true });
                const io = req.app.get('io');
                io.emit(PRODUCT_DELETED_EVENT, productId);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
}

export default ProductRouter;
