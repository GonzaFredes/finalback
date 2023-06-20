const userModel = require('../dao/models/users.model');

class UserService {
    constructor(dao) {
        this.dao = dao;
    }

    getUser = (email,role,first_name,last_name) => userModel.find(email,role,first_name,last_name);

    // getUser =() => this.dao.get()

    insertUser =(user) => this.dao.insert(user)

    updateUser =(user,id) => this.dao.update(user,id)

    delete =(id)=>this.dao.delete(id)

    deletelast = (last_connection) => this.dao.delete(last_connection)
}

module.exports = UserService