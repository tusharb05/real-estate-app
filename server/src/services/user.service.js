const httpStatus = require('http-status');
// const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');
// /**
//  * Create a user
//  * @param {Object} userBody
//  * @returns {Promise<User>}
//  */
const createUser = async (userBody) => {
  // console.log(userBody);
  const { username, email, password, role } = userBody;
  try {
    // Step 1: Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    // Step 2: Create the user account
    const newUser = await User.create({
      username,
      email,
      password, // Make sure to hash the password before saving (e.g., using bcrypt)
      role,
    });

    return newUser;
  } catch (error) {
    console.error('Error creating user account:', error);
    throw error;
  }

  ////////////////////
  // if (await User.isEmailTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  // return User.create(userBody);
};

// /**
//  * Query for users
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const queryUsers = async (filter, options) => {
//   const users = await User.paginate(filter, options);
//   return users;
// };

// /**
//  * Get user by id
//  * @param {ObjectId} id
//  * @returns {Promise<User>}
//  */
// const getUserById = async (id) => {
//   return User.findById(id);
// };

// /**
//  * Get user by email
//  * @param {string} email
//  * @returns {Promise<User>}
//  */
const getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email },
  });
  return user;
};

// /**
//  * Update user by id
//  * @param {ObjectId} userId
//  * @param {Object} updateBody
//  * @returns {Promise<User>}
//  */
// const updateUserById = async (userId, updateBody) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

// /**
//  * Delete user by id
//  * @param {ObjectId} userId
//  * @returns {Promise<User>}
//  */
// const deleteUserById = async (userId) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   await user.remove();
//   return user;
// };

module.exports = {
  createUser,
  // queryUsers,
  // getUserById,
  getUserByEmail,
  // updateUserById,
  // deleteUserById,
};
