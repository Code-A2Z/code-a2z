import { Response } from "express";
import crypto from "crypto";

import Collaborator from "../models/collaborator.model";
import Project from "../models/project.model";
import User from "../models/user.model";
import transporter from "../config/nodemailer";
import { AuthenticatedRequest } from "../middlewares/typings";
import { sendResponse } from "../utils/response";

export const invitationToCollaborate = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const user_id = req.user;
  const { project_id } = req.body;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return sendResponse(res, "error", "User not found!", null, 404);
    }

    const projectToCollaborate = await Project.findOne({ project_id: project_id })
      .populate({ path: "author", select: "personal_info.email" });

      if (!projectToCollaborate) {
      return sendResponse(res, "error", "Project not found!", null, 404);
    }
    // Ensure author is populated and has _id and personal_info
    const author = projectToCollaborate.author as { _id: any; personal_info?: { email?: string } };
    if (!author || !author._id) {
      return sendResponse(res, "error", "Project author not found!", null, 404);
    }
    if (user._id === author._id) {
      return sendResponse(res, "error", "You cannot invite yourself to collaborate on your own project.", null, 400);
    }

    const authorEmail = author.personal_info?.email;

    const token = crypto.randomBytes(16).toString('hex');
    const baseUrl = process.env.VITE_SERVER_DOMAIN || `http://localhost:${process.env.PORT || 8000}`;

    const acceptLink = `${baseUrl}/api/collaboration/accept/${token}`;
    const rejectLink = `${baseUrl}/api/collaboration/reject/${token}`;

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: authorEmail,
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
      `
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return sendResponse(res, "error", "Failed to send invitation email", null, 500);
      }
      console.log("Email sent:", info.response);
      const collaborationData = new Collaborator({
        user_id: user_id,
        project_id: project_id,
        author_id: projectToCollaborate.author,
        status: "pending",
        token: token
      });
      await collaborationData.save();
      return sendResponse(res, "success", "Invitation sent successfully!", null, 200);
    });
  } catch (error) {
    return sendResponse(res, "error", "Internal Server Error", null, 500);
  }
};

export const acceptInvitation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const token = req.params.token;
  const user_id = req.user;

  try {
    const collaborationRequest = await Collaborator.findOne({ token: token, author_id: user_id, status: "pending" })
    if (!collaborationRequest) {
      return sendResponse(res, "error", "Invalid or expired token!", null, 404);
    }

    if (collaborationRequest.status !== "pending") {
      return sendResponse(res, "error", "This invitation has already been responded.", null, 400);
    }

    collaborationRequest.status = "accepted";
    collaborationRequest.token = " " // Invalidate the token after use
    await collaborationRequest.save();
    return sendResponse(res, "success", "You have accepted the collaboration invitation", null, 200);
  }
  catch (error) {
    return sendResponse(res, "error", "Internal Server Error", null, 500);
  }
};

export const rejectInvitation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const token = req.params.token;
  const user_id = req.user;

  try {
    const collaborationRequest = await Collaborator.findOne({ token: token, author_id: user_id, status: "pending" });
    if (!collaborationRequest) {
      return sendResponse(res, "error", "Invalid or expired token!", null, 404);
    }

    if (collaborationRequest.status !== "pending") {
      return sendResponse(res, "error", "This invitation has already been responded.", null, 400);
    }

    collaborationRequest.status = "rejected";
    collaborationRequest.token = " "; // Invalidate the token after use
    await collaborationRequest.save();
    return sendResponse(res, "success", "You have rejected the collaboration invitation", null, 200);
  }
  catch (error) {
    return sendResponse(res, "error", "Internal Server Error", null, 500);
  }
};
