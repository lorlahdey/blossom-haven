const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({statusCode: 403, message: "Access denied. Insufficient permissions." });
    }
    next(); // Proceed if the user has the required role
  };
};


export { authorizeRole };