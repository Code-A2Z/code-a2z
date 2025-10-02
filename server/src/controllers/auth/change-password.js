import bcrypt from 'bcrypt';

import User from '../../models/user.model.js';

import { passwordRegex } from '../../utils/regex.js';
import { sendResponse } from '../../utils/response.js';
import { SALT_ROUNDS } from '../../constants/index.js';

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (
    !passwordRegex.test(currentPassword) ||
    !passwordRegex.test(newPassword)
  ) {
    return sendResponse(
      res,
      403,
      'error',
      'Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      null
    );
  }

  User.findOne({ _id: req.user })
    .then(user => {
      if (!user || !user.personal_info || !user.personal_info.password) {
        return sendResponse(
          res,
          404,
          'error',
          'User not found or user data is incomplete',
          null
        );
      }
      bcrypt.compare(
        currentPassword,
        user.personal_info.password,
        (err, result) => {
          if (err) {
            return sendResponse(
              res,
              500,
              'error',
              'Some error occured while changing the password, please try again later',
              null
            );
          }

          if (!result) {
            return sendResponse(
              res,
              403,
              'error',
              'Incorrect current password',
              null
            );
          }

          bcrypt.hash(newPassword, SALT_ROUNDS, (err, hashed_password) => {
            User.findOneAndUpdate(
              { _id: req.user },
              { 'personal_info.password': hashed_password }
            )
              .then(() => {
                return sendResponse(
                  res,
                  200,
                  'success',
                  'Password changed successfully',
                  null
                );
              })
              .catch(err => {
                return sendResponse(
                  res,
                  500,
                  'error',
                  err.message ||
                    'Some error occured while saving new password, please try again later',
                  null
                );
              });
          });
        }
      );
    })
    .catch(err => {
      return sendResponse(
        res,
        500,
        'error',
        err.message || 'User not found!',
        null
      );
    });
};

export default changePassword;
