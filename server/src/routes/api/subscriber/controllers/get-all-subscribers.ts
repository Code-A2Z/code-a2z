import { Request, Response } from "express";

import Subscriber from "../../../../models/subscriber.model";
import { sendResponse } from "../../../../utils/response";

const getAllSubscribers = async (
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

export default getAllSubscribers;
