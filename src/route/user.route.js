import { Router } from "express";

export default class UserRouter {
    constructor()
    {
        this.router = Router();
        this.setupRoutes();
    }
    setupRoutes()
    {
        // // [GET] gell all users (Admin)
        // this.router.get('/', )
        // // [POST] create new user (Admin)
        // this.router.post('/', );
        // // [PUT] update user by id (Admin)
        // this.router.put('/:id', );
        // // [DELETE] delete user by id (Admin)
        // this.router.delete('/:id', );
        // // [GET] get profile (Admin and User)
        // this.router.get('/me', );
        // // [PUT] update profile
    }
    getRoute()
    {
        return this.router;
    }

}