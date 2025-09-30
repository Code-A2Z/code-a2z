import Collaborator from '../../models/collaborator.model.js';


 const getListOfCollaborators = async(req, res)=>
{
    const userid = req.user;
    const {project_id} = req.params;
    try {
        const existingCollaborators = await Collaborator.find({project_id: project_id, author_id: userid});
        if(!existingCollaborators) return res.status(404).json({error: "No collaborators found!"});
        return res.status(200).json({collaborators: existingCollaborators});
    } catch (error) {
        console.log(error);
        return res.status(500).json({Error: "internal Server Error!"});
    }
}

export default getListOfCollaborators;

