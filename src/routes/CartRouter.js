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
        this.router.post('/:cid/products/:pid', this.addProductToCart.bind(this));
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
            const cartId = req.params.cid;
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                res.status(404).json({ error: 'Carrito no encontrado' });
            } else {
                res.json(cart.products);
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos del carrito', message: error.message });
        }
    }

    async addProductToCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = parseInt(req.query.quantity) || 1;

            const cart = await cartModel.findByIdAndUpdate(
                cartId,
                { $push: { products: { productId, quantity } } },
                { new: true }
            );

            if (cart) {
                res.json(cart);
            } else {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el producto al carrito', message: error.message });
        }
    }
}

export default CartRouter;
