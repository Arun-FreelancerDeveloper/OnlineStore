const { json } = require('express');
const jwt = require('jsonwebtoken');
const userRepository = require('../user/user.repository');


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

exports.changePassword = async ({ userId, newPassword }) => {
  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  // update new password
  await userRepository.updatePassword(userId, newPassword);
  return { userId : userId ,
    newPassword : newPassword
  };
};