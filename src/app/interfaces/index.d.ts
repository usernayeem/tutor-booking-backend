import { IRequestUser } from "./requestUser.interface.js";

// Augments Express's Request interface to include a `user` property.
// This is populated by the checkAuth middleware after token verification.
declare global {
    namespace Express {
        interface Request {
            user: IRequestUser;
        }
    }
}
