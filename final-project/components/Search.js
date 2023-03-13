import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '../components/Spinner'
import ErrorContainer from '../components/ErrorContainer'
import useReposSearch from '../hooks/useReposSearch'
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
    const [ searchParams, setSearchParams ] = useState(useRouter())

    // const [ inputQuery, setInputQuery ] = useState(searchParams.get("q") || "")
    const [ inputQuery, setInputQuery ] = useState("")

    const [ repos, loading, error ] = useReposSearch("")
    // const [ repos, loading, error ] = useReposSearch(searchParams.get("q"))
    
    return (
        
        <SearchResults id="query-contents">
            {/* <div className="" style={searchResultStyle}> */}
                <h2>Select a movie to check the ratings:</h2>
                <form onSubmit={e => {
                    e.preventDefault()
                    setSearchParams({ q: inputQuery })
                }}>
                    <input value={inputQuery} onChange={e => setInputQuery(e.target.value)} />
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
            {/* </div> */}
        
        </SearchResults>
        
    )
}

export default Search