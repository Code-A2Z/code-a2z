import crypto from "crypto";
import Collaborator from "../../models/collaborator.model.js";
import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import resend from "../../config/resend.js";
import { sendResponse } from "../../utils/response.js";
import { VITE_SERVER_DOMAIN } from "../../config/env.js";

const invitationToCollaborate = async (req, res) => {
  const user_id = req.user;
  const { project_id } = req.body;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return sendResponse(res, 404, "error", "User not found!", null);
    }

    const projectToCollaborate = await Project.findOne({
      project_id: project_id,
    }).populate({ path: "author", select: "personal_info.email" });

    if (!projectToCollaborate) {
      return sendResponse(res, 404, "error", "Project not found!", null);
    }

    const author = projectToCollaborate.author;
    if (!author || !author._id) {
      return sendResponse(res, 404, "error", "Project author not found!", null);
    }

    if (String(user._id) === String(author._id)) {
      return sendResponse(
        res,
        400,
        "error",
        "You cannot invite yourself to collaborate on your own project.",
        null
      );
    }

    const authorEmail = author.personal_info?.email;
    const token = crypto.randomBytes(16).toString("hex");
    const acceptLink = `${VITE_SERVER_DOMAIN}/api/collaboration/accept/${token}`;
    const rejectLink = `${VITE_SERVER_DOMAIN}/api/collaboration/reject/${token}`;

    if (!authorEmail) {
      return sendResponse(
        res,
        400,
        "error",
        "Project author does not have an email address.",
        null
      );
    }

    await resend.emails.send({
      from: `The Code A2Z Team <${process.env.ADMIN_EMAIL}>`,
      to: [authorEmail],
      subject: "Collaboration Invitation",
      html: `
        <p>Hi,</p>
        <p><strong>${user?.personal_info?.fullname}</strong> has requested to collaborate on your project "${projectToCollaborate.title}".</p>
        <p>If you’d like to join, please click below:</p>
        <p>
          <a href="${acceptLink}">Accept Invitation</a> &nbsp;|&nbsp;
          <a href="${rejectLink}">Reject Invitation</a>
        </p>
        <p>Your response will help us update the project collaboration status accordingly.</p>
        <p>Thanks for being part of the community,<br/>The Code A2Z Team</p>
      `,
    });

    console.log("Invitation email sent to:", authorEmail);

    const collaborationData = new Collaborator({
      user_id: user_id,
      project_id: project_id,
      author_id: projectToCollaborate.author,
      status: "pending",
      token: token,
    });
    await collaborationData.save();

    return sendResponse(res, 200, "success", "Invitation sent successfully!", null);
  } catch (error) {
    console.error("Error in invitation process:", error);
    return sendResponse(res, 500, "error", "Failed to send invitation", null);
  }
};

export default invitationToCollaborate;
