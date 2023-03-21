import React from 'react'

export default function DBTest() {

    async function handleInsert() {
        const res = await fetch('./api/localmovies',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                movieID: 5,
                title: "Wild Hogs"
            })
        })
        const resBody = await res.json()
        console.log(resBody)
    }

    async function handleReview() {
        const res = await fetch('./api/reviews',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                movieID: 5,
                reviewerID: 1,
                stars: 5,
                content: "I like this movie",
                random: "bfheuiob"
            })
        })
        const resBody = await res.json()
        console.log(resBody)
    }

    async function handleGet() {
        const res = await fetch('./api/localmovies?id=5',
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resBody = await res.json()
        console.log(resBody)
    }

    async function handleGetReviews() {
        const res = await fetch('./api/reviews?id=5',
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resBody = await res.json()
        console.log(resBody)
    }

    async function handleUpdateReview() {
        const res = await fetch('./api/reviews',
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                movieID: 5,
                reviewerID: 1,
                stars: 3,
                content: "Decent"
            })
        })
        const resBody = await res.json()
        console.log(resBody)
    }

    async function handleDelete() {
        const res = await fetch('./api/reviews',
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                movieID: 5,
                reviewerID: 1
            })
        })
        const resBody = await res.json()
        console.log(resBody)
    }

    return (
        <>
            <button onClick={handleInsert}>Insert Test</button>
            <button onClick={handleGet}>Get Test</button>
            <button onClick={handleReview}>Add Review</button>
            <button onClick={handleGetReviews}>Get Reviews</button>
            <button onClick={handleUpdateReview}>Update Review</button>
            <button onClick={handleDelete}>Delete Review</button>
        </>
        
    )
}