const premiumPermission = async (req, res, next) => {
    if (!req.user || req.user.role === 'user') {
      return res.status(401).json({
        status: 'error',
        msg: 'Usuario no autorizado ',
      });
    }
    if (req.user.role === 'premium') {
      const { pid } = req.params;
      await BdProductManager.getProductId(pid);
    }
    next();
  };
  
  module.exports = premiumPermission;