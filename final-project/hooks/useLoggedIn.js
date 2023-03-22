import { useEffect, useState } from 'react'
import { isLoggedIn } from '../lib/clientsideAuth'

function useIsLoggedIn() {
    const [ loggedIn, setLoggedIn ] = useState(false)

    useEffect(() => {
        //use cookies to check if logged in
        //if logged in, setLoggedIn to true
        //if not logged in, setLoggedIn to false
        if (isLoggedIn()) {
            setLoggedIn(true)
        }
    }, [setLoggedIn])

    return [ loggedIn ]
}

export default useIsLoggedIn
