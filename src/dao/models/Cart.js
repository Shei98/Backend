import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
});

export const Cart = mongoose.model('carts', cartSchema);

export default Cart;