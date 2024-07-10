import { genarateTokenAndSetCookie } from "../lib/utils/genarateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, email } = req.body;

        // testing validity of email ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Checking if username already exists ---
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // checking if email already exists ---
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        // Checking validity of password ---
        if (password.length < 6) {
            return res.status(400).json({ error: "Passwords must be atleast 6 characters long" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // creating new user ---
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        })

        // if (newUser) {
        //     // Genarating JWT token ---
        //     genarateTokenAndSetCookie(newUser._id, res);
        //     await newUser.save();

        //     res.status(201).json({
        //         _id: newUser._id,
        //         fullName: newUser.fullName,
        //         username: newUser.username,
        //         email: newUser.email,
        //     })
        // } else {
        //     res.status(400).json({ error: "Invalid user data" });
        // }

        await newUser.save();
        const payload = { user: { id: newUser.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // genarateTokenAndSetCookie(user._id, res);
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // res.status(200).json({
        //     _id: user._id,
        //     fullName: user.fullName,
        //     username: user.username,
        //     email: user.email,
        // });

        res.json({ token });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};