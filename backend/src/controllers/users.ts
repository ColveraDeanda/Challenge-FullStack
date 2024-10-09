import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import { authentication, random } from "../util/auth";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select('+email').exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}


interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!username || !email || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        const salt = random();

        const newUser = await UserModel.create({
             username: username,
             email: email,
             authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ username: username }).select('+authentication.salt +authentication.password').exec();

        if (!user || !user.authentication || !user.authentication.salt || user.authentication.password !== authentication(user.authentication.salt, password)) {
            return res.sendStatus(403);
        }

        req.session.userId = user._id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            next(err);
        } else {
            res.sendStatus(200);
        }
    });
};
