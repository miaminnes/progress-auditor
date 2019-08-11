const path = require('path');
const { UserDatabase, AssignmentDatabase, FileUtil, TableBuilder } = Library;

async function output(db, outputPath, config)
{
    // COMPLETE = 0x2713 (checkmark)
    const COMPLETE_TOKEN = '\u2713';
    // INCOMPLETE = 0x2717 (cross) (RED)
    const INCOMPLETE_TOKEN = '\u2717';
    // UNASSIGNED = _ (empty)
    const UNASSIGNED_TOKEN = '\u25A0';
    const INPROGRESS_TOKEN = '...';
    // INREVIEW = ?
    const INREVIEW_TOKEN = '?';
    // POSTPONED = ...
    const POSTPONED_TOKEN = '...';
    // OUTOFBOUNDS = 0x25A0 (filled square) (DARK)
    const OUTOFBOUNDS_TOKEN = '_';

    const tableBuilder = new TableBuilder();
    tableBuilder.addColumn('User ID');
    tableBuilder.addColumn('Used Slips', (userID) => {
        return UserDatabase.getUserByID(db, userID).attributes.slips.used;
    });
    tableBuilder.addColumn('Remaining Slips', (userID) => {
        return UserDatabase.getUserByID(db, userID).attributes.slips.remaining;
    });
    tableBuilder.addColumn('Average Slips', (userID) => {
        return UserDatabase.getUserByID(db, userID).attributes.slips.average;
    });
    tableBuilder.addColumn('Max Slips', (userID) => {
        return UserDatabase.getUserByID(db, userID).attributes.slips.max;
    });
    tableBuilder.addColumn('Auto-report', (userID) => {
        // The auto-report threshold formula
        // Check the average if maintained from today, would it exceed by the end date.
        const averageSlips = UserDatabase.getUserByID(db, userID).attributes.slips.average;
        // Check if there are any holes in submissions.
        // Check if intro or week 1 is past due date.
        return 'N/A';
    });

    const assignments = ['intro', 'week[1]', 'week[2]', 'week[3]', 'week[4]', 'week[5]', 'week[6]'];
    for(const assignmentID of assignments)
    {
        tableBuilder.addColumn(assignmentID + ' Status', (userID) => {
            const assignment = AssignmentDatabase.getAssignmentByID(db, userID, assignmentID);
            if (!assignment) return '!ERROR';
            return assignment.attributes.status;
        });
        tableBuilder.addColumn(assignmentID + ' Slips', (userID) => {
            const assignment = AssignmentDatabase.getAssignmentByID(db, userID, assignmentID);
            if (!assignment) return '!ERROR';
            return assignment.attributes.slips;
        });
    }

    // Populate the table...
    for(const userID of UserDatabase.getUsers(db))
    {
        tableBuilder.addEntry(userID);
    }
    
    const outputTable = tableBuilder.build();
    FileUtil.writeTableToCSV(path.resolve(outputPath, 'slip-days.csv'), outputTable);
}

module.exports = {
    output
};