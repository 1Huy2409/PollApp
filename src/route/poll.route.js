import { Router } from "express";

export default class PollRoute {
    constructor()
    {
        this.router = Router();
        this.setupRoutes();
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