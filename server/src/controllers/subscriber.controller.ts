import { Request, Response } from "express";
import Subscriber from "../models/subscriber.model";
import { sendResponse } from "../utils/response";
import { emailRegex } from "../utils/regex";

export const subscribeEmail = async (
  req: Request,
  res: Response,
) => {
  const { email } = req.body;
  if (!email) {
    return sendResponse(res, "error", "Email is required", null, 400);
  }
  if (!emailRegex.test(email)) {
    return sendResponse(res, "error", "Invalid email", null, 400);
  }

  let subscriber = await Subscriber.findOne({ email });
  if (subscriber) {
    if (subscriber.isSubscribed) {
      return sendResponse(res, "success", "You are already subscribed to our newsletter", null, 200);
    }

    subscriber.isSubscribed = true;
    subscriber.unsubscribedAt = new Date();

    await subscriber.save()
      .then(() => {
        return sendResponse(res, "success", "You have been resubscribed to our newsletter", null, 200);
      })
      .catch(err => {
        return sendResponse(res, "error", err.message, null, 500);
      });
  }

  subscriber = new Subscriber({ email });
  await subscriber.save()
    .then(() => {
      return sendResponse(res, "success", "Thank you for subscribing to our newsletter", null, 201);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const unsubscribeEmail = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  if (!email) {
    return sendResponse(res, "error", "Email is required", null, 400);
  }
  if (!emailRegex.test(email)) {
    return sendResponse(res, "error", "Invalid email", null, 400);
  }

  const subscriber = await Subscriber.findOne({ email });

  if (!subscriber) {
    return sendResponse(res, "error", "Email not found in our subscription list", null, 404);
  }

  if (!subscriber.isSubscribed) {
    return sendResponse(res, "success", "You are already unsubscribed from our newsletter", null, 200);
  }

  subscriber.isSubscribed = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save()
    .then(() => {
      return sendResponse(res, "success", "You have been unsubscribed from our newsletter", null, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};

export const getAllSubscribers = async (
  req: Request,
  res: Response,
) => {
  await Subscriber.find({ isSubscribed: true })
    .select("email subscribedAt")
    .sort({ subscribedAt: -1 })
    .then(subscribers => {
      return sendResponse(res, "success", "Fetched all subscribers", { subscribers }, 200);
    })
    .catch(err => {
      return sendResponse(res, "error", err.message, null, 500);
    });
};
