import jwt from "jsonwebtoken";

function getJwtSecret(isRefresh = false) {
  const secret = isRefresh
    ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    : process.env.JWT_SECRET;

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret === "devsecret" || secret === "your-super-secret-jwt-key-change-this-in-production") {
      throw new Error("FATAL: Secure JWT secret is not configured in production environment!");
    }
  }

  return secret || "devsecret";
}

export function signToken(user) {
  const secret = getJwtSecret(false);
  return jwt.sign(user, secret, { expiresIn: "15m" }); // 15 minute session
}

export function signRefreshToken(user) {
  const secret = getJwtSecret(true);
  return jwt.sign(user, secret, { expiresIn: "7d" }); // 7 day refresh
}

export function verifyRefreshToken(token) {
  const secret = getJwtSecret(true);
  return jwt.verify(token, secret);
}

export function requireAuth(roles) {
  return (req, res, next) => {
    try {
      const raw = req.header("auth-token") || req.header("authorization") || "";
      const token = raw.replace(/^Bearer\s+/i, "");
      if (!token) return res.status(401).json({ message: "Missing token" });
      const secret = getJwtSecret(false);
      const user = jwt.verify(token, secret);
      if (roles && !roles.includes(user.role)) return res.status(403).json({ message: "Forbidden" });
      req.user = user;
      next();
    } catch (err) {
      if (err && err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please log in again" });
      }
      if (err && err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token signature" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}


