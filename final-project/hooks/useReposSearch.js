import { useEffect, useState } from 'react'

function useReposSearch(query) {
    const [ repos, setRepos ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    useEffect(() => {
        console.log("Calling use effect");
        let ignore = false
        const controller = new AbortController()
        async function fetchSearchResults() {
            setLoading(true)
            let responseBody = {}
            try {
                console.log("Environmental variable: ", process.env.REACT_APP_WEATHER_API_KEY);
                const response = await fetch(
                    // `https://api.github.com/search/repositories?q=${query}&sort=stars`,
                    `https://pro.openweathermap.org/data/2.5/forecast/climate?q=${query}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=imperial`,
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
                setRepos(responseBody.list || [])
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

    return [ repos, loading, error ]
}

export default useReposSearch