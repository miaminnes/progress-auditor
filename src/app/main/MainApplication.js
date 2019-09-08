import * as ConfigHandler from './ConfigHandler.js';
import * as DatabaseHandler from './DatabaseHandler.js';
import * as OutputHandler from './OutputHandler.js';

/**
 * Guarantees a config will be returned. It will throw an error if unable to.
 * @param {String} directory The root project directory.
 * @returns {Config} The config.
 */
export async function resolveConfig(directory)
{
    console.log("Resolving config...");

    // Try to load the provided config file in the directory...
    let config;
    try
    {
        config = await ConfigHandler.loadConfigFile(directory);
    }
    catch(e)
    {
        // Try other fallback config files... maybe ask for one?
        let configFilePath;
        while (configFilePath = await ConfigHandler.requestConfigFile(directory))
        {
            try
            {
                // Found config file. Load it up.
                config = await ConfigHandler.loadConfigFile(configFilePath);
                if (config) break;
            }
            catch(e)
            {
                // Failed to load config. Try again.
                console.error('Failed to load config.', e);
            }
        }
    
        // None found. Use the default instead.
        if (!config) config = await ConfigHandler.loadDefaultConfig(directory);
    }

    if (!config)
    {
        // This should never happen...
        throw new Error('Could not resolve a config file for program. Stopping program...');
    }
    return config;
}

/**
 * Guarantees a database will be returned. It will throw an error if unable to.
 * @param {Config} config The config.
 * @returns {Database} The database.
 */
export async function resolveDatabase(config)
{
    console.log("Resolving database...");

    // Creates an empty database (with no structure at all)...
    const db = await DatabaseHandler.createDatabase(config);

    // Try to prepare all database entries from config...
    await DatabaseHandler.prepareDatabaseForInputs(db, config);

    // Try to load all database entries from config...
    await DatabaseHandler.populateDatabaseWithInputs(db, config);

    // Check with the user if it is okay to continue, based on some data stats...
    if (!await DatabaseHandler.verifyDatabaseWithClient(db, config))
    {
        throw new Error('Could not resolve database for program. Please update the config to match your specifications, then try again. Stopping program...');
    }
    return db;
}

/**
 * Guarantees to prepare the database for output. Otherwise, it will throw an error.
 * @param {Database} db The database.
 * @param {Config} config The config.
 */
export async function validateDatabase(db, config)
{
    console.log("Validating database...");

    // Apply reviews...
    let errors;
    while(errors = await DatabaseHandler.findDatabaseErrors(db, config))
    {
        // Check whether the client wants to continue resolving errors... cause there could be a lot.
        if (await DatabaseHandler.shouldContinueResolvingErrorsWithClient(db, config, errors))
        {
            await DatabaseHandler.resolveDatabaseErrors(db, config, errors);
        }
        else
        {
            break;
        }
    }

    // Whether to ignore errors and continue as normal...
    if (!await DatabaseHandler.verifyErrorsWithClient(db, config, errors))
    {
        await DatabaseHandler.outputErrorLog(db, config, errors);
        
        // IT'S AN ERROR! RUN AWAY!!!
        throw new Error('Could not validate database. Stopping program...');
    }

    // All is well.
}

/**
 * Guarantees no changes will be made to the database or the config.
 * @param {Database} db The database.
 * @param {Config} config The config.
 */
export async function generateOutput(db, config)
{
    console.log("Generating output...");
    
    const outputEntries = OutputHandler.findOutputEntries(config);

    for(const outputEntry of outputEntries)
    {
        try
        {
            await OutputHandler.processOutputEntry(db, config, outputEntry);
        }
        catch(e)
        {
            console.error('Failed to process output entry.', e);
        }
    }
}