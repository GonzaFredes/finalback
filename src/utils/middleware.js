
const mdlwOnlyAdmin = (req,res,next) => {
    if (req.session.user.role !== 'admin') {
        return res.status(401).json({
            status: 'error',
            msg: 'error usuario no autorizado'
        })
    }
    next();
};

const ifUserExists = (req, res, next) => {
    const user = req.session.user
    if (!user) {
        return res.status(401).json({
            status: 'error',
            msg: 'solo pueden usar el chat los usuarios logueados'
        });
    }
    next();
};

const mdlwUserSession = (req,res,next) => {
    if (!req.session.user) {
        return res.status(401).json({
            status: 'error',
            msg: 'error usuario no autorizado'
        })
    }
    next();
};

module.exports = {
    mdlwOnlyAdmin,
    ifUserExists,
    mdlwUserSession
}