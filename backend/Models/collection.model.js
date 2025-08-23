import mongoose from 'mongoose'
import collectionSchema from "../Schemas/collection.schema.js";

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
