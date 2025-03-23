import Project from "../Models/project.model.js";
import Notification from "../Models/notification.model.js";

export const likeProject = async (req, res) => {
    let user_id = req.user;

    let { _id, islikedByUser } = req.body;

    let incrementVal = !islikedByUser ? 1 : -1;

    Project.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementVal } })
        .then(project => {
            if (!islikedByUser) {
                let like = new Notification({
                    type: "like",
                    project: _id,
                    notification_for: project.author,
                    user: user_id
                });

                like.save().then(notification => {
                    return res.status(200).json({ liked_by_user: true });
                })
            } else {
                Notification.findOneAndDelete({ type: "like", project: _id, user: user_id })
                    .then(() => {
                        return res.status(200).json({ liked_by_user: false });
                    })
                    .catch(err => {
                        return res.status(500).json({ error: err.message });
                    })
            }
        })
}

export const likeStatus = async (req, res) => {
    let user_id = req.user;

    let { _id } = req.body;

    Notification.exists({ type: "like", project: _id, user: user_id })
        .then(isLiked => {
            return res.status(200).json({ isLiked });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const newNotification = async (req, res) => {

    let user_id = req.user;

    Notification.exists({ notification_for: user_id, seen: false, user: { $ne: user_id } })
        .then(result => {
            if (result) {
                return res.status(200).json({ new_notification_available: true })
            } else {
                return res.status(200).json({ new_notification_available: false })
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const getNotifications = async (req, res) => {
    let user_id = req.user;

    let { page, filter, deletedDocCount } = req.body;

    let maxLimit = 10;

    let findQuery = { notification_for: user_id, user: { $ne: user_id } };

    let skipDocs = (page - 1) * maxLimit;

    if (filter !== 'all') {
        findQuery.type = filter;
    }

    if (deletedDocCount) {
        skipDocs -= deletedDocCount;
    }

    Notification.find(findQuery)
        .skip(skipDocs)
        .limit(maxLimit)
        .populate("project", "title project_id")
        .populate("user", "personal_info.username personal_info.fullname personal_info.profile_img")
        .populate("comment", "comment")
        .populate("replied_on_comment", "comment")
        .populate("reply", "comment")
        .sort({ createdAt: -1 })
        .select("createdAt type seen reply")
        .then(notifications => {

            Notification.updateMany(findQuery, { seen: true })
                .skip(skipDocs)
                .limit(maxLimit)
                .then(() => {
                    console.log('Notifications seen')
                })
                .catch(err => {
                    console.log(err);
                })

            return res.status(200).json({ notifications });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}

export const allNotificationsCount = async (req, res) => {
    let user_id = req.user;

    let { filter } = req.body;

    let findQuery = { notification_for: user_id, user: { $ne: user_id } };

    if (filter !== 'all') {
        findQuery.type = filter;
    }

    Notification.countDocuments(findQuery)
        .then(count => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        })
}