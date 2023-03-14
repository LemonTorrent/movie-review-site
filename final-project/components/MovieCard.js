import React, { setState, useState, useEffect } from 'react'
// import dateFormat, { masks } from "dateformat";
import { css } from '@emotion/react'
import styled from '@emotion/styled'

function MovieCard ({ movieObj }) {

    // console.log("Weather card object: ", movieObj)
    // // const [date, setDate] = setState(new Date(weatherObj.dt))
    // console.log("Transforming date: ", new Date(movieObj.dt * 1000))

    const Card = styled.div({
        color: 'red',
    })

    const CardStyle = styled.div`
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        // color: grey;
        // outline: 1px solid;
        font-family: 'Lato', sans-serif;

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
            <button>Reviews</button>

        </CardStyle>       
    )
}

export default MovieCard;