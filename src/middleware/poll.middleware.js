import { BadRequestError } from "../handler/error.response.js";

export default class PollValidator {
    constructor() {}
    checkAddPoll = async (req, res, next) =>
    {
        try {
            const data = req.body;
            if (!data.title || !data.description || !data.options)
            {
                throw new BadRequestError("Please fill in all information!")
            }
            if (data.title.trim().length < 10)
            {
                throw new BadRequestError("Title must be at least 10 characters!");
            }
            if (data.description.trim().length < 10)
            {
                throw new BadRequestError("Description must be at least 10 characters!");
            }
            if (data.options.length < 1)
            {
                throw new BadRequestError("Options must have at least one opiton!");
            }
            next();
        }
        catch (error)
        {
            next(error)
        }
    }
    checkUpdatePoll = async(req, res, next) =>
    {
        try
        {
            const data = req.body;
            console.log(data)
            if (!data.title || !data.description || !data.options || typeof data.isLocked !== "boolean")
            {
                throw new BadRequestError("Please fill in all information!")
            }
            if (data.title.trim().length < 5)
            {
                throw new BadRequestError("Title must be at least 10 characters!");
            }
            if (data.description.trim().length < 5)
            {
                throw new BadRequestError("Description must be at least 10 characters!");
            }
            if (data.options.length < 1)
            {
                throw new BadRequestError("Options must have at least one opiton!");
            }
            if (typeof data.isLocked !== "boolean")
            {
                throw new BadRequestError("Lock status is require and must be boolean!")
            }
            next();
        }
        catch (error)
        {
            next(error);
        }
    }
    checkAddOption = async(req, res, next) => {
        try
        {
            const data = req.body;
            if (!data.text)
            {
                throw new BadRequestError("Text option be required!");
            }
            next();
        }
        catch (error)
        {
            next(error);
        }
    }
}