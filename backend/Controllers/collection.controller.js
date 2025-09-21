import Collection from "../Models/collection.model.js";
import Project from "../Models/project.model.js";
import User from "../Models/user.model.js";
import mongoose from "mongoose";

/*create a new collection-
 1.in case of manula creation of collection, the project_id is set to null since nothing is saved */ 

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

    // Case 1: No collection exists → save in 'default-collection' and save the project 
    if (existingCollection.length === 0) {
      const newCollection = new Collection(
        { 
          userID, 
          collection_name:"default-collection",
          project_id 
        }
      );
      await newCollection.save();

      return res.status(201).json(
        `Collection added to default collection and project saved for ${existingUser.personal_info.username}`
      );
    }

    // Case 2: Try to update empty project_id - in case of manula creation,we had project_is null, so here we try to update that id for that document, to use this document and avoid redudancy in the collection

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

    // Case 3: No empty slots → create new document for the project being saved 
    const newDoc = new Collection(
      { 
        userID, 
        collection_name, 
        project_id 
      });

    await newDoc.save();


    return res.status(201).json(
      `New document created in collection '${collection_name}' with project for ${existingUser.personal_info.username}`
    );

  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
    }
}

export const deleteProject = async(req,res)=>{
  try{
    const userID = req.user;
    const {collectionID,projectID} = req.body;
    const existingUser = await User.findById(userID);
    if(!existingUser)  return res.status(404).json("User not found");
    const deletedProject = await Collection.findOne({
      userID:userID,
      _id:collectionID,
      project_id:projectID
    })

    if(!deletedProject) return res.status(404).json("Project not found in this collection");

    await Collection.deleteOne(deletedProject);
    return res.status(200).json("Project deleted successfully");
  }catch(err){
    console.log(err);
    return res.status(400).json(err);
  }
}

