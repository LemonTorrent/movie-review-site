import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '../components/Spinner'
import ErrorContainer from '../components/ErrorContainer'
import useMoviesSearch from '../hooks/useMoviesSearch'
import MovieCard from './MovieCard'
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

const SearchBar = styled.div`
    background: white;
    padding: 10px;
    padding-bottom: 20px;
    display: flex; /* or inline-flex */
    flex-direction: column;

    .search-title {
        // padding-right: 20px;
    }

    .form-div {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    input {
        width: 315px;
    }

    h2 {
        font-weight: normal;
        font-size: 30px;
    }
`

const SearchResults = styled.div`

    height: 90%;
    // color: green;
    // overflow-y: scroll;
    // padding: 10px;

    .query-obj {
        // height: 87%;
        // overflow-y: scroll;
    }

    background: lightgrey;    

`


function Search(props, { query }) {
    const router = useRouter();
    const [ searchParams, setSearchParams ] = useState(router.query.query)
    console.log("Path: ", router.query.query)
    console.log("Search parameters: ", searchParams)

    // const [ inputQuery, setInputQuery ] = useState(useRouter.get("q") || "")
    const [ inputQuery, setInputQuery ] = useState(router.query.query || "")
    // const [ inputQuery, setInputQuery ] = useState("")

    // console.log("Input query: ", inputQuery)

    // const [ inputQuery, setInputQuery ] = useState(searchParams.get("q") || "")


    // const [ repos, loading, error ] = useReposSearch(useRouter.basePath)
    const [ movies, loading, error ] = useMoviesSearch(searchParams)
    console.log("Movies:", movies)

    useEffect(()=>{
        if (!inputQuery) {
            setSearchParams(router.query.query)
            // setInputQuery(router.query.query)
        }

    // }, [inputQuery, router.query.query])
    }, [router.query.query])

    
    return (
        
        <SearchResults id="query-contents">
            <SearchBar>
                <div className='search-title'>
                    <h2>Select a movie to check the ratings:</h2>
                </div>
                <div className='form-div'>
                    <form onSubmit={e => {
                        e.preventDefault()
                        console.log("e")
                        setSearchParams(inputQuery)
                        router.push(
                            // {
                            //     query: { inputQuery },
                            // }
                            `/search/${inputQuery}`,
                            undefined,
                            {shallow: true}
                        );
                        
                    }}>
                        <input value={inputQuery} onChange={e => {
                            console.log("Changing input value to:", e.target.value)
                            if (e.target.value.length == 0) {
                                setInputQuery("")
                            } else {
                                setInputQuery(e.target.value)
                            }

                            console.log("Changed input value to:", inputQuery)
                            }} />
                        <button type="submit">Search</button>
                    </form>
                </div>

            </SearchBar>
            
            {/* {movies.length>0? <h2>Found movies:</h2> : null} */}
            {error && <ErrorContainer>An error occurred...</ErrorContainer>}
            {loading ? <Spinner /> : (
                <div className="query-obj">
                    {movies.map(movie => (
                        <MovieCard movieObj={movie} key={movie.id}/>
                    ))}
                </div>
            )}
        
        </SearchResults>
        
    )
}

export default Search
