const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    // Verifica se o cabeçalho de autorização está presente
    if (!authHeader) {
        return res.status(403).json({ message: "Cabeçalho de autorização não fornecido" });
    }

    const token = authHeader.split(" ")[1]; // Extrai o token do cabeçalho
    if (!token) {
        return res.status(403).json({ message: "Token não fornecido" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido ou expirado" });
        }

        // Verifique o conteúdo do token decodificado
        console.log("Token decodificado:", decoded); // Adicione este log para verificar o conteúdo

        // Atribua o payload decodificado ao `req.user`
        req.user = {
            id: decoded.id,  // Certifique-se de que o campo "id" está presente no token
            username: decoded.username  // Verifique se o nome de usuário está presente também
        };

        next();  // Prossegue para a próxima função middleware ou rota
    });
};

module.exports = authMiddleware;
