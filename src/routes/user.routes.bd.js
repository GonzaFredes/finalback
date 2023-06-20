const {Router} = require("express");
const {getUsers, insertUser, updateUser, deleteUser,deleteLast2days} = require("../controller/user.controller.bd");
const sessionController = require("../controller/session.controller");
const { saveDocs} = require("../utils/multer");
const { adminPremiumPermission } = require("../utils/middleware");


const userRouter = Router()

userRouter.get('/',getUsers)
userRouter.post('/', insertUser)
userRouter.put('/', updateUser)
userRouter.delete('/', deleteUser)
userRouter.delete('/deletelast', deleteLast2days)
userRouter.post('/premium/:uid', sessionController.updateRole)
userRouter.post('/:uid/documents', saveDocs ,sessionController.uploadDocs);
module.exports = userRouter