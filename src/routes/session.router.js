const { Router } = require('express');
const UsersModel = require('../dao/models/users.model');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const passport = require ('passport');
const { STRATEGY_REGISTER } = require('../utils/constants');

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email == 'adminCoder@coder.com' && password == '123456') {
        const userAdmin = { first_name: 'Admin', last_name: 'Coder', age: '25', email, password, rol: 'admin' };
        req.session.user = userAdmin;
    }
    const user = await UsersModel.findOne({ email });
    const isValidPassword = await comparePassword(password, user.password);
    if (user && isValidPassword) {
        req.session.user = { ...user, rol: 'user' };
        res.send(user);
    } else {
        res.status(401).send("Email o contraseña incorrecta,intente nuevamente");
    }
});

router.post('/register', passport.authenticate(STRATEGY_REGISTER) ,async (req, res) => {
    res.send(req.user);
});

router.post('/forgot-password', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UsersModel.findOne({ email })
        if (user) {
            const hash = await hashPassword(password);
            await UsersModel.updateOne({ email }, { password: hash })
            res.send(user);
        }else {
            res.status (404).send('Email no encontrado')
        }
    } catch (error) {
        console.log (error)
        res.status(500).send('Error al crear usuario');
    }
})

router.get('/current', async (req,res) =>{
    const user = req.session.user;
    if (user) { res.send (user);
        // res.send (user), {
        //     name: req.session.user._doc.first_name,
        //     lastName: req.session.user._doc.last_name,
        //     email: req.session.user._doc.email,
        //     age: req.session.user._doc.age,
        //     rol: req.session.user._doc.role
        // };
    } else {
            res.render('login',);
    }    
})


module.exports = router;