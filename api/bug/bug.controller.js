// app.get('/api/bug'

import { bugservice } from "./bug.service.js"

export async function getBugs (req, res) {
    const filterBy = {
        title: req.query.title,
        severity: +req.query.severity,
        sortBy: req.query.sortBy,
        sortOrder: +req.query.sortOrder,
        pageIdx: +req.query.pageIdx,
    }

    try {
        const bugs = await bugservice.query(filterBy)
        res.send(bugs)
    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err)
        res.status(400).send(`Couldn't get bugs`)
    }
}

export async function getbug(req, res) {
    const { bugId } = req.params
    try {
        const bug = await bugservice.getById(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error(`Couldn't get bug ${bugId}`, err)
        res.status(400).send(`Couldn't get bug`)
    }
}

export async function updateBug (req, res)  {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description
    }

    try {
        const savedBug = await bugservice.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function addBug  (req, res) {
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        creationDate: Date.now(),
    }

    try {
        const savedBug = await bugservice.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function removeBug (req, res) {
    const { bugId } = req.params
    try {
        await bugservice.remove(bugId)
        res.send('OK')
    } catch (err) {
        loggerService.error(`Couldn't remove bug ${bugId}`, err)
        res.status(400).send(`Couldn't remove bug`)
    }
}
