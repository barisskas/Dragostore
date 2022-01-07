module.exports = (req, res, next) => {
  res.locals.productScript = false;
  next();
};
