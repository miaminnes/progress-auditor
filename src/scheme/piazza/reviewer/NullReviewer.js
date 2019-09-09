const ERROR_TAG = 'REVIEW';

export const REVIEW_TYPE = 'null';
export const REVIEW_DESC = 'Unknown review type.';
export const REVIEW_PARAM_TYPES = [];

export async function review(db, config, reviewID, reviewType, reviewParams)
{
    db.throwError(ERROR_TAG, `Unhandled review type ${reviewType} for review '${reviewID}'.`, {
        id: [reviewID, reviewType],
        options: [
            `You probably misspelled the review type.`,
            `Ask the developer to handle a new '${reviewType}' review type.`
        ]
    });
}