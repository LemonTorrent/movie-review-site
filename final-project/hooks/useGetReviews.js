import { useEffect, useState } from 'react'

function useGetReviews(id) {
    const [ movies, setMovies ] = useState([])
    var movieInfoVar;

    const [movieInfoConst, setMovieInfoConst] = useState({})
    // const [ ratings, setRatings ] = useState([]);
    const [ officialRatings, setOfficialRatings] = useState([]);

    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)

    // want name, id, date

    useEffect(() => {
        // console.log("UseGetReveiws Calling use effect with id", id);
        // console.log("Loooking at ", `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`,)
        let ignore = false
        const controller = new AbortController()
        async function fetchMovieName() {
            // https://api.themoviedb.org/3/movie/24428?api_key=7ae35763cfeb8a9f0d0015cfabeb9efc
            setLoading(true)
            // console.log("Fetching search results")
            setLoading(true)
            let responseBody = {}
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`,
                    { signal: controller.signal }
                )
                // console.log("Fetching search results...")

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
                if (responseBody){
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    movieInfoVar = responseBody
                    setMovieInfoConst(responseBody)
                }
                // console.log("After returned, movieInfoVar is", movieInfoVar)

                // setLoading(false)
            }

        }
        async function fetchTheMovieDBResults() {
            // console.log("Fetching search results")
            // setLoading(true)
            let responseBody = {}
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`,
                    { signal: controller.signal }
                )
                // console.log("Fetching search results...")

                // console.log("Response: ", response.json);
                if (response.status !== 200) {
                    console.log("== status:", response.status)
                    setError(true)
                } else {
                    // setError(false)
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
                console.log("Getting local reviews")
                const localReviews = await getLocalReviews();
                setMovies([...localReviews, ...responseBody.results] || [])
                // setLoading(false)
            }
        }

        async function fetchMovieRating() {
            // console.log("Fetching search results for movie title ", movieInfoVar.original_title)
            setLoading(true)
            let responseBody = {}
            try {
                const response = await fetch(
                    `https://www.omdbapi.com/?t=${movieInfoVar.original_title}&plot=full&apikey=${process.env.NEXT_PUBLIC_OMDBAPI_API_KEY}`,
                    { signal: controller.signal }
                )
                // console.log("Fetching search results...")

                // console.log("Response: ", response.json);
                if (response.status !== 200) {
                    console.log("== status:", response.status)
                    setError(true)
                } else {
                    // setError(false)
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
                // setOfficialRatings(responseBody.Ratings || [])
                console.log("Official ratings value:", officialRatings)
                if (responseBody && responseBody.Ratings && responseBody.Ratings.length > 0) {
                    var tempRatings = responseBody.Ratings;
                    var tempStr = ""
                    var tempInt;
                    tempRatings.map((obj, i) => {
                        // tempInt = 0;
                        obj.key = i
                        if (obj.Source == "Rotten Tomatoes") {
                            console.log("Rotton tomatoes!")
                            tempInt = parseInt(obj.Value.slice(0, -1))
                            console.log("temp string: ", tempInt)
                            obj.Value = (tempInt / 10).toString() + "/10"
                            console.log("Object: ", obj.Value)
                        } else if (obj.Source === "Metacritic"){
                            console.log("Metacritic! d")
                            tempInt = parseInt(obj.Value.slice(0, -3))
                            obj.Value = (tempInt / 10).toString() + "/10"
                            console.log("Object: ", obj.Value)
                        }
                    })

                    setOfficialRatings(tempRatings)
                } else {
                    setOfficialRatings([])
                }
                // console.log("Returned ratings: ", ratings)
                setLoading(false)
            }
        }

        async function getLocalReviews() {
            setLoading(true)
            let responseBody = {}
            try {
                const response = await fetch(
                    `/api/reviews?id=${id}`,
                    { signal: controller.signal }
                )

                if (response.status !== 200) {
                    console.log("== status:", response.status)
                    setError(true)
                } else {
                    responseBody = await response.json()
                    console.log("Fetch local reviews: ", responseBody)
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
                if (responseBody.length > 0) {
                    var tempRatings = responseBody.map((obj, i) => {
                        if (obj.reviewer instanceof Object) {
                            obj.reviewer = "Anonymous"
                        }

                        let returnObj = {}
                        returnObj.id = i + "Local"
                        returnObj.author = obj.reviewer;
                        returnObj.content = obj.content;
                        console.log("returnObj: ", returnObj)
                        return returnObj
                        });
                    return tempRatings;
                }
            }
            return [];
        }


        if (id) {
            // fetchTheMovieDBResults()
            fetchMovieName()
                .then(()=>{
                    // console.log("Found name, starting to fetch reviews...")
                    fetchTheMovieDBResults()
                        .then(()=>{
                            // console.log("Searching second round of ratings...")
                            fetchMovieRating()
                        })
                })
        }
        return () => {
            ignore = true
            controller.abort()
        }
    }, [ id ])

    // console.log("Before return, movieInfoVar is ", movieInfoVar)
    // console.log("Before return, name is ", name)
    // console.log("Before return, movieInfoConst is ", movieInfoConst)


    return [ movies, loading, error, movieInfoConst, officialRatings]
}

export default useGetReviews
