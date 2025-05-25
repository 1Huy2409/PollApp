export default asyncHandler = (fx) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
