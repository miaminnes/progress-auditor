/**
 * This file handles the extra client interface of the program.
 * This is used by `main.js`, alongside `MainApplication` to
 * execute and process the entire program.
 * 
 * As of right now, this serves only to "inject" extra information
 * that the client would want to see that is not relevant to
 * the main program.
 * 
 * @module ClientApplication
 */

import { version } from '../../package.json';
import * as Client from '../client/Client.js';
import * as DatabaseSolver from './main/DatabaseSolver.js';

export async function onStart(directory, args)
{
    Client.doTheBigTitleThing('Progress Auditor', `Version v${version}`);
    Client.log('');

    Client.log('Running from directory: ' + directory);
    Client.log('');

    Client.debug('== Quick Tutorial ==');
    Client.debug(`1) To submit your answer, press 'enter'.`);
    Client.debug(`2) Use 'space' to select multiple options.`);
    Client.debug(`3) Navigate selection with 'up' and 'down'.`);
    Client.debug('');
    Client.log(`NOTICE: At any point in time you want to cancel, press 'escape' to abort the current operation.`);
    Client.debug('');
}

export async function onSetup(db, config)
{
    /**
     * Loading - Where all data should be loaded from file. This
     * should be raw data as defined by the user. No modifications
     * should take place; they will be considered for alterations
     * in the processing stage.
     */
}

export async function onPreProcess(db, config)
{
    /**
     * Processing - Where all data is evaluated and processed into
     * valid and useful information. This is also where most of the
     * errors not related to IO will be thrown. This stage consists
     * of two steps: the review and the resolution. The resolution
     * step will attempt to automatically format and validate the
     * data. If it is unable to then the data is invalid and is
     * flagged for review by the user. Therefore, the review step,
     * which processes all user-created reviews, is computed before
     * the resolution. This is a frequent debug loop.
     */
}

export async function onPostProcess(db, config)
{

}

export async function onOutput(db, config)
{
    /**
     * Outputting - Where all data is outputted into relevant
     * files. If any errors had occured, it will exit-early and
     * output any gathered debug information.
     */
}

export async function onError(db, config, error)
{
    try
    {
        // Last ditch attempt to save progress...
        DatabaseSolver.outputErrorLog(db, config, [error]);
    }
    catch(e) {}
}

export async function onStop(db, config)
{

}

export async function showError(db, config, error)
{
    Client.formattedError(error, (config && config.debug) || false);
}

export async function tryRestartOnError(db, config, error)
{
    // Usually we ask after an error or something.
    return await Client.ask('Could not resolve errors. Restart?');
}
