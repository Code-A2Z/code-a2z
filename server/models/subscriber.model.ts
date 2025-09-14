import { model } from "mongoose";
import subscriberSchema from "../schemas/subscriber.schema";

const Subscriber = model("subscribers", subscriberSchema);

export default Subscriber;
