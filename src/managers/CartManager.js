import { promises } from 'fs';
import Cart from '../model/Cart.js';

class CartManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = new Cart();
            const lastCart = carts.slice(-1)[0];
            if (lastCart) {
                newCart.id = lastCart.id + 1;
            }
            carts.push(newCart);
            await this.saveCarts(carts);
            return newCart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === cartId);
        } catch (error) {
            throw new Error('Error getting cart by ID: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);
            if (cart) {
                const existingProduct = cart.products.find(item => item.product === productId);
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }
                await this.saveCarts(carts);
                return cart;
            }
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }

    async getCarts() {
        try {
            const data = await promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist yet, return an empty array
                return [];
            }
            throw new Error('Error reading carts: ' + error.message);
        }
    }

    async saveCarts(carts) {
        try {
            await promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error('Error saving carts: ' + error.message);
        }
    }

}

export default CartManager;