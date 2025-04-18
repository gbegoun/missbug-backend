import express from 'express'
import { bugservice } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173'
    ],
    credentials: true
}

app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(cookieParser())


//* ------------------- Bugs Crud -------------------
//* Read/List
app.get('/api/bug', async (req, res) => {
    const filterBy = {
        title: req.query.title,
        severity: +req.query.severity
    }

    try {
        const bugs = await bugservice.query(filterBy)
        res.send(bugs)
    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err)
        res.status(400).send(`Couldn't get bugs`)
    }
})


//* Add/Update
app.get('/api/bug/save', async (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description
    }

    try {
        const savedBug = await bugservice.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }
})


//* Read
app.get('/api/bug/:bugId', async (req, res) => {
    const { bugId } = req.params
    try {
        const bug = await bugservice.getById(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error(`Couldn't get bug ${bugId}`, err)
        res.status(400).send(`Couldn't get bug`)
    }
})


//* Delete
app.get('/api/bug/:bugId/remove', async (req, res) => {
    const { bugId } = req.params
    try {
        await bugservice.remove(bugId)
        res.send('OK')
    } catch (err) {
        loggerService.error(`Couldn't remove bug ${bugId}`, err)
        res.status(400).send(`Couldn't remove bug`)
    }
})


const port = 3030
app.listen(port, () => {
    loggerService.info(`Example app listening on port http://127.0.0.1:${port}/`)
})
