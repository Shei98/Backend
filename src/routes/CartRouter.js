import { Router } from 'express';

class CartRouter {
    constructor(cartManager) {
        this.cartManager = cartManager;
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
            const cart = await this.cartManager.createCart();
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    }

    async getCartProducts(req, res) {
        try {
            const cartId = parseInt(req.params.cid);
            const cart = await this.cartManager.getCartById(cartId);

            if (!cart) {
                res.status(404).json({ error: 'Carrito no encontrado' });
            } else {
                res.json(cart.products);
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos del carrito' });
        }
    }

    async addProductToCart(req, res) {
        try {
            const cartId = parseInt(req.params.cid);
            const productId = parseInt(req.params.pid);
            const quantity = parseInt(req.query.quantity) || 1;

            const cart = await this.cartManager.addProductToCart(cartId, productId, quantity);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el producto al carrito' });
        }
    }
}

export default CartRouter;