import { useEffect, useState } from 'react'
import { getUsername, isLoggedIn } from '../lib/clientsideAuth'

function useIsLoggedIn() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState("")

    useEffect(() => {
        //use cookies to check if logged in
        //if logged in, setLoggedIn to true
        //if not logged in, setLoggedIn to false
        if (isLoggedIn()) {
            setLoggedIn(true)
            getUsername().then((u) => {
                setUsername(u)
            });
        }
    }, [setLoggedIn])

    return [loggedIn, username]
}

export default useIsLoggedIn
