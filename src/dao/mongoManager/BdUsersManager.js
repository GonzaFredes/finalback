
const UsersModel = require('../models/users.model');

class BdUserManager {

  get = ()  => UsersModel.find()
  
  insert = (user) => UsersModel.create(user)

  update = (user,id) => UsersModel.findByIdAndUpdate(id,user)

  delete = (id) => UsersModel.findByIdAndDelete(id);

}

module.exports = new BdUserManager();
