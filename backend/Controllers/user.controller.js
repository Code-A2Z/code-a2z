import User from '../Models/user.model.js';

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

export const updateProfile = async (req, res) => {

    let { username, bio, social_links } = req.body;

    let bioLimit = 150;

    if (username.length < 3) {
        return res.status(403).json({ error: "Username should be atleast 3 characters long" });
    }

    if (bio.length > bioLimit) {
        return res.status(403).json({ error: `Bio should be less than ${bioLimit} characters` });
    }

    let socialLinksArr = Object.keys(social_links);

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