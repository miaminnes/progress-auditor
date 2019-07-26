const SubmissionDatabase = require('../database/SubmissionDatabase.js');

async function resolve(db)
{
    for(const submissionID of SubmissionDatabase.getSubmissions(db))
    {
        const submission = SubmissionDatabase.getSubmissionByID(db, submissionID);
        if (submission.assignment === 'null')
        {
            const unassignedSubmission = submission;

            let resolved = false;
            const ownerKey = unassignedSubmission.owner;
            const assignedSubmissions = SubmissionDatabase.getAssignedSubmissionsByOwnerKey(db, ownerKey);
            for(const [assignmentID, submissions] of Object.entries(assignedSubmissions))
            {
                // If it is a properly assigned assignment...
                if (assignmentID === 'null') continue;

                for(const ownedSubmission of submissions)
                {
                    // And it has the same post id as the unassigned one...
                    if (unassignedSubmission.attributes.content.id === ownedSubmission.attributes.content.id)
                    {
                        // It should be of the same assignment :D
                        SubmissionDatabase.changeSubmissionAssignment(db, unassignedSubmission, ownedSubmission.assignment);
                        resolved = true;
                    }

                    if (resolved) break;
                }
                if (resolved) break;
            }
        }
    }
}

module.exports = {
    resolve
};