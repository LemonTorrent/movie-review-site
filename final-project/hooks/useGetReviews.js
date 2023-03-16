import { useEffect, useState } from 'react'

function useGetReviews(id) {
    const [ movies, setMovies ] = useState([])
    var movieInfoVar;
    // const [ ratings, setRatings ] = useState([]);
    const [ officialRatings, setOfficialRatings] = useState([]);
    var ratings;
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    // want name, id, date

    useEffect(() => {
        console.log("UseGetReveiws Calling use effect with id", id);
        console.log("Loooking at ", `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`,)
        let ignore = false
        const controller = new AbortController()
        async function fetchMovieName() {
            // https://api.themoviedb.org/3/movie/24428?api_key=7ae35763cfeb8a9f0d0015cfabeb9efc
            setLoading(true)
            console.log("Fetching search results")
            setLoading(true)
            let responseBody = {}
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`,
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
                    console.log("Movie Info response body: ", responseBody)
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
                movieInfoVar = responseBody
                console.log("After returned, movieInfoVar is", movieInfoVar)

                // setLoading(false)
            }

        }
        async function fetchTheMovieDBResults() {
            console.log("Fetching search results")
            // setLoading(true)
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
                setMovies([...responseBody.results] || [])
                // setLoading(false)
            }
        }

        async function fetchMovieRating() {
            console.log("Fetching search results for movie title ", movieInfoVar.original_title)
            setLoading(true)
            let responseBody = {}
            try {
                const response = await fetch(
                    `https://www.omdbapi.com/?t=${movieInfoVar.original_title}&plot=full&apikey=${process.env.NEXT_PUBLIC_OMDBAPI_API_KEY}`,
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
                    console.log("Fetch movie rating: ", responseBody)
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
                // setRatings(responseBody.results || [])
                ratings = responseBody
                setOfficialRatings(responseBody.Ratings || [])
                console.log("Returned ratings: ", ratings)
                setLoading(false)
            }
        }


        if (id) {
            // fetchTheMovieDBResults()
            fetchMovieName()
                .then(()=>{
                    console.log("Found name, starting to fetch reviews...")
                    fetchTheMovieDBResults()
                        .then(()=>{
                            console.log("Searching second round of ratings...")
                            fetchMovieRating()
                        })
                })
        }
        return () => {
            ignore = true
            controller.abort()
        }
    }, [ id ])

    return [ movies, loading, error, officialRatings]
}

export default useGetReviews