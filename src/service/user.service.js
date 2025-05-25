import { NotFoundError, ConflictRequestError } from "../handler/error.response.js";

class UserService {
    constructor(User, AuthUil) {
        this.userModel = User;
        this.authUtil = AuthUil;
    }
    getAllUsers = async () => {
        const users = await this.userModel.find({});
        return users;
    }
    getUserById = async (id) => {
        const user = await this.userModel.findOne({_id: id});
        if (!user)
        {
            throw new NotFoundError("User not found!");
        }
        return user;
    }
    addUser = async (user) => {
        const hashedPassword = await this.authUtil.hashPassword(user.password)
        // check email & username duplicate
        const emailExisting = await this.userModel.findOne({email: user.email});
        if (emailExisting)
        {
            throw new ConflictRequestError("This email already exists!")
        }
        const usernameExisting = await this.userModel.findOne({username: user.username});
        if (usernameExisting)
        {
            throw new ConflictRequestError("This username already exists!")
        }
        const newUser = new this.userModel(
            {
                name: user.name,
                age: user.age,
                email: user.email,
                username: user.username,
                password: hashedPassword,
                role: "User"
            }
        )
        await newUser.save();
        return newUser;
    }
    putUser = async (id, data) => {
        const user = await this.userModel.findOne({_id: id});
        if (user)
        {
            const emailExisting = await this.userModel.findOne({email: data.email, _id: {$ne: id}});
            if (emailExisting)
            {
                throw new ConflictRequestError("This email already exists!");
            }
            const usernameExisting = await this.userModel.findOne({username: data.username, _id: {$ne: id}});
            if (usernameExisting)
            {
                throw new ConflictRequestError("This username already exists!");
            }
            const hashedPassword = await this.authUtil.hashPassword(data.password);
            // cập nhật lại thông tin cho user
            await this.userModel.updateOne({_id: id}, {
                name: data.name, 
                age: data.age,
                email: data.email,
                username: data.username,
                password: hashedPassword
            })
            return user;
        }
        else {
            throw new NotFoundError("User not found!");
        }
    }
    deleteUser = async (id) => {
        const user = await this.userModel.findOne({_id: id});
        if (!user)
        {
            throw new NotFoundError("User not found!");
        }
        await this.userModel.deleteOne({_id: id});
        return user;
    }
    getMe = async (id) => {
        const user = this.userModel.findOne({_id: id})
        if (!user)
        {
            throw new NotFoundError("User not found!");
        }
        return user;
    }
}

export default UserService;