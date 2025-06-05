import { Router } from "express";
import User from "../model/user.model.js";
import AuthController from "../controller/auth.controller.js";
import AuthService from "../service/auth.service.js";
import AuthValidator from "../middleware/auth.middleware.js";
import AuthUtil from "../utils/auth.util.js";
import asyncHandler from "../middleware/asyncHandler.js";
export default class AuthRoute{
    constructor()
    {
        this.router = Router();
        this.authController = new AuthController(new AuthService(User, new AuthUtil()));
        this.authValidator = new AuthValidator();
        this.setupRoutes();
    }
    setupRoutes()
    {
        // [POST] /register
        this.router.post('/register', asyncHandler(this.authValidator.registerValidate), asyncHandler(this.authController.registerController));
        // [POST] /login
        this.router.post('/login', asyncHandler(this.authValidator.loginValidate), asyncHandler(this.authController.loginController));
        // [POST] /processNewToken
        this.router.post('/processNewToken', asyncHandler(this.authController.refreshTokenController));
        // [POST] /logout
        this.router.post('/logout',asyncHandler(this.authValidator.checkAuth), asyncHandler(this.authController.logoutController));
    }
    getRoute()
    {
        return this.router;
    }
}