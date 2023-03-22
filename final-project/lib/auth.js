import { serialize } from 'cookie'

export const generateAuthToken = (username => {
    return `11${username}11`
})

export const generateCSRFToken = (token) => {
    return "9876zyxw"
}

const CSRF = "9876zyxw"

export const setAuthCookie = (res, token, username) => {
    res.setHeader("Set-Cookie", [
        serialize("auth", token, {
            path: "/",
            httpOnly: true,
            sameSite: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 8)
        }),
        serialize("csrf", generateCSRFToken(token), {
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 8)
        }),
        serialize("username", username, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 8)
        })
    ])
}

export const clearAuthCookie = (res) => {
    res.setHeader("Set-Cookie", [
        serialize("auth", "", {
            path: "/",
            httpOnly: true
        }),
        serialize("csrf", "",{
            path: "/"
        }),
        serialize("username", "",{
            path: "/"
        })
    ])
}

// export const requireAuth = handler => (req, res) => {
//     console.log("== req.cookies:", req.cookies)
//     const validAuth = authTokenIsValid(req.cookies.auth, req.cookies.username)
//     const validCsrf = csrfTokenIsValid(
//         req.headers['x-csrf-token']
//     )
//     if (validAuth && validCsrf) {
//         return handler(req, res)
//     } else {
//         res.status(401).send({ err: "Unauthorized!" })
//     }
// }

export function isAuthenticated(req, res) {
    console.log(`auth: ${req.cookies.auth}, username: ${req.cookies.username}`)
    const validAuth = authTokenIsValid(req.cookies.auth, req.cookies.username)
    console.log(`csrf: ${req.headers['x-csrf-token']}`)
    const validCsrf = csrfTokenIsValid(req.headers['x-csrf-token'])

    if(validAuth && validCsrf){
        return true
    }else{
        return false
    }
}

const authTokenIsValid = (token, username) => {
    return token === generateAuthToken(username)
}

const csrfTokenIsValid = (csrf) => {
    return csrf === CSRF
}