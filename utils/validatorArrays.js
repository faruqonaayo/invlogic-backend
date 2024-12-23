// 3rd party modules
import { body } from "express-validator";

//validators
export const signupValidator = [
  body("firstName")
    .isLength({ min: 2 })
    .withMessage("First name should be a minimum of 2 characters")
    .isAlpha()
    .withMessage("First name should be alphabets only"),
  body("lastName")
    .isLength({ min: 2 })
    .withMessage("Last name should be a minimum of 2 characters")
    .isAlpha()
    .withMessage("Last Name should be alphabets only"),
  body("username")
    .isLength({ min: 5 })
    .withMessage("Username should be a minimum of 5 characters"),
  body("email", "Enter a valid email").isEmail(),
  body("password")
    .isStrongPassword({
      minLength: 7,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password should be a minimum of 7 characters, a minimum of a SINGLE UPPER case,a minimum of a SINGLE LOWER case,minimum of a NUMBER,a minimum of a SYMBOL"
    ),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password does not match");
      }
      return true;
    })
    .withMessage("Passwords does not match"),
];
