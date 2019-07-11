const fs = require('fs');
const readline = require('readline');

/**
 * Reads a file asynchronously and processes the file by line.
 * @param {String} filepath The file path to the file to be read.
 * @param {*} callback The callback function to process the line read.
 */
function readFileByLine(filepath, callback)
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

// TODO: Temporary hack for writing files, NOT ASYNC!
function writeToFile(filepath, content)
{
    const fs = require('fs');
    fs.writeFile(filepath, content, function(err) {
        if (err)
        {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
}

function writeTableToCSV(filepath, table)
{
    writeToFile(filepath, table.map(e => e.join(',')).join('\n'));
}

module.exports = {
    readFileByLine,
    writeToFile,
    writeTableToCSV,
};