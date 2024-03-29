# Progress Auditor
*CSE 197 Submission Management Program*

Created by Professor Mia Minnes

Developed by Andrew Kuo

---

## Purpose
To make a program that streamlines and tracks the grading and logistics of discussion-based turnin processes.

## Table of Contents
* [Usage](#usage)
* [Getting Started](#setting-up-the-workspace)
* [Running the Program](#running-the-program)
* [Building for Production](#building-for-production)
* [Project Structure](#project-structure)
  * [Entry Point](#entry-point)

---

## Compatibility
- [x] Windows
- [x] Mac
- [x] Linux

---

## Usage

You will need 2 things:
- The executable for your platform
- A config file called 'config.json' next to it

Make sure to choose the correct executable for your platform. You can double-click to run them in interactive mode or execute them through the terminal.

There are generally 3 types of prompts:
- **Confirmation prompts**: answer with 'y' or 'n' (no need to press 'enter').
- **Select prompts**: choose with 'up' or 'down' arrow keys. Press 'enter' to select. If multiple answers are allowed, use 'space' to select multiple choices and press 'enter' when done.
- **Input promps**: type in your answer and press 'enter' when done.

The general rule is to:
- Press 'enter' to confirm your answer
- Use 'up' and 'down' to navigate
- If multiple answers are allowed, use 'space' to select then press 'enter' to finalize.

**NOTE**: If you want to cancel the operation at anytime, press 'escape'.

Here are the available options for the config file:

| Name              | Description  | Examples |
| ----------------- | ------------ | -------- |
| scheme            | The review procedures to execute. Currently, only 'piazza' is available. | "piazza" |
| inputPath         | The path to the input files. | ./inputs/ |
| outputPath        | The path to the output files. | ./outputs/ |
| currentDate       | The date of the execution. Could be used to simulate older executions. | "2019-01-01" |
| includes          | An array of file paths to other configs. This will load and merge the configs in these directories. The top-level, the current config, will override all included configs and so on. | [ "./base", "../siblingPath/otherDirectory" ] |
| assignments       | An array of assignment entry objects. | /* Refer below. */ |
| inputs            | An array of input entry objects. | /* Refer below. */ |
| outputs           | An array of output entry objects. | /* Refer below. */ |
| outputAutoDate    | Whether to write output into a directory named by date of execution. | true |
| debug             | Whether to enable debug mode for more debugging information, such as stack traces. To output debug logs, add a debug entry to the outputs instead. | false |

Here's an example config file:
```json
{
    "currentDate": "2020-01-01",
    "include": [],
    "scheme": "piazza",
    "inputPath": "./inputs",
    "outputPath": "./outputs",
    "outputAutoDate": true,
    "debug": false,
    "assignments": [
        {
            "assignmentName": "intro",
            "pattern": "intro",
            "opts": {}
        },
        {
            "assignmentName": "week",
            "pattern": "sunday",
            "opts": {}
        },
        {
            "assignmentName": "last",
            "pattern": "last",
            "opts": {}
        }
    ],
    "inputs": [
        {
            "inputName": "reviews.csv",
            "parser": "reviews",
            "opts": {}
        },
        {
            "inputName": "contributions.csv",
            "parser": "contributions",
            "opts": {}
        },
        {
            "inputName": "cohort.csv",
            "parser": "cohort",
            "opts": {
                "maxEndDates": [
                    { "pattern": "Special Summer Session", "endDate": "2020-10-10" }
                ]
            }
        }
    ],
    "outputs": [
        {
            "outputName": "debug",
            "format": "debug"
        },
        {
            "outputName": "slip-days.csv",
            "format": "instructor"
        },
        {
            "outputName": "reports.csv",
            "format": "student",
            "opts": {
                "exportPDF": "reports.pdf",
                "customIntro": "Good morning!",
                "customOutro": "Have a nice day!"
            }
        }
    ]
}
```

### Assignment Entries
| Property  | Description |
| --------- | ----------- |
| assignmentName | The unique assignment name. |
| pattern    | The due date assigning pattern type. The currently implemented parsers are `intro`, `sunday`, and `last`. |
| opts      | Any additional options for the assignment. |
| opts.customPath | You can specify a custom script by setting this to the path to the custom assigner. |

Example:
```json
{
    "assignmentName": "week",
    "pattern": "sunday",
    "opts": {}
}
```

### Input Entries
| Property  | Description |
| --------- | ----------- |
| inputName | The input file name or path relative to the `inputPath`. |
| parser    | The parser type. The currently implemented parsers are `cohort`, `contributions`, and `reviews`. |
| opts      | Any additional options for the input file. |
| opts.customPath | You can specify a custom script by setting this to the path to the custom parser. |
| opts.maxEndDates | You can specify an array of maximum end dates for any user given the matching pattern. Each entry takes a regex pattern to match and a date. This is only implemented for cohort. |

Example:
```json
{
    "inputName": "cohort.csv",
    "parser": "cohort",
    "opts": {}
}
```

#### Max End Date Entries
These entries are only available for the cohort parser.

| Property  | Description |
| --------- | ----------- |
| pattern | The regex pattern to match in cohort for each user if they should have their schedule be limited by the max end date. |
| endDate | The maximum possible end date for the matched users. |

Example:
```json
{
    "inputName": "cohort.csv",
    "parser": "cohort",
    "opts": {
        "maxEndDates": [
            { "pattern": "Special Summer Session 2018", "endDate": "2018-7-11" },
            { "pattern": "Special Summer Session 2019", "endDate": "2019-8-23" },
            { "pattern": "Winter 2020", "endDate": "2020-03-15" }
        ]
    }
}
```

### Output Entries
| Property  | Description |
| --------- | ----------- |
| outputName | The output file name or path relative to the `inputPath`. |
| format    | The format type. The currently implemented parsers are `instructor`, `student`, and `debug`. |
| opts      | Any additional options for the output file. |
| opts.customPath | You can specify a custom script by setting this to the path to the custom output. |
| opts.exportPDF | The PDF output file name for the `student` output type. This will enable PDF export. |
| opts.customIntro | A custom intro to prepend to each PDF output. |
| opts.customOutro | A custom intro to append to each PDF output. |

Example:
```json
{
    "outputName": "reports.csv",
    "format": "student",
    "opts": {
        "exportPDF": "reports.pdf",
        "customIntro": "Hello!",
        "customOutro": "Goodbye!"
    }
}
```

## Contributing

### Installing [Node.js](https://nodejs.org/en/)
This is required to test the program. Just get the current version and install it.

### Installing [Git](https://git-scm.com/)
This is required to edit the program remotely. Just get the current version and install it. The repository is hosted at [GitHub](https://github.com/andykuo1/progress-auditor).

### Installing [VS Code](https://code.visualstudio.com/)
This is not required, but recommended (by me). Just get the current version and install it.

Otherwise, you just need a text editor to write JavaScript, HTML, and CSS.

**Note:** Be sure to get the compatible versions for your operating system.

#### Recommended VS Code Packages
* [Excel Viewer](https://marketplace.visualstudio.com/items?itemName=GrapeCity.gc-excelviewer)
  * Let's you look at CSV files with filters.
* [vscode-pdf](https://marketplace.visualstudio.com/items?itemName=tomoki1207.pdf)
  * Allows you to open and view PDF files.

### Getting the remote repository
Open a command line or terminal and enter a directory to where to copy the project repository. This can be anywhere in your local file system (like your home directory). For example:

```
cd ~/
```

Then, clone the [repo](https://github.com/andykuo1/progress-auditor.git) to the directory.

```
git clone https://github.com/andykuo1/progress-auditor.git
```

Navigate into the directory of the repository.

```
cd progress-auditor
```

To ensure and verify the state of the repository enter the following command:

```
git status
```

### Installing dependencies
Open a command line or terminal and enter into the project directory. This should be where you've copied the remote repository. Following the previous example:

```
cd ~/progress-auditor
```

If you want to inspect the contents of this directory, it should contain the project files, such as `package.json`.

Then run the following command:

```
npm install
```

This should automatically start installing the dependencies (as listed in `package.json`). After it finishes, it should create a directory called `node_modules`, which contains all required dependencies.

**Note:** The `node_modules` directory sometimes contains files unique to each platform so this directory SHOULD NOT be committed to the repository.

**Note:** If a `package-lock.json` is created, it should be committed to the repo. It should not be ignored.

After that, the project is ready to run. _Happy coding!_

---

## Running the Program
After saving any changes to a file, open a command line or terminal and enter into the project directory.

**Note:** If using the recommended `VS Code` package, the in-editor terminal is automatically opened at the project directory. (No need to `cd` every time!)

### Production Build
To "compile" the scripts for public distribution:

```
npm run build
```

**Note:** This will bundle all the resources and assets required into `dist`. It will also "uglify" the code to reduce size and apply other optimizations.

Then, open the program. Either by just opening the outputted executable file itself or running the command:

```
npm start
```

### Development Build
Currently there is no other way to build the project. Due to its rather small size, building the production build every time is not a huge concern.

---

## Building for Production
First, bump the version number in `package.json` and update the `CHANGELOG.md` with the new additions, removals, and fixes.

Then, run this to make sure all dependencies are installed correctly (or update them if necessary). 

```
npm install
```

Then, build and make sure it compiles:

```
npm run start
```

Then, compile build files for production.

```
npm run build-all
```

This will generate the files in `dist` for each supported platform. These files should be not be pushed, but keep these files for later.

You should now be able to commit and push your these changes.

Once done, we will upload the output files generated earlier as a release (be sure the version is correct).

And that should be all :)

---

## Project Structure

### Entry point
The entry point for the code is in `src/bin.js` (if bundled, this will be referred to by `package.json` through the property `bin`).

This script manages the interactive menu and handles starting the program. For the actual implementations, you should checkout `main.js` and `index.js`. `index.js` handles the imports/exports used and `main.js` handles the lifecycle of the program itself.

### Conclusion
If you have any more questions, please contact Professor Mia Minnes.

Or, you can contact me: ank060@ucsd.edu

_(Please begin the subject with 'UCSD Progress Auditor')_

Thank you for reading me!
