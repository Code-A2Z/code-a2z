import { Request, Response } from "express";

import Subscriber from "../../../../models/subscriber.model";
import { sendResponse } from "../../../../utils/response";
import { emailRegex } from "../../../../utils/regex";

const subscribeEmail = async (
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

export default subscribeEmail;
