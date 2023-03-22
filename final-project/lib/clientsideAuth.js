import Cookies from "js-cookie"

export function isLoggedIn() {
    return !!Cookies.get("username")
}

export async function signout() {
    const res = await fetch('/api/logout',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": Cookies.get("csrf")
        }
    })
    const resBody = await res.json()
    console.log(resBody)

    //reload page
    window.location.reload()
}

export async function getUsername() {
    return Cookies.get("username") ?? ""
}
