import { Router } from "express";
import AuthValidator from "../middleware/auth.middleware.js";
import PollValidator from "../middleware/poll.middleware.js";
import Poll from "../model/poll.model.js"
import Vote from "../model/vote.model.js";
import PollService from "../service/poll.service.js";
import PollController from "../controller/poll.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";
export default class PollRoute {
    constructor()
    {
        this.router = Router();
        this.authValidator = new AuthValidator();
        this.pollValidator = new PollValidator();
        this.pollController = new PollController(new PollService(Poll, Vote));
        this.setupRoutes();
    }
    setupRoutes()
    {
        // [GET] get all polls (admin & user)
        this.router.get('/',asyncHandler(this.authValidator.checkAuth), asyncHandler(this.pollController.getAllPolls))
        // [GET] get poll by id (admin & user)
        this.router.get('/:id',asyncHandler(this.authValidator.checkAuth), asyncHandler(this.pollController.getPollById));
        // [POST] add new poll (admin)
        this.router.post('/', asyncHandler(this.authValidator.checkAdmin), asyncHandler(this.pollValidator.checkAddPoll), asyncHandler(this.pollController.addPoll));
        // [PUT] update poll (admin)
        this.router.put('/:id', asyncHandler(this.authValidator.checkAdmin), asyncHandler(this.pollValidator.checkUpdatePoll), asyncHandler(this.pollController.putPoll));
        // [DELETE] delete poll (admin)
        this.router.delete('/:id',asyncHandler(this.authValidator.checkAdmin), asyncHandler(this.pollController.deletePoll))

        // feature vote and unvote option in poll for user
        // [POST] vote an option
        this.router.post('/:pollId/vote/:optionId',asyncHandler(this.authValidator.checkAuth), asyncHandler(this.pollController.votePoll))
        // [POST] add option
        this.router.post('/:pollId', asyncHandler(this.authValidator.checkAdmin), asyncHandler(this.pollValidator.checkAddOption), asyncHandler(this.pollController.addOption));
        // [DELETE] remove option
        this.router.delete('/:pollId/:optionId', asyncHandler(this.authValidator.checkAdmin), asyncHandler(this.pollController.removeOption));

    }
    getRoute()
    {
        return this.router;
    }
}