import { OK } from "../handler/success.response.js";
export default class PollController {
    constructor(PollService) {
        this.pollService = PollService;
    }
    getAllPolls = async (req, res, next) => {
        try
        {
            const {polls, total, page, limit} = await this.pollService.getAllPolls(req);
            new OK({
                message: "Get all polls successfully!",
                metadata: {
                    polls: polls,
                    total: total,
                    page: page,
                    limit: limit
                }
            }).send(res);
        }
        catch(error)
        {
            next(error);
        }
    }
    getPollById = async(req, res, next) => {
        try
        {
            const id = req.params.id;
            const poll = await this.pollService.getPollById(id);
            new OK({
                message: "Get poll by id successfully!",
                metadata: poll,
            }).send(res);
        }
        catch(error)
        {
            next(error);
        }
    }
    addPoll = async(req, res, next) => {
        try
        {
            const {id, username} = req.user;
            const {title, description, options} = req.body;
            const data = {
                title: title, 
                description: description, 
                options: options,
                creator: {
                    id: id,
                    username: username
                }
            }
            const newPoll = await this.pollService.addPoll(data);
            new OK({
                message: "Add poll successfully!",
                metadata: newPoll,
            }).send(res);
        }
        catch(error)
        {
            next(error)
        }
    }
    putPoll = async (req, res, next) => {
        try
        {
            const id = req.params.id;
            const poll = req.body;
            const updatedPoll = await this.pollService.putPoll(id, poll);
            new OK({
                message: "Put user successfully!",
                metadata: updatedPoll,
            }).send(res);
        }
        catch(error)
        {
            next(error);
        }
    }
    deletePoll = async (req, res, next) => {
        try {
            const id = req.params.id;
            const deletedPoll = await this.pollService.deletePoll(id);
            new OK({
                message: "Deleted poll successfully!",
                metadata: deletedPoll
            }).send(res);
        } 
        catch (error) {
            next(error);
        }
    }
    votePoll = async (req, res, next) => {
        try
        {
            const {pollId, optionId} = req.params;
            const {id, username} = req.user;
            const voteInfo = {id, username, pollId, optionId};
            await this.pollService.votePoll(voteInfo);
            new OK({
                message: "Vote successfully!",
            }).send(res);
        }   
        catch(error)
        {
            next(error);
        } 
    }
    addOption = async (req, res, next) => {
        try
        {
            const pollId = req.params.pollId;
            const { text } = req.body;
            const data = { text, pollId };
            await this.pollService.addOption(data);
            new OK({
                message: "Add option successfully!",
            }).send(res);
        }
        catch(error)
        {
            next(error);
        }
    }
    removeOption = async (req, res, next) => {
        try
        {
            const {pollId, optionId} = req.params;
            const data = {pollId, optionId};
            await this.pollService.removeOption(data);
            new OK({
                message: "Remove option successfully!"
            }).send(res);
        }
        catch(error)
        {
            next(error);
        }
    }
}