import collaboration from "../Models/collaboration.model.js"
import Project from "../Models/project.model.js";
import crypto from "crypto";
import User from "../Models/user.model.js";
import transporter from "../config/nodemailer.js";



export const invitationToCollaborate = async(req, res)=>{
   const userid = req.user;
   const {project_id} = req.body;

   try {
    const user = await User.findById(userid);
    if(!user) return res.status(404).json({error: "User not found!"});
        const projectToCollaborate = await Project.findOne({project_id: project_id}).populate("author", "personal_info.email");

        if(user._id.toString() === projectToCollaborate.author._id.toString()){
            return res.status(400).json({error: "You cannot invite yourself to collaborate on your own project."});
        }



        if(!projectToCollaborate) return res.status(404).json({error: "Project not found!"});

        const authorEmail  = projectToCollaborate.author.personal_info.email;
        const token = crypto.randomBytes(16).toString('hex');
 


        const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
       

        const acceptLink = `${baseUrl}/api/collaboration/accept/${token}`;
        const rejectLink = `${baseUrl}/api/collaboration/reject/${token}`;



        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: authorEmail,
            subject: "Collaboration Invitation",
            html: `<p>Hi,</p>
                   <p>${user.personal_info.fullname} has requested to collaborate on your project "${projectToCollaborate.title}".</p>
                   <p><a href="${acceptLink}">Accept Invitation</a> | <a href="${rejectLink}">Reject Invitation</a></p>
                   <p>Thank you!</p>`

        };
        await transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.error("Error sending email:", error);
                return res.status(500).json({error: "Failed to send invitation email"});
            }
            console.log("Email sent:", info.response);
        })
        const collaborationData = new collaboration({
           user_id: userid,
           project_id: project_id,
           author_id: projectToCollaborate.author,
           status: "pending",
           token : token
        })
        await collaborationData.save();
        return res.status(200).json({message: "Invitation sent successfully!"});

   } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Internal Server Error"});
   }
}



export const getListOfCollaborators = async(req, res)=>{
    const userid = req.user;
    const {project_id} = req.params;
    try {
        const existingCollaborators = await collaboration.find({project_id: project_id, author_id: userid});
        if(!existingCollaborators) return res.status(404).json({error: "No collaborators found!"});
        return res.status(200).json({collaborators: existingCollaborators});
    } catch (error) {


export const acceptInvitation = async(req, res)=>{
    const token = req.params.token;
    const id = req.user;
    try {
        const collaborationRequest = await collaboration.findOne({token: token, author_id: id, status:"pending"})
        if(!collaborationRequest) return res.status(404).json({error: "Invalid or expired token!"});
        if(collaborationRequest.status !== "pending") return res.status(400).json({error: "This invitation has already been responded to."});   
        collaborationRequest.status = "accepted";
        collaborationRequest.token = " " // Invalidate the token after use
        await collaborationRequest.save();  
        return res.status(200).json({message: `You have accepted the collaboration invitation`});   
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}


export const rejectInvitation = async(req,res)=>{
    const token = req.params.token;
    const id = req.user;
    try {

        const collaborationRequest = await collaboration.findOne({token: token, author_id: id, status:"pending"})
        if(!collaborationRequest) return res.status(404).json({error: "Invalid or expired token!"});
        if(collaborationRequest.status !== "pending") return res.status(400).json({error: "This invitation has already been responded to."});
        collaborationRequest.status = "rejected";
        collaborationRequest.token = " " // Invalidate the token after use
        await collaborationRequest.save();  
        return res.status(200).json({message: `You have rejected the collaboration invitation`});   
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

