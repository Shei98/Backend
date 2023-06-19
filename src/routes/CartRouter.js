import { Router } from 'express';
import { Cart as cartModel } from '../dao/models/Cart.js';

class CartRouter {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/', this.createCart.bind(this));
        this.router.get('/:cid', this.getCartProducts.bind(this));
        this.router.put('/:cid', this.updateCartProducts.bind(this));
        this.router.put('/:cid/products/:pid', this.updateProductsQuantity.bind(this));
        this.router.post('/:cid/products/:pid', this.addProductToCart.bind(this));
        this.router.delete('/:cid', this.emptyCart.bind(this));
        this.router.delete('/:cid/products/:pid', this.deleteProductFromCart.bind(this));
    }

    async createCart(req, res) {
        try {
            const cart = await cartModel.create({});
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el carrito', message: error.message });
        }
    }

    async getCartProducts(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartModel.findById(cid).populate('products.product').lean().exec();
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado', message: error.message });
            }
            res.json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Error al obtener el carrito', message: error });
        }
    }

    async addProductToCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = parseInt(req.body.quantity) || 1;
            const cart = await cartModel.findById(cartId).exec();
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            const existingProduct = cart.products.find(product => product.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            const updatedCart = await cart.save();
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el producto al carrito', message: error.message });
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const cart = await cartModel.findById(cid).exec();
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado', message: error.message });
            }
            cart.products = cart.products.filter((product) => product.productId.toString() !== pid);
            await cart.save();
            res.json({ status: 'success', message: 'Producto eliminado del carrito exitosamente' });
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Error al eliminar el producto del carrito', message: error.message });
        }
    }

    async updateCartProducts(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            const cart = await cartModel.findById(cid).exec();
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }
            cart.products = products;
            await cart.save();
            res.json({ status: 'success', message: 'Carrito actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Error al actualizar el carrito', message: error.message });
        }
    }

    async updateProductsQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const cart = await cartModel.findById(cid).exec();
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }
            const productIndex = cart.products.findIndex((product) => product.productId.toString() === pid);
            if (productIndex === -1) {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' });
            }
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json({ status: 'success', message: 'Cantidad de ejemplares actualizada exitosamente' });
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Error al actualizar la cantidad de ejemplares del producto', message: error.message });
        }
    }

    async emptyCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartModel.findById(cid).exec();
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
            }
            cart.products = [];
            await cart.save();
            res.json({ status: 'success', message: 'Productos eliminados del carrito exitosamente' });
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Error al eliminar los productos del carrito', message: error.message });
        }
    }
}

export default CartRouter;
