import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '../components/Spinner'
import ErrorContainer from '../components/ErrorContainer'
import useGetReviews from '../hooks/useGetReviews'
import ReviewCard from './ReviewCard'
// import { css } from '@emotion/react'
import styled from '@emotion/styled'

const searchResultStyle = styled.div `
    .query-contents {
        height: 93%;
        color: green !important;
    }
    // height: 93%;
    color: green;

    .query-obj {
        height: 87%;
        overflow-y: scroll;
    }
`

const SearchResults = styled.div`
    .query-contents {
        height: 93%;
    }
    height: 90%;
    // color: green;
    overflow-y: scroll;
    padding: 10px;

    .query-obj {
        // height: 87%;
        // overflow-y: scroll;
    }

    img {
        height: 200px;
    }

`


function Reviews(props, { query }) {
    const router = useRouter();
    const [ searchParams, setSearchParams ] = useState(router.query.query)

    const [ inputQuery, setInputQuery ] = useState("")

    const [ reviews, loading, error, movieInfo, ratings ] = useGetReviews(searchParams)
    // console.log("Ratings:", ratings)

    useEffect(()=>{
        if (!inputQuery) {
            console.log("Inside useEffect, router is ", router)
            setSearchParams(router.query.movieid)
            setInputQuery(router.query.movieid)
            console.log("Search and input queries in order:", searchParams, setInputQuery)
        }

    })

    // console.log("Poster: https://image.tmdb.org/t/p/original"+ movieInfo.poster_path)
    
    return (
        
        <SearchResults id="query-contents">
            {/* {reviews.length>0? <h2>Found reviews:</h2> : <h2>No reviews found</h2>} */}
            {movieInfo.poster_path? <img src={"https://image.tmdb.org/t/p/original" + movieInfo.poster_path}/> : null}

            {reviews.length>0? <h2>{movieInfo.title}</h2> : <h2>No reviews found</h2>}

            {error && <ErrorContainer>An error occurred...</ErrorContainer>}
            {loading ? <Spinner /> : (
                <div className="query-obj">
                    {ratings.map(rating => {
                        console.log("Rating: ", rating)
                        return(<p>{rating.Source}: {rating.Value}</p>)
                    })}
                    {reviews.map(review => (
                        <ReviewCard reviewObj={review} />
                    ))}
                </div>
            )}
        
        </SearchResults>
        
    )
}

export default Reviews