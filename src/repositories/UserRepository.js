// src/repositories/UserRepository.js
const User = require("../models/User");

class UserRepository {
    async getAllUsers() {
        return await User.findAll();
    }

    async getUserById(id) {
        return await User.findByPk(id);
    }

    async getUserByEmail(email) {
        return await User.findOne({ where: { email } });
    }
    
    async createUser(userData) {
        return await User.create(userData);
    }
}

module.exports = new UserRepository();
