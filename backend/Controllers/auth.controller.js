import bcrypt from "bcrypt";
import { readFileSync } from "fs";

import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
const serviceAccountKey = JSON.parse(readFileSync("./firebase-adminsdk.json", "utf-8"));

import User from "../Models/user.model.js";
import { formatDataToSend, generateUsername, emailRegex, passwordRegex } from "../utils/helpers.js";

export const signup = async (req, res) => {
    let { fullname, email, password } = req.body;

    if (fullname.length < 3) return res.status(400).json({ error: "Full name should be at least 3 letters long" });
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email" });
    if (!passwordRegex.test(password)) return res.status(400).json({
        error: "Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
    });

    try {
        const hashed_password = await bcrypt.hash(password, 10);
        const username = await generateUsername(email);

        const user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        });

        const savedUser = await user.save();
        return res.status(201).json(formatDataToSend(savedUser));
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ error: "User with this email already exists" });
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    let { email, password } = req.body;

    try {
        const user = await User.findOne({ "personal_info.email": email });
        if (!user) return res.status(404).json({ error: "Email not found" });

        if (user.google_auth) return res.status(403).json({ "error": "This email was signed up with google. Please log in with google to access the account." });

        const isMatch = await bcrypt.compare(password, user.personal_info.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        return res.status(200).json(formatDataToSend(user));
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Google Authorization using Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

export const googleAuth = async (req, res) => {
    let { access_token } = req.body;

    try {
        getAuth()
            .verifyIdToken(access_token)
            .then(async (decodedUser) => {

                let { email, name } = decodedUser;

                let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
                    return u || null;
                })
                    .catch(err => {
                        return res.status(500).json({ "error": err.message });
                    })

                if (user) {
                    // login
                    if (!user.google_auth) {
                        return res.status(403).json({ "error": "This email was signed up without google. Please log in with password to access the account." });
                    }
                } else {
                    //signup
                    let username = await generateUsername(email);
                    user = new User({
                        personal_info: {
                            fullname: name,
                            email,
                            username
                        },
                        google_auth: true
                    })
                    await user.save().then((u) => {
                        user = u;
                    })
                        .catch(err => {
                            return res.status(500).json({ "error": err.message });
                        })
                }

                return res.status(200).json(formatDataToSend(user));
            })
            .catch(err => {
                return res.status(500).json({ "error": err.message });
            })
    } catch (err) {
        return res.status(500).json({ "error": err.message });
    }
};