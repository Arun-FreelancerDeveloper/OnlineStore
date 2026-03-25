const { json } = require('express');
const jwt = require('jsonwebtoken');
const userRepository = require('../user/user.repository');
const bcrypt = require('bcryptjs');
const { sendResetPasswordEmail } = require('../../services/email.service');

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