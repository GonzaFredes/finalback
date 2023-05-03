const tesTer = (req, res) => {
    req.logger.fatal('Codeá todo de vuelta crack');
    req.logger.error('Error de algo raro en el código');
    req.logger.warning('Cuidado!');
    req.logger.info('Error de datos');
    req.logger.http('Error de conexion');
    req.logger.debug('Encontrar error');
    res.json({});
};
  
module.exports = {tesTer};