import express from 'express';
import { Product as productModel } from '../dao/models/Product.js';
import { PRODUCT_CREATED_EVENT, PRODUCT_DELETED_EVENT } from '../constants.js';

class ProductRouter {
    constructor() {
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
                const allProducts = await productModel.find();
                products = allProducts.slice(0, parseInt(limit));
            } else {
                products = await productModel.find();
            }
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos', message: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.pid;
            const product = await productModel.findById(productId);

            if (!product) {
                res.status(404).json({ error: 'Producto no encontrado' });
            } else {
                res.json(product);
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto', message: error.message });
        }
    }

    async addProduct(req, res) {
        try {
            const { title, description, code, price, stock, category, thumbnails } = req.body;
            const product = await productModel.create({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails
            });
            const io = req.app.get('io');
            io.emit(PRODUCT_CREATED_EVENT, product);
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el producto', message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.pid;
            const fieldsToUpdate = req.body;
            const updatedProduct = await productModel.findByIdAndUpdate(productId, fieldsToUpdate, { new: true });
            if (updatedProduct) {
                res.json(updatedProduct);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto', message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.pid;
            const deletedProduct = await productModel.findByIdAndDelete(productId);
            if (deletedProduct) {
                res.json({ success: true });
                const io = req.app.get('io');
                io.emit(PRODUCT_DELETED_EVENT, productId);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto', message: error.message });
        }
    }
}

export default ProductRouter;
