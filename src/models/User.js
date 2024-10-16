//src/models/User.js
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/postgre");
const bcrypt = require("bcrypt");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Validação de formato de email
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Hook para hashear a senha antes de criar um usuário
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;
