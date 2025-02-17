import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }

    req.user = user;
    console.log(user);
    next();
  });
};

export const generateToken = (walletAddress) => {
  return jwt.sign({ walletAddress }, process.env.JWT_SECRET, {
    expiresIn: "1h", 
  });
};
