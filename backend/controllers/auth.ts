import express from "express";
import jwt, {Jwt, JwtPayload, Secret, VerifyErrors} from "jsonwebtoken";
import User from "../util/User";
import AuthUtil from "../util/AuthUtil";
import {UserToken} from "../util/interfaces/UserToken";

const router = express.Router();

// TODO: should be replaced with the database
const users: User[] = [
    {
        id: '1',
        username: 'tom',
        password: 'password123admin',
        role: 'admin'
    },
    {
        id: '2',
        username: 'shirin',
        password: 'password123member',
        role: 'member'
    }
];

router.post('/', (req: express.Request, res: express.Response) => {

    // TODO: outsourcing login
    const {username, password} = req.body;

    const actualUser: UserToken = users.find(user => {
       return user.username === username
           && user.password === password;
    });

    if (!actualUser) {
        res.status(404).json({
            err: 'Password or Username doesn\'t match',
        })

    }
    else {
        // Send JWT
        res.status(200).json({
            accessToken: AuthUtil.generateAccessToken(actualUser),
            refreshToken: AuthUtil.generateRefreshToken(actualUser)
        });
    }

});

router.post('/token', (req: express.Request, res: express.Response) => {
    const {token} = req.body;

    if (!token) {
        res.sendStatus(401);
    }
    else if (!AuthUtil.refreshTokens.includes(token as string)) { // TODO: Refreshers in db
        res.sendStatus(403);
    }
    else {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as Secret, (err: VerifyErrors, user: JwtPayload) => {
            if (err) {
                res.sendStatus(403);
            }
            else {
                const actualUser: UserToken = {
                    username: token.username,
                    role: token.role
                };

                res.json({
                    accessToken: AuthUtil.generateAccessToken(actualUser),
                });
            }
        });
    }
});

router.post('/logout', (req: express.Request, res: express.Response) => {
    const {token} = req.body;
    AuthUtil.refreshTokens = AuthUtil.refreshTokens.filter(t => t !== token);

    res.status(200).json({
        message: 'Logout successful',
    })
});

export {router as authController};