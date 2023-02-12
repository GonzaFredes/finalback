const {Router} = require('express')
const viewControllers = require('../controller/views.controller')

const router = Router();

router.get('/', viewControllers.views)


module.exports = router;