import User from '../Models/user.model.js';
import { body, validationResult } from 'express-validator';

export const searchUser = async (req, res) => {

    let { query } = req.body;

    User.find({ "personal_info.username": new RegExp(query, 'i') })
        .limit(50)
        .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .then(users => {
            return res.status(200).json({ users });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const getProfile = async (req, res) => {

    let { username } = req.body;

    User.findOne({ "personal_info.username": username })
        .select("-personal_info.password -google_auth -updatedAt -projects")
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const updateProfileImg = async (req, res) => {

    let { url } = req.body;

    User.findOneAndUpdate({ _id: req.user }, { "personal_info.profile_img": url })
        .then(() => {
            return res.status(200).json({ profile_img: url });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

// Validators for updateProfile
const updateProfileValidators = [
    body("username").isString().trim().isLength({ min: 3 }).withMessage("Username should be atleast 3 characters long"),
    body("bio").optional({ nullable: true }).isString().trim().isLength({ max: 150 }).withMessage("Bio should be less than 150 characters"),
    body("social_links.website").optional({ nullable: true, checkFalsy: true }).isURL().withMessage("Website must be a valid URL"),
];

// Export single controller that runs validators imperatively
export const updateProfile = async (req, res) => {
    // Run validators
    await Promise.all(updateProfileValidators.map(v => v.run(req)));

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstMsg = errors.array()[0]?.msg || 'Invalid input';
        return res.status(403).json({ error: firstMsg });
    }

    let { username, bio, social_links } = req.body;

    let bioLimit = 150;

    // manual checks for username and bio are now handled by express-validator

    let socialLinksArr = Object.keys(social_links || {});

    try {
        for (let i = 0; i < socialLinksArr.length; i++) {
            if (social_links[socialLinksArr[i]].length) {
                let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

                if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website') {
                    return res.status(403).json({ error: `${socialLinksArr[i]} link is invalid. You must enter a full link` });
                }
            }
        }
    } catch (err) {
        return res.status(500).json({ error: "You must provide full social links with http(s) included" });
    }

    let updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    }

    User.findOneAndUpdate({ _id: req.user }, updateObj, {
        runValidators: true
    })
        .then(() => {
            return res.status(200).json({ username });
        })
        .catch(err => {
            if (err.code === 11000) {
                return res.status(409).json({ error: "Username is already taken" });
            }
            return res.status(500).json({ error: err.message });
        })
}