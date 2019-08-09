const router = require('express').Router()
const controller = require('./tweets.controller')

router.post('/', controller.create)
router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = router