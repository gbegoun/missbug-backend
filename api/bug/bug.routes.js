import express from 'express'
import { getbug,getBugs,updateBug,addBug,removeBug } from './bug.controller.js'

const router= express.Router()

router.get('/', getBugs)
router.get('/:bugId', getbug)
router.post('/', addBug)
router.put('/:bugId', updateBug)
router.delete('/:bugId', removeBug)

export const bugRouter = router