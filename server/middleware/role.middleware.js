// Usage: router.get('/route', protect, authorize('admin'), handler)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Access denied. Role '${req.user?.role || "unknown"}' is not authorized for this route`
      );
    }
    next();
  };
};
