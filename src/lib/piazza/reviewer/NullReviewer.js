export const REVIEW_ID = 'unknown';

export async function review(db, reviewID, reviewType, reviewParams)
{
    db.throwError(`[UNKNOWN_REVIEW] Unknown review type '${reviewType}'.`);
}