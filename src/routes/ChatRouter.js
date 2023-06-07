import { Router } from 'express';
import Chat from '../dao/models/Chat.js';

class ChatRouter {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/', this.getChats.bind(this));
        this.router.post('/', this.addChat.bind(this));
    }

    async getChats(req, res) {
        try {
            const chats = Chat.find();
            res.json(chats);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los mensajes de chat', message: error.message });
        }
    }

    async addChat(req, res) {
        try {
            const { user, message, createdAt } = req.body;
            const newChat = new Chat({ user: user, message: message, createdAt: createdAt });
            await newChat.save();
            res.json(newChat);
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el mensaje de chat', message: error.message });
        }
    }
}

export default ChatRouter;
