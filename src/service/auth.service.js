import { ConflictRequestError, AuthFailureError, BadRequestError, NotFoundError } from "../handler/error.response.js";
import { randomToken } from "../utils/token.util.js";
export default class AuthService {
    constructor(User, AuthUtil)
    {
        this.userModel = User;
        this.authUtil = AuthUtil;
    }
    registerService = async (data) => {
        // check email exist
        const existingEmail = await this.userModel.findOne({email: data.email});
        if (existingEmail)
        {
            throw new ConflictRequestError("This email already exist");
        }
        const existingUsername = await this.userModel.findOne({username: data.username});
        if (existingUsername)
        {
            throw new ConflictRequestError("This username already exist");
        }
        const hashedPassword = await this.authUtil.hashPassword(data.password);
        const newUser = new this.userModel(
            {
                name: data.name, 
                age: data.age, 
                email: data.email,
                username: data.username, 
                password: hashedPassword,
                role: "User"
            }
        )
        await newUser.save();
        const { id, age, email, username, role } = newUser;
        const user = { id, age, email, username, role };
        if (!user)
        {
            throw new BadRequestError("Client Bad Request!");
        }
        return user;
    }
    loginService = async (data) => {
        // find user by username in database
        const user = await this.userModel.findOne({username: data.username});
        const { id, username, role } = user;
        if (user)
        {
            // compare password
            const check = await this.authUtil.comparePassword(data.password, user.password);
            if (!check)
            {
                throw new BadRequestError("Password is incorrect!");
            }
            else {
                // init accesstoken and refreshtoken => push refreshtoken to array  
                const accessToken = this.authUtil.signAccessToken({id, username, role});
                const refreshToken = this.authUtil.signRefreshToken({id, username, role});
                return {
                    data: {
                        accessToken: accessToken, 
                        refreshToken: refreshToken
                    },
                    msg: "Login successfully!"
                };
            }
        }
        else {
            throw new NotFoundError("Username not found!");
        }
    }
    refreshTokenService = async (req) => {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken)
        {
            // this token is not expired => sign new accessToken and refreshToken
            const { id, username, role } = this.authUtil.verifyRefreshToken(refreshToken);
            const newPayload = {id, username, role};
            const newAccessToken = this.authUtil.signAccessToken(newPayload);
            const newRefreshToken = this.authUtil.signRefreshToken(newPayload);
            return {
                data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
                msg: "This is new access token!"
            }
        }
        else {
            throw new AuthFailureError("Refresh token not found!");
        }
    }
    // forgotPasswordService = async (email) => {
    //     const user = await this.userModel.findOne({email: email});
    //     if (!user)
    //     {
    //         throw new NotFoundError("Email not found!");
    //     }
    //     // email exist => create random token 
    //     const token = randomToken();
    //     const expires = new Date(Date.now() + 10 * 60 * 1000);
    //     user.passwordResetToken = token;
    //     user.passwordResetExpiration = expires;
    //     await user.save();
        
    //     // call send mail 
    //     // emailFrom, emailTo, emailSubject, emailText
    //     const objectMail = {
    //         emailFrom: process.env.SMTP_USER,
    //         emailTo: email,
    //         emailSubject: "RESET PASSWORD",
    //         emailText: token
    //     }
    //     console.log(objectMail);
    //     try {
    //         await mailService.sendEmail(objectMail);
    //         return {
    //             success: true,
    //             message: "Send mail successfully!"
    //         }
    //     }
    //     catch (error)
    //     {
    //         console.error("Mail error:", error);
    //         return {
    //             success: false,
    //             errMessage: error.message
    //         }
    //     }
    // }
}