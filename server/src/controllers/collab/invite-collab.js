import crypto from 'crypto';
import Collab from '../../models/collab.model.js';
import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import Subscriber from '../../models/subscriber.model.js';
import resend from '../../config/resend.js';
import { sendResponse } from '../../utils/response.js';
import { ADMIN_EMAIL, VITE_SERVER_DOMAIN } from '../../config/env.js';
import { COLLABORATION_STATUS } from '../../typings/index.js';

const invitationToCollaborate = async (req, res) => {
  try {
    const user_id = req.user;
    const { project_id } = req.body;

    // Validate user
    const user = await User.findById(user_id).select('personal_info.fullname');
    if (!user) return sendResponse(res, 404, 'error', 'User not found', null);

    // Validate project and populate author email
    const project = await Project.findOne({ _id: project_id }).populate({
      path: 'author',
      select: 'personal_info.email',
    });
    if (!project)
      return sendResponse(res, 404, 'error', 'Project not found', null);

    const author = project.author;
    if (!author)
      return sendResponse(res, 404, 'error', 'Project author not found', null);

    if (String(user._id) === String(author._id)) {
      return sendResponse(
        res,
        400,
        'error',
        'You cannot invite yourself to collaborate on your own project',
        null
      );
    }

    const subscriber = await Subscriber.findOne({
      _id: author.personal_info.email,
    }).select('email');
    const authorEmail = subscriber?.email;

    if (!authorEmail) {
      return sendResponse(
        res,
        400,
        'error',
        'Project author does not have an email address',
        null
      );
    }

    // Generate token and links
    const token = crypto.randomBytes(16).toString('hex');
    const acceptLink = `${VITE_SERVER_DOMAIN}/api/collab/accept/${token}`;
    const rejectLink = `${VITE_SERVER_DOMAIN}/api/collab/reject/${token}`;

    let emailSent = false;
    try {
      const response = await resend.emails.send({
        from: ADMIN_EMAIL,
        to: authorEmail,
        subject: `Collaboration Invitation on "${project.title}"`,
        html: `
          <p>Hi,</p>
          <p><strong>${user.personal_info?.fullname}</strong> has requested to collaborate on your project "${project.title}".</p>
          <p>Please click the links below to respond to the invitation:</p>
          <p>
            <a href="${acceptLink}">Accept Invitation</a> &nbsp;|&nbsp;
            <a href="${rejectLink}">Reject Invitation</a>
          </p>
          <p>If you did not expect this invitation, you can safely ignore this email.</p>
          <p>Best regards,<br/>CodeA2Z Team</p>
        `,
      });
      console.log('Resend response:', response);

      // Depending on Resend API, you might want to check response status
      if (!response || !response.id) {
        throw new Error('Email not sent');
      }
      emailSent = true;
    } catch (emailError) {
      return sendResponse(
        res,
        500,
        'error',
        emailError || 'Failed to send invitation email',
        null
      );
    }

    if (emailSent) {
      const collaborationData = await Collab.create({
        user_id: user._id,
        project_id: project._id,
        author_id: author._id,
        status: COLLABORATION_STATUS.PENDING,
        token,
      });

      return sendResponse(
        res,
        200,
        'success',
        'Invitation sent successfully',
        collaborationData
      );
    }
  } catch (err) {
    return sendResponse(
      res,
      500,
      'error',
      err.message || 'Failed to send invitation',
      null
    );
  }
};

export default invitationToCollaborate;
