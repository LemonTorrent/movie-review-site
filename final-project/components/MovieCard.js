import React, { setState, useState, useEffect } from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

function MovieCard ({ movieObj }) {

    const Card = styled.div({
        color: 'red',
    })

    const CardStyle = styled.div`
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        // color: grey;
        // outline: 1px solid;
        background: white;
        font-family: 'Lato', sans-serif;
        padding: 10px;
        margin: 10px;

        ul {
            // margin: 0;
            padding: 10px;
        }

        li {
            list-style-type: none;
            
        }

        .date {
            font-size: 25px;

        }
    `


    return(
        <CardStyle id="weather-card">
            <ul>
                <li>Title: {movieObj.original_title}</li>
                <li>Overview: {movieObj.overview}</li>
                
            </ul>
            <Link href={"/reviews/"+movieObj.id}>
                <button>Reviews</button>
            </Link>

        </CardStyle>       
    )
}

export default MovieCard;