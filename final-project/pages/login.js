import { useState } from "react"
import {useRouter} from 'next/router'

function Login() {
    const router = useRouter()
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState(null)

    async function handleLogin(e) {
        e.preventDefault()
        console.log("== Logging in with these credentials:", username, password)
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resBody = await res.json()
        if (res.status !== 200) {
            setError(resBody.err || "Undefined error")
        } else {
            setError(null)
            console.log("== successful auth, token:", resBody.token)
            console.log("== document.cookie:", document.cookie)
            router.push(router.query.redirect || "/")
            
        }
    }

    async function handleSignup(e) {
        e.preventDefault()
        console.log("== Logging in with these credentials:", username, password)
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resBody = await res.json()
        if (res.status !== 200) {
            setError(resBody.err || "Undefined error")
        } else {
            setError(null)
            console.log("== successful auth, token:", resBody.token)
            console.log("== document.cookie:", document.cookie)
            router.push(router.query.redirect || "/")
            
        }
    }

    return (
        <>
            <form onSubmit={handleLogin}>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button>Login</button>
            </div>
            {error && <p>Error: {error}</p>}
            </form>



            <form onSubmit={handleSignup}>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button>Signup</button>
            </div>
            {error && <p>Error: {error}</p>}
            </form>
        </>
        
    )
}

export default Login