import Subscriber from "../Models/subscriber.model.js";

export const subscribeEmail = async (req, res) => {

    let { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
        if (subscriber.isSubscribed) {
            return res.status(200).json({ error: "You are already subscribed to our newsletter" });
        }

        subscriber.isSubscribed = true;
        subscriber.unsubscribedAt = null;

        await subscriber.save()
            .then(() => {
                return res.status(200).json({ message: "You have been resubscribed to our newsletter" });
            })
            .catch(err => {
                return res.status(500).json({ error: err.message });
            });
    }

    subscriber = new Subscriber({ email });

    await subscriber.save()
        .then(() => {
            return res.status(201).json({ message: "Thank you for subscribing to our newsletter" });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
}