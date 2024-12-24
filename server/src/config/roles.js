const allRoles = {
  Seeker: ['getProperty'],
  Admin: ['getUsers', 'manageUsers', 'manageProperty', 'getProperty'],
  Advertiser: ['getProperty', 'createProperty', 'deleteProperty'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
