import UserRouter from "./user.route.js";
import PollRoute from "./poll.route.js";
import AuthRoute from "./auth.route.js";
export default (app) => {
    // route for user
    const userRoute = new UserRouter();
    const pollRoute = new PollRoute();
    const authRoute = new AuthRoute();
    app.use('/api/v1/users', userRoute.getRoute());
    app.use('/api/v1/polls', pollRoute.getRoute());
    app.use('/api/v1/auth', authRoute.getRoute());
}
