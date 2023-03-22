/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import { useState } from "react"
import { useRouter } from 'next/router'
import Navbar from "@/components/Navbar"


const formCSS = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 30em;
    height: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;

    //inter-item spacing
    & > * {
        margin-bottom: 10px;
    }
`

const internalFormCSS = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-bottom: 20px;
    //inter-item spacing
    & > * {
        margin-bottom: 10px;
    }
    input {
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 100%;
    }
    button {
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 100%;
        background-color: #fff;
        cursor: pointer;
        &:hover {
            background-color: #eee;
        }
    }
    `

function Login() {
    const router = useRouter()
    const [loginUsername, setLoginUsername] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [signupUsername, setSignupUsername] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [loginError, setLoginError] = useState(null)
    const [signupError, setSignupError] = useState(null)

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log("== Logging in with these credentials:", loginUsername, loginPassword)
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ username: loginUsername, password: loginPassword }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resBody = await res.json()
        if (res.status !== 200) {
            setLoginError(resBody.err || "Undefined error")
        } else {
            setLoginError(null)
            console.log("== successful auth, token:", resBody.token)
            console.log("== document.cookie:", document.cookie)
            router.push(String(router.query.redirect) || "/")

        }
    }

    async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log("== Signing up in with these credentials:", signupUsername, signupPassword)
        const res = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({ username: signupUsername, password: signupPassword }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resBody = await res.json()
        if (res.status !== 200) {
            setSignupError(resBody.err || "Undefined error")
        } else {
            setSignupError(resBody.err || "Please login")
            console.log("== successful auth, token:", resBody.token)
            console.log("== document.cookie:", document.cookie)
            //don't redirect, let them login
            //router.push(String(router.query.redirect) || "/")
        }
    }

    return (
        <>
            <Navbar></Navbar>
            <div css={formCSS}>
                <h1>Login</h1>
                <form onSubmit={handleLogin} css={internalFormCSS}>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={loginUsername}
                            onChange={e => setLoginUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={e => setLoginPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button>Login</button>
                    </div>
                    {loginError && <p>Error: {loginError}</p>}
                </form>


                <h3>Sign up</h3>
                <form onSubmit={handleSignup} css={internalFormCSS}>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={signupUsername}
                            onChange={e => setSignupUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={e => setSignupPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button>Signup</button>
                    </div>
                    {signupError && <p>{signupError}</p>}
                </form>
            </div>
        </>
    )
}

export default Login
