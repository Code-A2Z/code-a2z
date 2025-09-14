import { model } from 'mongoose'
import collectionSchema from '../schemas/collection.schema'

const Collection = model("collections", collectionSchema);

export default Collection;
