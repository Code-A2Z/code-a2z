import mongoose from "mongoose";
import subscriberSchema from "../Schemas/subscriber.schema.js";

const Subscriber = mongoose.model("subscribers", subscriberSchema);

export default Subscriber;
