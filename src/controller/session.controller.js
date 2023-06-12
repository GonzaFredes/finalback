const { hash } = require('bcrypt');
const DTOsUser = require('../dao/DTOs/user.dto');
const userModel = require('../dao/models/users.model');
const BdSessionManager = require('../dao/mongoManager/BdSessionManager');
const mailingService = require('../service/mailing.service');
const userControl = require('../controller/user.controller.bd');
// const { getUser } = require('../service/users.service'); REVISAR RUTAS!!
const { comparePassword, hashPassword } = require('../utils/bcrypt');
const { generateToken, getPayload } = require('../utils/jwt');
const BdUsersManager = require('../dao/mongoManager/BdUsersManager');
const { TYPE_DOCUMENTS } = require('../config/config');
const BdProductManager = require('../dao/mongoManager/BdProductManager');

const sessionLogin = async (req, res) => {
  req.logger.info(`${req.user.first_name} - updated last connection`)
  await BdUsersManager.lastConnection(req.user, new Date().toLocaleString());
  res.send(req.user);
};

const loginRegister = async (req, res) => {
  req.logger.info(`${req.user.firstName} - updated last connection`)
  await BdUsersManager.lastConnection(req.user, new Date().toLocaleString());
  const dtoUser = new DTOsUser(req.user);
  req.session.user = dtoUser;
  res.send(dtoUser);
  // if (!req.user) {
  //   return res.status(404).json({msg:'usuario no encontrado'})
  // } 
  // req.session.user = req.user
  // res.json({msg:'Usuario logueado con éxito'})
  // await BdUsersManager.lastConnection(req.user, new Date().toLocaleString());
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
    // const password = await comparePassword(req.body.password, req.payload.password);
    const password = await comparePassword(
      req.body.password,
      req.payload.password
    );
    if (!password) {
      const hashNewPassword = await hashPassword(req.body.password);
      // const updateUser = await BdSessionManager.updatePassword(hashNewPassword, req.payload.id);
      const updateUser = await BdSessionManager.updatePassword(
        hashNewPassword,
        req.payload.id
      );

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

const uploadDocs = async (req, res, next) => {
  try {
    let user = req.user
    let userDocuments = [];
    user.documents.forEach((element) => {
      userDocuments.push(element.name);
    });
    if (userDocuments.findIndex((value) => value == req.body.typeDocument) != -1 && req.body.typeDocument != 'product' && req.body.typeDocument != 'thumbnail' && req.body.typeDocument != 'document') {
      return res.status(403).send({ status: 'error', message: 'Archivo ya subido' })
    }

    await BdSessionManager.editOneById(req.user.id, req.body.pid, {
      documents: [
        ...req.user.documents,
        {
          name: req.body.pid,
          reference: `/documents/${req.route}/${req.filename}`
        }
      ]
    })

    if (req.body.pid) {
      const image = req.body.file
      await BdProductManager.UpdateProduct(req.body.pid, image)
    }


    await BdSessionManager.editOneById(req.user.id, {
      documents: [
        ...req.user.documents,
        {
          name: req.body.typeDocument,
          reference: `/documents/${req.route}/${req.filename}`
        }
      ]
    })

    res.send({ status: 'Ok', message: 'Archivos guardados correctamente' });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  req.logger.info('controller - logout')
  try {
    if (req.session && req.user) {
      req.logger.info(`${req.user.firstName} - updated last connection`)
      await BdUsersManager.lastConnection(req.user, new Date().toLocaleString());
      req.session.destroy();
      res.send('ok');
    } else {
      res.send('ok');
    }
  } catch (error) {
    next(error);
  }
};

const AreDocumentsRepeated = async (req, res, next) => {
  try {
    req.logger.http(
      `${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`
    );

    if (Object.getOwnPropertyNames(req.files).length == 0)
      return res.send({
        status: 'error',
        message: 'No se enviaron documentos',
      });

    let email = req.params.uid;

    let user = await BdSessionManager.getOne({ email });
    let isValid = true;
    let repeatedDocs = [];
    user.documents.forEach((element) => {
      if (req.files[element.name]) {
        repeatedDocs.push(element.name);
        isValid = false;
      }
    });

    if (!isValid)
      return res.send({
        status: 'error',
        message: `Los campos repetidos son ${repeatedDocs}`,
      });

    res.send({ status: 'Ok', message: 'All documents are new' });
  } catch (error) {
    next(error);
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
  uploadDocs,
  AreDocumentsRepeated,
  logout,
};