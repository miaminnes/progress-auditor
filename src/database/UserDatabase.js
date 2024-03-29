import * as User from './User.js';

export const USER_KEY = 'user';
const OUTPUT_LOG = 'db.user.log';

export function setupDatabase(db)
{
    if (!(USER_KEY in db))
    {
        db[USER_KEY] = new Map();
    }
    return db;
}

export function clearDatabase(db)
{
    if (USER_KEY in db)
    {
        db[USER_KEY].clear();
    }
    return db;
}

export function addUser(db, userID, ownerKey, userName, startDate, endDate, opts, attributes = {})
{
    const userMapping = db[USER_KEY];

    if (userMapping.has(userID))
    {
        db.throwError(USER_KEY, `Found duplicate id for user '${userID}'.`);
        return null;
    }
    else
    {
        // Create user...
        const user = User.createUser(userID, ownerKey, userName, startDate, endDate, opts, attributes);
        userMapping.set(userID, user);
        return user;
    }
}

export function getUsers(db)
{
    return db[USER_KEY].keys();
}

export function getUserCount(db)
{
    return db[USER_KEY].size;
}

export function getUserByID(db, id)
{
    return db[USER_KEY].get(id);
}

/**
 * @param {Database} db The database to search through.
 * @param {String} ownerKey The owner key associated with the user.
 * @returns {String} The user id, null if not found.
 */
export function getUserByOwnerKey(db, ownerKey)
{
    const userMapping = db[USER_KEY];
    for(const userData of userMapping.values())
    {
        if (Array.isArray(userData.ownerKey))
        {
            if (userData.ownerKey.includes(ownerKey))
            {
                return userData.id;
            }
        }
        else if (userData.ownerKey == ownerKey)
        {
            return userData.id;
        }
    }
    return null;
}

export function getUsersByAttribute(db, attributeName, attributeValue)
{
    let result = [];
    const userMapping = db[USER_KEY];
    for(const userData of userMapping.values())
    {
        if (attributeName in userData.attributes)
        {
            const attributeData = userData.attributes[attributeName];
            if (Array.isArray(attributeData))
            {
                if (attributeData.includes(attributeValue))
                {
                    result.push(userData.id);
                }
            }
            else if (attributeData == attributeValue)
            {
                result.push(userData.id);
            }
        }
        else if (attributeValue === null)
        {
            result.push(userData.id);
        }
    }
    return result;
}

export function getOwnerKeysForUserID(db, userID)
{
    const userMapping = db[USER_KEY];
    const userData = userMapping.get(userID);
    
    const result = userData.ownerKey;
    if (Array.isArray(result)) return result;
    else return [result];
}

export function outputLog(db, outputFunction, outputDir = '.')
{
    const userMapping = db[USER_KEY];
    const result = {};
    for(const [key, value] of userMapping.entries())
    {
        result[key] = value;
    }

    const header = `${'# '.repeat(20)}\n# Users\n# Size: ${userMapping.size}\n${'# '.repeat(20)}`;
    const log = `${header}\n${JSON.stringify(result, null, 4)}`;
    return outputFunction(require('path').resolve(outputDir, OUTPUT_LOG), log);
}
