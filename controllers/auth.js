// 3rd party modules
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// custom modules
import serverResponse from "../utils/serverResponse.js";
import User from "../models/user.js";

// controller functions

// function to create new Invlogic user
export async function createNewUser(req, res, next) {
  try {
    // user inputs
    const firstNameInput = req.body.firstName;
    const lastNameInput = req.body.lastName;
    const usernameInput = req.body.username;
    const emailInput = req.body.email;
    const passwordInput = req.body.password;

    // validation errors
    const { errors } = validationResult(req);

    // checking for validation errors
    if (errors.length > 0) {
      return serverResponse(res, 409, errors[0].msg);
    }

    // checking if email exists in the database already
    const emailExist = await User.findOne({ email: emailInput });
    // checking if username exists in the database already
    const usernameExist = await User.findOne({ username: usernameInput });

    if (emailExist) {
      return serverResponse(res, 409, "Email exists already");
    }

    if (usernameExist) {
      return serverResponse(res, 409, "Username exists already");
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(passwordInput, 12);

    // creating a new user
    const newUser = new User({
      firstName: firstNameInput,
      lastName: lastNameInput,
      username: usernameInput,
      email: emailInput,
      password: hashedPassword,
    });

    // saving new user
    await newUser.save();

    return serverResponse(res, 201, "User Created Sucessfully");
  } catch (error) {
    next(error);
  }
}

// function to log Invlogic users in
export async function postLogin(req, res, next) {
  try {
    //   user input
    const usernameOrEmailInput = req.body.usernameOrEmail;
    const passwordInput = req.body.password;

    let emailExist = await User.findOne({
      email: usernameOrEmailInput.toLowerCase(),
    });
    let usernameExist = await User.findOne({ username: usernameOrEmailInput });

    //   checking if either username or emai exists
    if (!emailExist && !usernameExist) {
      return serverResponse(res, 401, "Invalid email or password");
    }

    const userExist = emailExist || usernameExist;

    //   comparing user input and the database password
    const result = await bcrypt.compare(passwordInput, userExist.password);

    // checking if password match
    if (!result) {
      return serverResponse(res, 401, "Invalid password");
    }

    //    generating a jwt token
    const token = await jwt.sign(
      { id: userExist._id },
      process.env.JWT_SECRET,
      { expiresIn: 30 }
    );

    // user to be sent as a response
    const userDataToSend = {
      ...userExist.toObject(),
      password: "*******868948938284843****5775379885873794702******#@#$#!$!$",
    };

    return serverResponse(res, 200, "User Logged in Sucessfully", {
      ilToken: token,
      user: userDataToSend,
    });
  } catch (error) {
    next(error);
  }
}
