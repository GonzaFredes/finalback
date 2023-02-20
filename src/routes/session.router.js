const { Router } = require('express');
const UsersModel = require('../dao/models/users.model');

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UsersModel.findOne({ email, password });
    // console.log(user)
    if (user) {
        req.session.user = user;
        res.send(user);
    } else {
        res.status(401).send("Email o contraseña incorrecta,intente nuevamente");
    }
});

router.post('/register', async (req, res) => {
    try {
        const user = await UsersModel.create(req.body);
        res.send(user);
    } catch (error) {
        res.status(500).send('Error al crear usuario');
    }
});

module.exports = router;