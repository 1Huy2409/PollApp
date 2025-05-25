class UserValidator {
  constructor() {}
  checkField = async (req, res, next) => {
    try {
      const user = req.body;
      if (
        !user.name ||
        !user.age ||
        !user.email ||
        !user.username ||
        !user.password
      ) {
        throw new BadRequestError("Nhập thiếu thông tin!");
      }
      // validate name
      if (user.name.trim().length < 10) {
        throw new BadRequestError("Name must be at least 10 characters");
      }
      // validate age
      const age = parseInt(user.age);
      if (isNaN(age) || age <= 0 || age > 100) {
        throw new BadRequestError("Age is invalid");
      }
      // validate email (regex and duplicate email)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const checkEmail = emailRegex.test(user.email);
      if (!checkEmail) {
        throw new BadRequestError("Email is invalid");
      }
      // validate username (length and duplicate)
      if (user.username.trim().length < 5) {
        throw new BadRequestError("Username must be at least 5 characters");
      }
      // validate password (minlength = 5)
      if (user.password.trim().length < 5) {
        throw new BadRequestError("Password must be at least 5 characters");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default UserValidator;
