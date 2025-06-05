import { OK } from "../handler/success.response.js";
export default class UserController {
  constructor(UserService) {
    this.userService = UserService;
  }
  getAllUsers = async (req, res, next) => {
    try {
      const users = await this.userService.getAllUsers();
      new OK({
        message: "Get all users successfully!",
        metadata: users,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getUserById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await this.userService.getUserById(id);
      new OK({
        message: "Get user by id successfully!",
        metadata: user,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  addUser = async (req, res, next) => {
    try {
      const user = req.body;
      const newUser = await this.userService.addUser(user);
      new OK({
        message: "Add user successfully!",
        metadata: newUser,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  putUser = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = req.body;
      const updatedUser = await this.userService.putUser(id, user);
      new OK({
        message: "Updated user successfully!",
        metadata: updatedUser,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  deleteUser = async (req, res, next) => {
    try {
      const id = req.params.id;
      const deletedUser = await this.userService.deleteUser(id);
      new OK({
        message: "Deleted user successfully!",
        metadata: deletedUser
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getMe = async (req, res, next) => {
    const id = req.user.id;
    try {
      const user = await this.userService.getMe(id);
      new OK({
        message: "Get your account in4 successfully!",
        metadata: user,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
