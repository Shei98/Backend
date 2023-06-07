import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

export const Chat = mongoose.model('chat', chatSchema);

export default Chat;
