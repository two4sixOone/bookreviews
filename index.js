import express from "express";
import axios from "axios";
import pg from "pg";
import {getReviewsQuery} from "./queries.js";
import {dbPass} from "./pass-keys.js";

const app = express();
const port = 3000;
const API_URL = "https://covers.openlibrary.org/b/";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: dbPass,
    port: 5432,
});
db.connect();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

let reviews = [];

app.get("/", async (req, res) => {
    await getReviews();
    reviews = await Promise.all(reviews.map(async (review) => {
        const image = await retrieveBookImageByIdentifier(review.identifier, review.identifier_type);
        return {
            ...review,
            image: image,
            formatted_date: new Date(review.date_read).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            })
        };
    }));
    res.render("index.ejs", {reviews: reviews});
});

app.get("/review", (req, res) => {
    const selectedReview = getReviewById((req.query.reviewId));
    res.render("review.ejs", {review: selectedReview});
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

/*
Returns an array of JS objects with the content needed to display reviews (includes reviews, authors, books,
book_authors tables).
 */
async function getReviews() {
    try {
        const {rows} = await db.query(getReviewsQuery);
        reviews = rows;
    } catch (err) {
        console.error("Error retrieving reviews", err.stack);
    }
}

/*
Makes an API call to openlibrary.org to retrieve book cover images.
 */
async function retrieveBookImageByIdentifier(identifier, type) {
    try {
        const response = await axios.get(API_URL + type + "/" + identifier + "-M.jpg");
        return response.config.url; // Return the image URL
    } catch (err) {
        console.error(`Error retrieving cover image with type: ${type} and value: ${identifier}`, err.stack);
        return null;
    }
}

function getReviewById(id) {
    return reviews.find(review => {
        return review.id == id;
    });
}