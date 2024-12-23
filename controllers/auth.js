// 3rd party modules
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

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
