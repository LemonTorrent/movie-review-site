import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '../components/Spinner'
import ErrorContainer from '../components/ErrorContainer'
import useMoviesSearch from '../hooks/useMoviesSearch'
// import WeatherCard from '../components/WeatherCard'
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

`


function Search(props, { query }) {
    const router = useRouter();
    const [ searchParams, setSearchParams ] = useState(useRouter.basePath)
    console.log("Path: ", router)

    // const [ inputQuery, setInputQuery ] = useState(useRouter.get("q") || "")
    const [ inputQuery, setInputQuery ] = useState(useRouter.basePath || "")

    // const [ inputQuery, setInputQuery ] = useState(searchParams.get("q") || "")


    // const [ repos, loading, error ] = useReposSearch(useRouter.basePath)
    const [ repos, loading, error ] = useMoviesSearch(searchParams)
    
    return (
        
        <SearchResults id="query-contents">
            <h2>Select a movie to check the ratings:</h2>
            <form onSubmit={e => {
                e.preventDefault()
                console.log("e")
                setSearchParams(inputQuery)
            }}>
                <input value={inputQuery} onChange={e => {setInputQuery(e.target.value)}} />
                <button type="submit">Search</button>
            </form>
            {repos.length>0? <h2>Weather in {searchParams.get("q")}</h2> : null}
            {error && <ErrorContainer>An error occurred...</ErrorContainer>}
            {loading ? <Spinner /> : (
                <div className="query-obj">
                    {repos.map(repo => (
                        <WeatherCard weatherObj={repo} />
                    ))}
                </div>
            )}
        
        </SearchResults>
        
    )
}

export default Search