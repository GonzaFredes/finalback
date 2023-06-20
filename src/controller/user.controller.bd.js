const UserDTO = require("../dao/DTOs/user.dto");
const BdUsersManager = require("../dao/mongoManager/BdUsersManager");
const { userService } = require("../service/index.repository");
const mailingService = require("../service/mailing.service");
const moment = require("moment");
// const userDao = require('../dao/mongoManager/BdUsersManager')

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUser(
      {},
      "first_name  last_name email role"
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
  // const users = await userService.getUser();
  // res.json({msg:'ok', users});
};

const insertUser = async (req, res) => {
  const { user } = req.body;
  const userDTO = new UserDTO(user);
  const newUser = await userService.insertUser(userDTO);
  res.json({ msg: "ok", newUser });
};

const updateUser = async (req, res) => {
  const { id, user } = req.body;
  const newUser = await userService.updateUser(user, id);
  res.json({ msg: "ok", newUser });
};

const deleteUser = async (req, res) => {
  const { id } = req.body;
  await userService.delete(id);
  res.json({ msg: "ok" });
};

const deleteLast2days = async (req, res) => {
  try {
    let users = await BdUsersManager.get();

    let deleteUsers = [];

    const expirationTime = moment().subtract(30, "minutes"); // para eliminar los de 30 min de inactividad
    // const expirationTime = moment().subtract(2, 'days'); // Para eliminar 2 dias de inactividad
    let count = 0;

    users.forEach((user) => {
      if (!user.last_connection) {
        count += 1;
        deleteUsers.push(user.email);
        return;
      }
      let userDate = moment(user.last_connection, 'DD/MM/YYYY, hh:mm:ss');
      if (userDate.isBefore(expirationTime) && user.role != "admin") {
        try {
          mailingService.sendMail({
            to: user.email,
            subject: "Se ha eliminado tu cuenta de Pragon Store",
            html: `<div style="background-color: black; color: green; display: flex; flex-direction: column; justify-content: center;  align-items: center;">
                    <h1>Tu cuenta ha sido eliminada!</h1>
                    <a>Si quieres continuar usando nuestros servicios puedes generar una nueva cuenta.</a>
                    </div>`,
          });
        } catch (error) {
          req.logger.error("El mail del usuario no es válido");
        }
        count += 1;
        deleteUsers.push(user.email);
      }
    });

    let deleted = await BdUsersManager.deleteMany(deleteUsers);

    if (deleted.length < 1)
      return res.send({
        status: "Ok",
        message: `${count} cuentas fueron eliminadas con los mails ${deleteUsers}`,
      });
    res.send({
      status: "error",
      message: `Las cuentas con los mails ${deleted} no han podido eliminarse`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  insertUser,
  updateUser,
  deleteUser,
  deleteLast2days,
};
