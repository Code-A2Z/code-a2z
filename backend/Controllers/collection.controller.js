import Collection from "../Models/collection.model.js";
import User from "../Models/user.model.js";

//create a new collection
export const createNewCollection = async(req,res)=>{
    try{
        const userID = req.user;
        const {collection_name}=req.body;
        const existingUser = await User.findOne({_id:userID});
        if(!existingUser) return res.status(404).json("User not found");

        const newCollection = new Collection({
            userID,
            collection_name
        })

        await newCollection.save();
        return res.status(200).json(`Collection ${newCollection.collection_name} for ${existingUser.personal_info.username}`);
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
}

//save projects to user profile in existing collection
export const saveProject = async (req, res) => {
  try {
    const userID = req.user;
    const project_id = req.params.id;
    const { collection_name } = req.body;

    const existingUser = await User.findById(userID);
    if (!existingUser) return res.status(404).json("User not found");

    const existingCollection = await Collection.find({ userID, collection_name });
    
    const existingProject = await Collection.findOne({userID,collection_name,project_id});
    if(existingProject) return res.status(400).json("Project already exists in this collection");

    // Case 1: No collection exists → create new one
    if (existingCollection.length === 0) {
      const newCollection = new Collection({ userID, collection_name, project_id });
      await newCollection.save();

      return res.status(201).json(
        `New collection '${collection_name}' created and project saved for ${existingUser.personal_info.username}`
      );
    }

    // Case 2: Try to update empty slot
    const emptySlot = await Collection.findOneAndUpdate(
      { userID, collection_name, project_id: null },
      { $set: { project_id } },
      { new: true }
    );

    if (emptySlot) {
      return res.status(200).json(
        `Project added to empty slot in collection '${collection_name}' for ${existingUser.personal_info.username}`
      );
    }

    // Case 3: No empty slots → create new document
    const newDoc = new Collection({ userID, collection_name, project_id });
    await newDoc.save();


    return res.status(201).json(
      `New document created in collection '${collection_name}' with project for ${existingUser.personal_info.username}`
    );

  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
    }
}

