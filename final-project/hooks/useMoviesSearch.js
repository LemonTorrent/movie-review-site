import { useEffect, useState } from 'react'

function useMoviesSearch(query) {
    const [ movies, setMovies ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    useEffect(() => {
        console.log("UseMoviesSearch Calling use effect with query", query);
        let ignore = false
        const controller = new AbortController()
        async function fetchSearchResults() {
            console.log("Fetching search results")
            setLoading(true)
            let responseBody = {}
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`,
                    { signal: controller.signal }
                )
                console.log("Fetching search results...")

                // console.log("Response: ", response.json);
                if (response.status !== 200) {
                    console.log("== status:", response.status)
                    setError(true)
                } else {
                    setError(false)
                    responseBody = await response.json()
                    console.log("Response body: ", responseBody)
                }
            } catch (e) {
                if (e instanceof DOMException) {
                    console.log("HTTP request cancelled")
                } else {
                    setError(true)
                    console.error("Error:", e)
                    throw e
                }
            }

            if (!ignore) {
                setMovies(responseBody.results || [])
                setLoading(false)
            }
        }
        if (query) {
            fetchSearchResults()
        }
        return () => {
            ignore = true
            controller.abort()
        }
    }, [ query ])

    return [ movies, loading, error ]
}

export default useMoviesSearch