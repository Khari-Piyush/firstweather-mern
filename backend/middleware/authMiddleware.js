import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token = null;
  let usingCookie = false;

  // 1. httpOnly cookie (new approach)
  if (req.cookies?.auth_token) {
    token = req.cookies.auth_token;
    usingCookie = true;
  } else {
    // 2. Bearer header (transition: supports existing localStorage sessions)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not Authorized, no token" });
  }

  // CSRF validation — only when using cookie auth on state-changing requests
  if (usingCookie) {
    const method = req.method.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const csrfHeader = req.headers["x-csrf-token"];
      const csrfCookie = req.cookies?.csrf_token;
      if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
        return res.status(403).json({ message: "Invalid CSRF token" });
      }
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Not Authorized, token failed" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};
