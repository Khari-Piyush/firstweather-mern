import express from "express";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign(
        {userId: user._id, isAdmin: user.isAdmin},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
};

router.post("/register", async (req, res) => {
    try{
        const {firstName, lastName, email, password, isAdmin } = req.body;

        // basic validation
        if( !firstName || !email || !password ) {
            return res.status(400).json({message: "Please provide FIRST NAME, EMAIL AND PASSWORD"});
        }

        // check existing user
        const existing =  await User.findOne({email});
        if( existing ) {
            return res.status(400).json({message: "Email already registered"});
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password,10);

        // create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false, // baad mai hum isse restrict kar denge
        });

        // optionally auto login after register
        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err ) {
        console.error("Register Error: ", err);
        res.status(500).json({ message: "Server Error"});
    }
})

router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;

        // basic validation
        if( !email || !password ) {
            return res.status(400).json({ message: "Please provide EMAIL and PASSWORD"});
        }

        const user = await User.findOne({ email });
        if( !user ) {
            return res.status(400).json({ message: "Invalid Email or Password"});
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if( !isMatch ) {
            return res.status(400).json( { message: "Invalid Email or Password" } );
        }

        const token = generateToken(user);

        res.json({
            message: "Login Successfull",
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        console.error("Login Error", err);
        res.status(500).json({message: "Server Error"});
    }
});

import { protect, adminOnly } from "../middleware/authMiddleware.js";

// ...

router.get("/me", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});


export default router;