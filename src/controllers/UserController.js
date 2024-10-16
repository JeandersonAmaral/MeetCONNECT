//src/controllers/UserController.js
const UserRepository = require("../repositories/UserRepository");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserController {
    async store(req, res) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        try {
            const existingUser = await UserRepository.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "Este email já está em uso." });
            }

            const user = await UserRepository.createUser({ name, email, password });
            res.status(201).json({ message: "Usuário criado com sucesso!", user });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }
            const token = jwt.sign({ id: user.id, username: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ message: "Login bem-sucedido!", token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUserInfo(req, res) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token não fornecido." });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
            res.json({ name: user.name });
        } catch (error) {
            res.status(401).json({ message: "Token inválido." });
        }
    }
}

module.exports = new UserController();
