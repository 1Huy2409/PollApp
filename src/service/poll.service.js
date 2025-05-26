import { NotFoundError } from "../handler/error.response.js";

export default class PollService {
    constructor(Poll, Vote)
    {
        this.pollModel = Poll;
        this.voteModel = Vote;
    }
    getAllPolls = async (req) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;

        const skip = (page - 1) * limit;
        const total = await this.pollModel.countDocuments();
        const polls = await this.pollModel.find({isLocked: false}).skip(skip).limit(limit);
        return {polls, total, page, limit};
    }
    getPollById = async (id) => {
        const poll = await this.pollModel.findOne({_id: id});
        if (!poll)
        {
            throw new NotFoundError("Poll not found!");
        }
        return poll;
    }
    addPoll = async (poll) => {
        const newPoll = new this.pollModel(
            {
                title: poll.title,
                description: poll.description,
                options: poll.options,
                creator: poll.creator
            }
        )
        await newPoll.save();
        return newPoll;
    }
    putPoll = async (id, data) => {
        const poll = await this.pollModel.findOne({_id: id});
        if (poll)
        {
            await this.pollModel.updateOne({_id: id}, {
                title: data.title,
                description: data.description,
                options: data.options,
                isLocked: data.isLocked,
            })
            return poll;
        }
        else
        {
            throw new NotFoundError("Poll not found!");
        }
    }
    deletePoll = async (id) => {
        const poll = await this.pollModel.findOne({_id: id});
        if (!poll)
        {
            throw new NotFoundError("Poll not found!");
        }
        await this.pollModel.deleteOne({_id: id});
        await this.voteModel.deleteOne({pollId: id});
        return poll;
    }
    votePoll = async (voteInfo) => {
        const {id, username, pollId, optionId} = voteInfo;
        const poll = await this.pollModel.findOne({_id: pollId});
        if (!poll)
        {
            throw new NotFoundError("Poll not found!");
        }
        // check optionId exist
        const optionExisting = poll.options.find(item => item.id == optionId);
        if (!optionExisting)
        {
            throw new NotFoundError("Option not found!");
        }
        const userCheck = {id, username};
        // check user vote in this poll or not?
        const voteExisting = await this.voteModel.findOne({userId: id, pollId: pollId});
        if (voteExisting)
        {
            // already vote at this poll
            const optionIdBefore = voteExisting.optionId;
            if (optionIdBefore == optionExisting.id)
            {
                // unvote
                optionExisting.votes -= 1;
                optionExisting.userVotes = optionExisting.userVotes.filter(item => item.id != userCheck.id);
                await this.voteModel.deleteOne({pollId: pollId, userId: userCheck.id});
                poll.totalVotes -= 1;
            }
            else
            {
                // unvote then vote new one
                const oldOption = poll.options.find(item => item.id == optionIdBefore);
                oldOption.votes -= 1;
                oldOption.userVotes = oldOption.userVotes.filter(item => item.id != userCheck.id);
                optionExisting.votes += 1;
                optionExisting.userVotes.push({id: userCheck.id, username: userCheck.username});
                // update vote with new optionId
                await this.voteModel.updateOne({userId: userCheck.id, pollId: pollId}, {optionId: optionId})
            }
        }
        else
        {
            // create new vote for optionId in param
            optionExisting.votes += 1;
            optionExisting.userVotes.push({id: userCheck.id, username: userCheck.username});
            const newVote = new this.voteModel(
                {
                    userId: id,
                    pollId: pollId,
                    optionId: optionId
                }
            )
            await newVote.save();
            poll.totalVotes += 1;
        }
        // check user voted or not?
        // const userCheck = {id, username};
        // const existingVote = optionExisting.userVotes.find(item => item.id == userCheck.id && item.username == userCheck.username);
        // if (existingVote)
        // {
        //     // unvote
        //     optionExisting.votes -= 1;
        //     optionExisting.userVotes = optionExisting.userVotes.map(item => item.id != userCheck.id);
        //     poll.totalVotes -= 1;
        // }
        // else
        // {
        //     // vote
        //     optionExisting.votes += 1;
        //     optionExisting.userVotes.push({id: userCheck.id, username: userCheck.username});
        //     poll.totalVotes += 1;
        // }
        await poll.save();
        // return poll;
    }
    addOption = async (data) => {
        const {text, pollId} = data;
        // find poll by id
        const poll = await this.pollModel.findOne({_id: pollId});
        if (!poll)
        {
            throw new NotFoundError("Poll not found!");
        }
        await poll.updateOne({$push: {options: {text}}});
    }
    removeOption = async (data) => {
        // find poll
        const poll = await this.pollModel.findOne({_id: data.pollId});
        if (!poll)
        {
            throw new NotFoundError("Poll not found!");
        }
        // check option exist in this poll
        const optionExisting = poll.options.find(item => item.id == data.optionId);
        if (!optionExisting)
        {
            throw new NotFoundError("Option not found!");
        }
        poll.options.pull({_id: data.optionId})
        await poll.save();
    }
}