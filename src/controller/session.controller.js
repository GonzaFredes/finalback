const { hash } = require('bcrypt');
const DTOsUser = require('../dao/DTOs/user.dto');
const userModel = require('../dao/models/users.model');
const BdSessionManager = require('../dao/mongoManager/BdSessionManager');
const mailingService = require('../service/mailing.service');
const userControl = require('../controller/user.controller.bd');
// const { getUser } = require('../service/users.service'); REVISAR RUTAS!!
const { comparePassword, hashPassword } = require('../utils/bcrypt');
const { generateToken, getPayload } = require('../utils/jwt');

const sessionLogin = async (req, res) => {
  res.send(req.user);
};

const loginRegister = async (req, res) => {
  // const dtoUser = DTOsUser(req.user);
  // req.session.user = dtoUser;
  // res.send(dtoUser);
  if (!req.user) {
    return res.status(404).json({msg:'usuario no encontrado'})
  } 
  req.session.user = req.user
  res.json({msg:'Usuario logueado con éxito'})
};

const current = async (req, res) => {
  res.send(req.user);
};

const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    const user = await BdSessionManager.getEmail({ email: email });
    if (user === null) {
      return res.status(404).json({ message: 'Mail no valido' });
    }
    let token = generateToken({ id: user.id });
    mailingService.sendMail({
      to: user.email,
      subject: `Hola ${user.first_name}`,
      html: `<a href="http://localhost:8080/api/session/redirectForgotPassword/${token}">aqui</a>`,
    });
    res.json({
      status: 'sucess',
      message: `Se envio un correo de recuperacion a ${user.email}`,
    });
  } catch (error) {
    return res.send({ status: 'error', message: 'El email es inválido' });
  }
  //const { email, password } = req.body;
  //try {
  //    const user = await UsersModel.findOne({ email })
  //    if (user) {
  //        const hash = await hashPassword(password);
  //        await UsersModel.updateOne({ email }, { password: hash })
  //        res.send(user);
  //    }else {
  //        res.status (404).send('Email no encontrado')
  //    }
  //} catch (error) {
  //    console.log (error)
  //    res.status(500).send('Error al crear usuario');
  //}
};

const redirectRecoverPassword = (req, res, next) => {
  try {
    console.log(req.params.token);
    const token = req.params.token;
    res.cookie('token', token).redirect(`/recover-password`);
  } catch (error) {
    next(error);
  }
};

const RecoverPassword = async (req, res, next) => {
  try {
    const password = await comparePassword(req.body.password, req.payload.password);
    if (!password) {
      const hashNewPassword = await hashPassword(req.body.password);
      const updateUser = await BdSessionManager.updatePassword(hashNewPassword, req.payload.id);

      return res.cookie('token', '', { maxAge: 1 }).status(202).json({
        status: 'sucess',
        message: 'Cambio efectuado con éxito',
      });
    } else {
      res.status(403).json({
        status: 'error',
        message: 'La contraseña no puede ser igual a la anterior, intente nuevamente.',
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res) => {
  const id = req.params.uid;
  const rol = req.body;
  if (req.user.role === 'user') {
    const update = await BdSessionManager.UpdateRole(id, rol);
    return res.status(200).json({
      status: 'success',
      message: 'Rol actualizado',
      data: update,
    });
  } else {
    req.user.role === 'premium';
    const update = await BdSessionManager.UpdateRole(id, rol);
    return res.status(200).json({
      status: 'success',
      message: 'Rol actualizado',
      data: update,
    }); 
  }
}; 

module.exports = {
  sessionLogin,
  loginRegister,
  current,
  forgotPassword,
  redirectRecoverPassword,
  RecoverPassword,
  updateRole,
};