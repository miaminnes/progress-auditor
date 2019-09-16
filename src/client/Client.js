import Enquirer from 'enquirer';
import * as DateUtil from '../util/DateUtil.js';
import chalk from 'chalk';
import figlet from 'figlet';

export const DIVIDER_LENGTH = 80;
export const CHOICE_SEPARATOR = { role: 'separator' };

export function log(message)
{
    console.log(message);
}

export function debug(message)
{
    console.log(chalk.gray(message));
}

export function skippedError(message, error)
{
    console.error(message + " - " + error.message + "...skipping error...");
}

export async function wait(seconds, message = undefined)
{
    if (message) console.log(message);
    await new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

export function divider(token = 'nu')
{
    console.log(chalk.gray(
        token.repeat(Math.floor(DIVIDER_LENGTH / token.length))
        + token.substring(0, DIVIDER_LENGTH % token.length)
    ));
}

export function doTheBigTitleThing(title = 'Progress Auditor', subtitle = 'Version v?.?.?')
{
    divider();
    console.log(chalk.green(figlet.textSync(title, { font: 'Big' })));
    if (subtitle)
    {
        console.log(subtitle.padStart(DIVIDER_LENGTH, ' '));
    }
    divider();
}

export async function prompt(question)
{
    return await Enquirer.prompt(question);
}

export async function askPrompt(message, type, opts = {})
{
    const { answer } = await Enquirer.prompt({
        type,
        message,
        name: 'answer',
        ...opts
    });
    return answer;
}

export async function ask(message)
{
    const { answer } =  await Enquirer.prompt({
        type: 'confirm',
        name: 'answer',
        message,
    });
    return answer;
}

export async function askChoose(message, choices)
{
    const { answer } =  await Enquirer.prompt({
        type: 'select',
        name: 'answer',
        message,
        choices,
    });
    return answer;
}

export async function askPath(message, exists = true, isDirectory = false, validate = undefined)
{
    const fs = require('fs');
    return await askPrompt(message, 'input', {
        validate: value =>
        {
            if (validate) validate.call(null, value);
            if (!exists) return true;
            if (!fs.existsSync(value))
            {
                return "Path does not exist.";
            }
            else
            {
                const stat = fs.lstatSync(value);
                if (isDirectory && !stat.isDirectory())
                {
                    return "Path is not a directory.";
                }
                else if (!isDirectory && !stat.isFile())
                {
                    return "Path is not a file.";
                }
            }
            return true;
        }
    });
}

export async function askFindFile(message, directory = '.', validate = undefined)
{
    const DIRECTORY_SYMBOL = '\u2192';
    const fs = require('fs');
    const path = require('path');
    directory = path.resolve(directory);

    let result = null;
    do
    {
        const files = fs.readdirSync(directory, { withFileTypes: true });

        const choices = [];
        choices.push({
            message: `${DIRECTORY_SYMBOL} .`,
            value: { directory: true, name: '.' },
        });
        choices.push({
            message: `${DIRECTORY_SYMBOL} ..`,
            value: { directory: true, name: '..' },
        });
        for(const dirent of files)
        {
            if (dirent.isDirectory())
            {
                choices.push({
                    message: `${DIRECTORY_SYMBOL} ${dirent.name}/`,
                    value: { directory: true, name: dirent.name },
                });
            }
            else
            {
                choices.push({
                    message: `  ${dirent.name}`,
                    value: { directory: false, name: dirent.name },
                });
            }
        }

        const prompt = new Enquirer.AutoComplete({
            type: 'autocomplete',
            name: 'file',
            message,
            limit: 10,
            choices,
            format: value => {
                if (typeof value === 'string')
                {
                    return directory + '/' + value;
                }
                else
                {
                    return directory + '/' + value.name;
                }
            },
            suggest: (input, choices) =>
            {
                let str = input.toLowerCase();
                const result = choices.filter(ch => ch.message.toLowerCase().includes(str));

                // Add the custom path as a selectable option...
                result.push({ message: input });

                return result;
            },
            validate: value =>
            {
                if (typeof value === 'string')
                {
                    if (!fs.existsSync(path.resolve(directory, value)))
                    {
                        return "File does not exist.";
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    // It's already been checked to have existed.
                    return true;
                }
            }
        });

        let fileEntry = await prompt.run();
        let filePath;

        // Client used the custom path instead...
        if (typeof fileEntry === 'string')
        {
            filePath = path.resolve(directory, fileEntry);
            
            // filePath is guaranteed to exist due to validate()...
            fileEntry = {
                directory: fs.lstatSync(filePath).isDirectory(),
                name: fileEntry,
            };
        }
        // Client picked one from the list...
        else
        {
            filePath = path.resolve(directory, fileEntry.name);
        }

        if (fileEntry.directory)
        {
            directory = filePath;
        }
        else if (!validate || validate.call(null, filePath))
        {
            result = filePath;
            break;
        }
        else
        {
            result = null;
        }

        // Clear it for the next directory...
        prompt.clear();
    }
    while(!result)

    return result;
}

export async function askDate(message)
{
    return await askPrompt(message, 'input', {
        hint: "YYYY-MM-DD-hh-mm-ss (You don't need the time)",
        validate: value =>
        {
            try
            {
                DateUtil.parse(value);
            }
            catch(e)
            {
                return e.message;
            }
            return true;
        }
    });
}