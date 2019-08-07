const path = require('path');

const ReviewDatabase = require('../../database/ReviewDatabase.js');

async function processReviews(db, config)
{
    // Process reviews...
    console.log(`......Looking over our work...`);

    const reviewers = new Map();
    for(const reviewerConfig of config.reviewers)
    {
        const filePath = reviewerConfig.filePath;
        const name = reviewerConfig.name;
        const reviewer = require(filePath);

        console.log(`.........Reviewing '${name}' with '${path.basename(reviewerConfig.filePath)}'...`);

        reviewers.set(name, reviewer);
    }

    const reviewResults = [];
    for(const reviewID of ReviewDatabase.getReviews(db))
    {
        const review = ReviewDatabase.getReviewByID(db, reviewID);
        const reviewType = review.type;
        const reviewParams = review.params;

        let reviewer;
        if (reviewers.has(reviewType))
        {
            reviewer = reviewers.get(reviewType);
        }
        else
        {
            reviewer = reviewers.get('unknown');
        }

        reviewResults.push(reviewer.review(db, reviewID, reviewType, reviewParams));
    }

    return Promise.all(reviewResults);
}

module.exports = {
    processReviews
};