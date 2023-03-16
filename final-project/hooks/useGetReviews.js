import { useEffect, useState } from 'react'

function useGetReviews(id) {
    const [ movies, setMovies ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    // want name, id, date

    useEffect(() => {
        console.log("UseGetReveiws Calling use effect with id", id);
        console.log("Loooking at ", `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`,)
        let ignore = false
        const controller = new AbortController()
        async function fetchTheMovieDBResults() {
            console.log("Fetching search results")
            setLoading(true)
            let responseBody = {}
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`,
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


        if (id) {
            fetchTheMovieDBResults()
        }
        return () => {
            ignore = true
            controller.abort()
        }
    }, [ id ])

    return [ movies, loading, error ]
}

export default useGetReviews