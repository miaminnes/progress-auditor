import * as Assignment from './Assignment.js';

/**
 * The key for the database to access Assignment data.
 */
export const ASSIGNMENT_KEY = 'assignment';

/**
 * The name of the output log for this data.
 */
const OUTPUT_LOG = 'db.assignment.log';

/**
 * Prepares the database to be used for assignments.
 * @param {Database} db The database to prepare the sub-database for.
 */
export function setupDatabase(db)
{
    if (!(ASSIGNMENT_KEY in db))
    {
        db[ASSIGNMENT_KEY] = new Map();
    }
    return db;
}

export function clearDatabase(db)
{
    if (ASSIGNMENT_KEY in db)
    {
        db[ASSIGNMENT_KEY].clear();
    }
    return db;
}

/**
 * Adds an assignment, by id, to a given user with the specified due date.
 * @param {Database} db The current database to add to.
 * @param {String} userID The unique id of the user to add the assignment for.
 * @param {String} assignmentID The associated unique id for the assignment.
 * @param {Date} dueDate The due date for the assignment.
 * @param {Object} attributes Any additional options to be saved with the assignment.
 */
export function addAssignment(db, userID, assignmentID, dueDate, attributes={})
{
    // Cache extra info for reviews...(used to know what assignmentIDs are possible)
    const cache = db.getCache();
    if (!cache.assignmentKeys) cache.assignmentKeys = new Set();
    cache.assignmentKeys.add(assignmentID);

    // Here the function really begins...
    const assignmentMapping = db[ASSIGNMENT_KEY];

    let ownedAssignments;
    if (assignmentMapping.has(userID))
    {
        ownedAssignments = assignmentMapping.get(userID);
    }
    else
    {
        assignmentMapping.set(userID, ownedAssignments = {});
    }

    if (assignmentID in ownedAssignments)
    {
        db.throwError(ASSIGNMENT_KEY, `Found duplicate assignment '${assignmentID}' for user '${userID}'.`);
        return null;
    }
    else
    {
        const assignment = Assignment.createAssignment(assignmentID, new Date(dueDate.getTime()), attributes);
        ownedAssignments[assignmentID] = assignment;
        return assignment;
    }
}

// TODO: assignmentID is a bit misleading. It should really by assignment type.
export function getAssignmentByID(db, userID, assignmentID)
{
    return db[ASSIGNMENT_KEY].get(userID)[assignmentID];
}

/**
 * 
 * @param {Database} db The current database.
 * @param {*} userID The target user to search for.
 */
export function getAssignmentsByUser(db, userID)
{
    return Object.keys(db[ASSIGNMENT_KEY].get(userID));
}

/**
 * Outputs all information related to assignments in this database.
 * @param {Database} db The current database.
 * @param {String} outputDir The output directory that will contain the output log.
 */
export function outputLog(db, outputFunction, outputDir = '.')
{
    const assignmentMapping = db[ASSIGNMENT_KEY];
    const result = {};
    for(const [key, value] of assignmentMapping.entries())
    {
        result[key] = value;
    }
    
    const header = `${'# '.repeat(20)}\n# Assignments\n# Size: ${assignmentMapping.size}\n${'# '.repeat(20)}`;
    const log = `${header}\n${JSON.stringify(result, null, 4)}`;
    return outputFunction(require('path').resolve(outputDir, OUTPUT_LOG), log);
}
