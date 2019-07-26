/** Creates an assignment for the name and due date. */
function createAssignment(name, date)
{
    return { name, date };
}

/**
 * Generates an array of assignments by the week based on the students time frame.
 * @param {Object} schedule The schedule object for the student generated by createSchedule().
 * @returns {Array<Object>} An array of assignments, with name and due date.
 * However, it does NOT order by time. For example, the intro assignment could be due
 * before or after week 1, but may be placed in any order. The order is only for
 * visual and output reasons.
 */
function generateAssignments(schedule)
{
    const result = [];

    // Add week 0 deadline - this does not follow the formats of
    // the other due dates. Instead, it is exactly 1 week after
    // the start date. This also means it can overlap with week 1.
    // Therefore, the resulting array may not be ordered by time.
    const week0 = new Date(schedule.startDate);
    week0.setDate(week0.getDate() + 7);
    result.push(createAssignment('intro', week0));

    // Add additional assignments here. The order described here will
    // persist to the eventual output (as CSV, PDF, etc.).

    // Add the remaining weekly due dates. This includes the last
    // week (even if partial week, they may still need to turn it in,
    // depending on the threshold set)...
    let pastSunday = new Date(schedule.startSunday);
    for(let i = 0; i < schedule.weeks; ++i)
    {
        // Go to next Sunday...
        pastSunday.setDate(pastSunday.getDate() + 7);
        // Add the next week to result...
        result.push(createAssignment('week' + (i + 1), new Date(pastSunday)));
    }
    // Rename last week's assignment to 'last'
    result[result.length - 1].name = 'last';

    return result;
}

module.exports = {
    createAssignment,
    generateAssignments
};