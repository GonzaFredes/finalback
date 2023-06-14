const BdProductManager = require('../dao/mongoManager/BdProductManager');

const mdlwOnlyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({
            status: 'error',
            msg: 'error usuario no autorizado'
        });
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

const mdlwUserSession = (req, res, next) => {
    if (!req.user || req.user?.role !== 'user') {
        return res.status(401).json({
            status: 'error',
            msg: 'Usuario no autorizado',
        });
    }
    next();
    // if (!req.session.user) {
    //     return res.status(401).json({
    //         status: 'error',
    //         msg: 'Usuario no autorizado'
    //     })
    // }
    // next();
};

const premiumDocs = async (req,res,next) => {
    if (req.user.documents) {
        const docs = req.user.documents
        const files = docs.map()
        console.log(files);
        res.status(200).json({files});
    }
};

const adminPremiumPermission = async (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'premium') {
        return res.status(401).json({
            status: 'error',
            msg: 'Usuario no autorizado ',
        });
    }
    next();
};

module.exports = {
    mdlwOnlyAdmin,
    ifUserExists,
    mdlwUserSession,
    adminPremiumPermission,
    premiumDocs,
}