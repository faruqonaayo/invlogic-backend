// 3rd party modules
import express from "express";

// custom modules
import * as authControllers from "../controllers/auth.js";
import { signupValidator } from "../utils/validatorArrays.js";

// express router app
const router = express.Router();

// router middleware
// router to create new user
router.put("/signup", signupValidator, authControllers.createNewUser);

export default router;
