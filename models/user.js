// 3rd party modules
import mongoose from "mongoose";

// creating the user schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tokens: { type: Number, default: 50000 },
});

export default mongoose.model("User", userSchema);
