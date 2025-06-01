import jwt from 'jsonwebtoken'
import { AuthFailureError, BadRequestError } from '../handler/error.response.js';
import AuthUtil from '../utils/auth.util.js';
export default class AuthValidator {
    constructor ()
    {
        this.authUtil = new AuthUtil();
    }

    // validate register
    registerValidate = async (req, res, next) => {
        try
        {
            const user = req.body;
            if (!user.name || !user.age || !user.email || !user.username || !user.password)
            {
                throw new BadRequestError("Nhập thiếu thông tin!");
            }
            // validate name
            if (user.name.trim().length < 10) {
                throw new BadRequestError("Name must be at least 10 characters");
            }
            // validate age
            const age = parseInt(user.age);
            if (isNaN(age) || age <= 0 || age > 100) {
                throw new BadRequestError("Age is invalid");
            }
            // validate email (regex and duplicate email)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const checkEmail = emailRegex.test(user.email);
            if (!checkEmail) {
                throw new BadRequestError("Email is invalid");
            }
            // validate username (length and duplicate)
            if (user.username.trim().length < 5) {
                throw new BadRequestError("Username must be at least 5 characters");
            }
            // validate password (minlength = 5)
            if (user.password.trim().length < 5)
            {
                throw new BadRequestError("Password must be at least 5 characters");
            }
            next();
        }
        catch (error)
        {
            next (error);
        }
    }
    // validate login
    loginValidate = async (req, res, next) => {
        try
        {
            const user = req.body;
            if (!user.username)
            {
                throw new BadRequestError("Please enter username");
            }
            if (!user.password)
            {
                throw new BadRequestError("Please enter password");
            }
            next();
        }
        catch (error)
        {
            next(error);
        }
    }
    checkAuth = async (req, res, next) => {
        try
        {
            const bearerToken = req.headers['authorization'];
            if (!bearerToken) {
                throw new AuthFailureError("You 're not authenticated!");
            }
            const token = bearerToken.split(' ')[1];
            // const decode = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            try
            {
                var decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
                req.user = decoded;
                next();
            }
            catch(err)
            {
                throw err;
            }
        }
        catch (error)
        {
            next(error);
        }
    }
    // authorization here
    checkAdmin = async (req, res, next) => {
        this.checkAuth(req, res, async (err) => {
            if (err) return next(err);
            try {
                if (req.user.role == "Admin")
                {
                    next();
                }
                else
                {
                    throw new AuthFailureError("You 're not allowed to do that!");
                }
            }
            catch (error)
            {
                next(error);
            }
        })
    }
    checkUpdateProfile = async (req, res, next) => {
        this.checkAuth(req, res, async (err) => {
            if (err) return next(err);
            // check role == "Admin" || id = req.params.id
            try
            {
                const id = req.params.id;
                if (req.user.role == "Admin")
                {
                    next();
                }                
                else
                {
                    if (id == req.user.id)
                    {
                        next();
                    }
                    else
                    {
                        throw new AuthFailureError("You're not allowed to do that!");
                    }
                }
            }
            catch (error)
            {
                next(error);
            }
        })
    }
}