import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Extract the token from the "Authorization" header
  if (!token)
    return res
      .status(401)
      .json({ statusCode: 401, message: "Access denied. Unauthorized." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the decoded payload (e.g., user ID, role) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res
      .status(403)
      .json({ statusCode: 403, message: "Invalid or expired token." });
  }
};

export { authenticateToken,  };