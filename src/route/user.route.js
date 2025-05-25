import { Router } from "express";
export default class UserRouter {
    constructor()
    {
        this.router = Router();

    }
    setupRoutes()
    {
        // set up route api 
    }
    getRoute()
    {
        return this.router;
    }

}