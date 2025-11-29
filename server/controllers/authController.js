import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function loginController(req, res) {
  try {
    const { username, password } = req.body;

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function registerController(req, res) {
  try {
    const { username, password, email } = req.body;

    const hashed = await bcrypt.hash(password, 12);

    await User.create({ username, email, password: hashed });
    let token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    res.cookie("token",token)
    return res.status(201).json({ success: true, message: "User created",token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
