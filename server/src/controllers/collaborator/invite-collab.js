import crypto from 'crypto';

import Collaborator from '../../models/collaborator.model.js';
import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';

import transporter from '../../config/nodemailer.js';
import { sendResponse } from '../../utils/response.js';

const invitationToCollaborate = async (req, res) => {
  const user_id = req.user;
  const { project_id } = req.body;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return sendResponse(res, 404, 'error', 'User not found!', null);
    }

    const projectToCollaborate = await Project.findOne({
      project_id: project_id,
    }).populate({ path: 'author', select: 'personal_info.email' });

    if (!projectToCollaborate) {
      return sendResponse(res, 404, 'error', 'Project not found!', null);
    }

    // Ensure author is populated and has _id and personal_info
    const author = projectToCollaborate.author;
    if (!author || !author._id) {
      return sendResponse(res, 404, 'error', 'Project author not found!', null);
    }
    if (user._id === author._id) {
      return sendResponse(
        res,
        400,
        'error',
        'You cannot invite yourself to collaborate on your own project.',
        null
      );
    }

    const authorEmail = author.personal_info?.email;

    const token = crypto.randomBytes(16).toString('hex');
    const baseUrl =
      process.env.VITE_SERVER_DOMAIN ||
      `http://localhost:${process.env.PORT || 8000}`;

    const acceptLink = `${baseUrl}/api/collaboration/accept/${token}`;
    const rejectLink = `${baseUrl}/api/collaboration/reject/${token}`;

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: authorEmail,
      subject: 'Collaboration Invitation',
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
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return sendResponse(
          res,
          500,
          'error',
          'Failed to send invitation email',
          null
        );
      }
      console.log('Email sent:', info.response);
      const collaborationData = new Collaborator({
        user_id: user_id,
        project_id: project_id,
        author_id: projectToCollaborate.author,
        status: 'pending',
        token: token,
      });
      await collaborationData.save();
      return sendResponse(
        res,
        200,
        'success',
        'Invitation sent successfully!',
        null
      );
    });
  } catch (error) {
    return sendResponse(
      res,
      500,
      'error',
      error.message || 'Internal Server Error',
      null
    );
  }
};

export default invitationToCollaborate;
