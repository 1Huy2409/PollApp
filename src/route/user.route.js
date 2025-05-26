import { Router } from "express";
import User from "../model/user.model.js";
import Vote from "../model/vote.model.js";
import UserService from "../service/user.service.js";
import UserController from "../controller/user.controller.js";
import AuthUtil from "../utils/auth.util.js";
import asyncHandler from "../middleware/asyncHandler.js";
import UserValidator from "../middleware/user.middleware.js";
import AuthValidator from "../middleware/auth.middleware.js";
export default class UserRouter {
    constructor()
    {
        this.router = Router();
        this.userController = new UserController(new UserService(User, new AuthUtil(), Vote));
        this.userValidator = new UserValidator();
        this.authValidator = new AuthValidator();
        this.setupRoutes();
    }
    setupRoutes()
    {
        // [GET] gell all users (Admin)
        this.router.get('/', asyncHandler(this.userController.getAllUsers))
        // [GET] get profile (Admin and User)
        this.router.get('/me', asyncHandler(this.authValidator.checkAuth), asyncHandler(this.userController.getMe));
        // [POST] create new user (Admin)
        this.router.post('/', asyncHandler(this.userValidator.checkField) ,asyncHandler(this.userController.addUser));
        // [DELETE] delete user by id (Admin)
        this.router.delete('/:id', asyncHandler(this.userController.deleteUser));
        // [GET] get user by id
        this.router.get('/:id', asyncHandler(this.userController.getUserById));
        // [PUT] update user by id (Admin)
        this.router.put('/:id', asyncHandler(this.userValidator.checkField), asyncHandler(this.userController.putUser));
    }
    getRoute()
    {
        return this.router;
    }

}