/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
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
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        display: flex;


        ul {
            
            padding: 10px;
            padding-top: 0;
            font: "Lucida Console", "Courier New", monospace !important;
        }

        li {
            list-style-type: none;
            // font-family: 'Lato', sans-serif;
            
            // font-family: "Lucida Console", "Courier New", monospace;

        }

        .title {
            font-weight: bold;
            font-size: 20px;
        }

        img {
            height: 150px;
        }        
        
        a {
            margin-left: 10px;
        }
    `


    return(
        <CardStyle id="movie-card">
            <img src={"https://image.tmdb.org/t/p/original" + movieObj.poster_path}/>

            <div>
                <ul>
                    <li className="title">{movieObj.original_title}</li>
                    <li>Overview: {movieObj.overview}</li>
                    
                </ul>
                <Link href={"/reviews/"+movieObj.id}>
                    <button>Reviews</button>
                </Link>
            </div>
            

        </CardStyle>       
    )
}

export default MovieCard;
