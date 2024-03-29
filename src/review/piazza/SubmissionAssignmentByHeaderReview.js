import * as UserDatabase from '../../database/UserDatabase.js';
import * as SubmissionDatabase from '../../database/SubmissionDatabase.js';
import * as AssignmentDatabase from '../../database/AssignmentDatabase.js';
import * as DateUtil from '../../util/DateUtil.js';

import * as Errors from '../helper/Errors.js';

const ERROR_TAG = 'REVIEW';

const SUBMISSION_TYPE_UNKNOWN = 'unknown';
const SUBMISSION_TYPE_SOURCE = 'source';
const SUBMISSION_TYPE_MINOR_EDIT = 'minor';
const SUBMISSION_TYPE_MAJOR_EDIT = 'major';

export const TYPE = 'assignment_by_header';
export const DESCRIPTION = 'Assigns submission by matching post headers.';

/**
 * Searches through all submissions and assigns them to the appropriate assignment.
 * @param {Database} db The database.
 * @param {Config} config The config.
 */
export async function review(db, config)
{
    try
    {
        for(const ownerKey of SubmissionDatabase.getOwners(db))
        {
            const userID = UserDatabase.getUserByOwnerKey(db, ownerKey);
            if (userID)
            {
                // Found owner -> user match! Now resolve post type...
                const submittedAssignments = SubmissionDatabase.getAssignedSubmissionsByOwnerKey(db, ownerKey);
                for(const assignmentID of Object.keys(submittedAssignments))
                {
                    // Submissions are guaranteed to be in-order by time. The most recent entry being the last.
                    const submissions = submittedAssignments[assignmentID];
                    
                    const ownedAssignment = AssignmentDatabase.getAssignmentByID(db, userID, assignmentID);
                    if (ownedAssignment)
                    {
                        const dueDate = ownedAssignment.dueDate;
                        // TODO: baseSubmission will change if there are reviews. That would mean the new reviewed will be the base.
                        const baseSubmission = getNearestSubmission(submissions, dueDate);
                        const nextSubmission = submissions[submissions.length - 1];
                        const postType = evaluatePostType(nextSubmission, baseSubmission);
        
                        // TODO: Always review major post edits. There is a post edit only if PAST the due date. Otherwise, it would be the new source.
                        // TODO: Should NOT ALWAYS pick the earliest one.
                        setGradedSubmissionForAssignment(db, userID, assignmentID, baseSubmission);
                        /*
                        if (postType === 'major')
                        {
                            setGradedSubmissionForAssignment(db, userID, assignmentID, nextSubmission);
                        }
                        else if (postType === 'source' || postType === 'minor')
                        {
                            setGradedSubmissionForAssignment(db, userID, assignmentID, baseSubmission);
                        }
                        else
                        {
                            db.throwError('[UNKNOWN_SUBMISSION_TYPE]\t', 'Unknown submission type - cannot evaluate edited post -', postType, '- DUE:', dueDate);
                            db.throwError('\t\t\t\t\t\t\t\tSubmission:', baseSubmission, '\n=-=-=-=-=-=>\n', nextSubmission);
                        }
                        */
                    }
                    else
                    {
                        for(const submission of submissions)
                        {
                            Errors.throwUnassignedSubmissionError(db, { id: userID + ':' + assignmentID, type: TYPE }, userID, assignmentID, submission);
                        }
                    }
                }
            }
            else
            {
                const submissions = SubmissionDatabase.getAssignedSubmissionsByOwnerKey(db, ownerKey);
                Errors.throwUnownedSubmissionError(db, { id: ownerKey, type: TYPE }, ownerKey, submissions);
            }
        }
    }
    catch(e)
    {
        db.throwError(ERROR_TAG, e);
    }
}

// No build mode for this review...
export const build = undefined;

function evaluatePostType(submission, baseSubmission)
{
    if (submission === baseSubmission) return SUBMISSION_TYPE_SOURCE;
    // There are posts that have the same content, but different times. They are treated as minor edits;
    if (submission.attributes.content.body == baseSubmission.attributes.content.body) return SUBMISSION_TYPE_MINOR_EDIT;
    if (submission.attributes.content.body != baseSubmission.attributes.content.body) return SUBMISSION_TYPE_MAJOR_EDIT;

    // TODO: This will never be reached, but once we have a tolerance function for the body content compare, it will.
    if (submission.attributes.content.head != baseSubmission.attributes.content.head) return SUBMISSION_TYPE_MINOR_EDIT;
    return SUBMISSION_TYPE_UNKNOWN;
}

function setGradedSubmissionForAssignment(db, userID, assignmentID, submission)
{
    const assignment = AssignmentDatabase.getAssignmentByID(db, userID, assignmentID);
    assignment.attributes.submission = submission;
}

function getNearestSubmission(submissions, targetDate)
{
    let minSubmission = null;
    let minDateOffset = Infinity;
    for(const submission of submissions)
    {
        const dateOffset = DateUtil.compareDates(submission.date, targetDate);

        // If there exists a submission BEFORE the due date, return that one.
        if (minSubmission && dateOffset > 0)
        {
            return minSubmission;
        }

        // Otherwise...
        if (Math.abs(dateOffset) < minDateOffset)
        {
            minSubmission = submission;
            minDateOffset = Math.abs(dateOffset);
        }
    }
    return minSubmission;
}

