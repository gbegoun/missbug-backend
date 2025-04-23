import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js"

export const bugservice = {
    query,
    getById,
    remove,
    save
}

const bugs = readJsonFile('./data/bugs.json')
const PAGE_SIZE = 3


async function query(filterBy) {
    let bugsToDisplay = bugs

    try {
        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.severity) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity === filterBy.severity)

        }

        if (filterBy.pageIdx !== undefined && !isNaN(filterBy.pageIdx)) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            const endIdx = startIdx + PAGE_SIZE
            bugsToDisplay = bugsToDisplay.slice(startIdx, endIdx)
        }

        if (filterBy.sortBy !== undefined) {
            const sortBy = filterBy.sortBy
            const sortOrder = filterBy.sortOrder || 1


            bugsToDisplay = bugsToDisplay.sort((a, b) => {
                let result;
                if (sortBy === 'title') {
                    result = a.title.localeCompare(b.title)
                } else if (sortBy === 'severity') {
                    result = a.severity - b.severity
                } else if (sortBy === 'creationDate') {
                    result = new Date(b.creationDate) - new Date(a.creationDate)
                }
                return result * sortOrder
            })
        }

        return bugsToDisplay

    } catch (err) {
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw new Error('Cannot find bug')
        return bug
    } catch (err) {
        throw err
    }
}

async function remove(bugId) {
    try {
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx === -1) throw new Error('Cannot find bug')
        bugs.splice(bugIdx, 1)
        await saveBugsToFile()
    } catch (err) {
        console.log('err:', err)
    }
}

async function save(bugToSave) {
    try {
        if (bugToSave._id) {
            const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (bugIdx === -1) throw new Error('Cannot find bug')
            bugs[bugIdx] = bugToSave
        } else {
            bugToSave._id = makeId()
            bugs.unshift(bugToSave)
        }
        await saveBugsToFile()
        return bugToSave
    } catch (err) {
        throw err
    }
}


function saveBugsToFile() {
    return writeJsonFile('./data/bugs.json', bugs)
}
