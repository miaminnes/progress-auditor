import * as Client from '../client/Client.js';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Papa = require('papaparse');

export function readJSONFile(filepath)
{
    const data = fs.readFileSync(filepath);
    return JSON.parse(data);
}

/**
 * Reads a csv file asynchronously and processes the file by row.
 * @param {String} filepath The file path to the file to be read.
 * @param {Function} callback The callback function to process the row read.
 */
export function readCSVFileByRow(filepath, callback)
{
    return new Promise((resolve, reject) => {
        const input = fs.createReadStream(filepath);
        Papa.parse(input, {
            step: (row) => callback(row.data),
            complete: resolve,
            error: reject
        });

    });
}

/**
 * Reads a file asynchronously and processes the file by line.
 * @param {String} filepath The file path to the file to be read.
 * @param {Function} callback The callback function to process the line read.
 */
export function readFileByLine(filepath, callback)
{
    return new Promise((resolve, reject) => {
        const input = fs.createReadStream(filepath);
        const rd = readline.createInterface({ input });
        input.on('error', (e) => {
            console.error(e);
            reject(e);
        });
        rd.on('line', callback);
        rd.on('close', () => {
            resolve();
        });
    });
}

export async function writeToFile(filepath, content)
{
    fs.mkdirSync(path.dirname(filepath), { recursive: true });

    if (await checkExistsOverwrite(filepath))
    {
        return new Promise((resolve, reject) =>
        {
            fs.writeFile(filepath, content, (err) =>
            {
                if (err) { reject(err); }
                console.log("File saved:", filepath);
                resolve();
            });
        });
    }
}

export async function writeTableToCSV(filepath, table)
{
    await writeToFile(filepath, table.map(e => e.join(',')).join('\n'));
}

export async function checkExistsOverwrite(filepath)
{
    return !fs.existsSync(filepath) || await Client.ask(`File '${path.basename(filepath)}' already exists. Are you sure you want to overwrite it?`);
}