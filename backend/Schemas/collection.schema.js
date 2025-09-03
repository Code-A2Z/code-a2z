import { Schema } from "mongoose";
const collectionSchema  =  Schema({
    userID:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    collection_name:{
        type:String,
        required:true
    },
    project_id:{
        type:String,
        default:null, 
        ref:'Project'
    }
},{timestamps:true});

export default collectionSchema;