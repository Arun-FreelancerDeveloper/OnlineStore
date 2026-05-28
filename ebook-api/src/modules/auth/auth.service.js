const { json } = require('express');
const jwt = require('jsonwebtoken');
const userRepository = require('../user/user.repository');
const bcrypt = require('bcryptjs');
const { sendResetPasswordEmail } = require('../../services/email.service');

/**
 * <summary>
 * Authenticate a user and issue a JWT token.
 * </summary>
 * <param name="email">User email</param>
 * <param name="password">Plaintext password</param>
 * <returns>Object containing `token` and `user` metadata on success.</returns>
 * <remarks>
 * Steps:
 * 1. Fetch user row by email.
 * 2. If user not found -> throw 401.
 * 3. Compare provided password against stored hash using bcrypt.
 * 4. If match -> sign JWT and return token and user info.
 * </remarks>
 */
exports.login = async ({ email, password }) => {

  /* Get Matched User */
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  /* Compare password */
  const isMatch = await userRepository.comparePassword(
    password,
    user.passwordhash
  );
  
  /* Check password match */
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // ✅ Create token
  const token = jwt.sign(
    {
      userId: user.userid,
      displayName : user.fullname,
      role: user.usertype
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  // ✅ Return token + user
  return {
    token,
    user: {
      id: user.userid,
      displayName : user.fullname,
      role: user.usertype
    }
  };
};

/**
 * <summary>
 * Change a user's password using a JWT token (for reset/change flows).
 * </summary>
 * <param name="token">JWT token that encodes `userId`.</param>
 * <param name="newPassword">Plaintext new password.</param>
 * <returns>Object with `userId` and `newPassword` (note: avoid returning plaintext passwords in production; this mirrors existing behavior).</returns>
 */
exports.changePassword = async ( token, newPassword) => {
  
  console.log({ token, newPassword });

  // ✅ 1. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userRepository.getUserById(decoded.userId);
  if (!user) {
    throw new Error('User not found');
  }

  // update new password
  await userRepository.updatePassword(user.userid, newPassword);
  return { userId : user.userid,
    newPassword : newPassword
  };
};

/**
 * <summary>
 * Initiate password reset flow for a user email.
 * </summary>
 * <param name="email">Target user's email.</param>
 * <param name="callbackurl">Base URL used to construct reset link; the token is appended.</param>
 * <returns>Object containing the email to which the reset was sent.</returns>
 * <remarks>
 * Steps:
 * 1. Verify user exists.
 * 2. Create a short-lived JWT containing `userId`.
 * 3. Construct reset link and send reset email asynchronously.
 * </remarks>
 */
exports.forgotPassword = async (email, callbackurl) => {

  // ✅ 1. Check user exists
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error('Email not registered');
  }

  // ✅ 2. Generate JWT (short expiry)
  const token = jwt.sign(
    {
      userId: user.userid
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }   // 🔥 Important
  );

  // ✅ 3. Generate Link
  const resetLink = `${callbackurl}/${token}`;

  // ✅ 5. Send email
  sendResetPasswordEmail({
    email: user.email,
    fullname: user.fullname,
    resetLink : resetLink
  });
  return {
    email: user.email
  };
};