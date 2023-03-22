/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '../components/Spinner'
import ErrorContainer from '../components/ErrorContainer'
import useGetReviews from '../hooks/useGetReviews'
import ReviewCard from './ReviewCard'
// import { css } from '@emotion/react'
import styled from '@emotion/styled'

const MovieHeader = styled.div `
    display: flex;
    flex-direction: row;
    outline: dashed grey;
    padding: 20px;
    margin-bottom: 20px;

    img {
        height: 200px;
    }
    
`

const SearchResults = styled.div`
    
    height: 90%;
    // color: green;
    overflow-y: scroll;
    padding: 10px;

    .query-contents {
        height: 93%;
    }

    .query-obj {
        // height: 87%;
        // overflow-y: scroll;
    }

`

const StyledRatings = styled.div`
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    h2 {
        font-size: 40px;
        margin-bottom: 10px;
        font-weight: normal;
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

    }, [inputQuery, router, searchParams])
    
    return (
        
        <SearchResults id="query-contents">
            {/* {reviews.length>0? <h2>Found reviews:</h2> : <h2>No reviews found</h2>} */}
            {error && <ErrorContainer>An error occurred...</ErrorContainer>}
            

            {loading ? <Spinner /> : (
                <div className="query-obj">
                    <MovieHeader>
                        {movieInfo.poster_path? <img src={"https://image.tmdb.org/t/p/original" + movieInfo.poster_path}/> : null}
                        <StyledRatings>
                            <h2>{movieInfo.title}</h2>
                            {ratings.map(rating => {
                                    // console.log("Rating: ", rating)
                                    return(<p key={rating.key}>{rating.Source}: {rating.Value}</p>)
                                })}
                        </StyledRatings>
                        
                    </MovieHeader>
                    {reviews.length>0? null : <h2>No reviews found</h2>}

                    {reviews.map(review => (
                        <ReviewCard reviewObj={review} key={review.id} />
                    ))}
                </div>
            )}
        
        </SearchResults>
        
    )
}

export default Reviews
