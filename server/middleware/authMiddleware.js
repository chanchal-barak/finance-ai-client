const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
