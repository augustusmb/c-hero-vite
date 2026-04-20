export const errorHandler = (err, req, res, _next) => {
  console.error(`[${req.method} ${req.originalUrl}]`, err);

  if (res.headersSent) return;

  // Postgres unique-constraint violation
  if (err.code === "23505") {
    const constraint = err.constraint || "";
    const detail = err.detail || "";
    const isPhone = constraint.includes("phone") || detail.includes("phone");
    return res.status(409).json({
      success: false,
      field: isPhone ? "phone" : null,
      error: isPhone
        ? "This phone number is already registered."
        : "A record with this information already exists.",
    });
  }

  // Postgres foreign-key violation
  if (err.code === "23503") {
    return res.status(400).json({
      success: false,
      error: "Invalid reference to related data",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.expose ? err.message : "Internal server error",
  });
};
