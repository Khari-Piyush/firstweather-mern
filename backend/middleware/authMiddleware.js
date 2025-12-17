import jwt from "jsonwebtoken";

export const protect = (req, res, next ) => {
    const authHeader = req.headers.authorization;

    // expect: bearer token
    if( !authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Not Authorized, no token"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // dcecode: {userId, isAdmin, iat, exp}'
        req.user = decoded;
        next();
    } catch(err) {
        console.error("Token verification failed: ", err);
        return res.status(401).json({ message: "Not Authorized, token failed"} );
    }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};