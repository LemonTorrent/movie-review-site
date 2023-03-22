/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { getUsername, signout } from '../lib/clientsideAuth'
import useIsLoggedIn from '../hooks/useLoggedIn'
import { useRouter } from 'next/router'

const NavBarDiv = styled.div`
    // background-color: #f4cce4;
    // background-color: #d8f4dc;
    background-color: black;
    display: flex;
    padding: 0;
    width: 100%;
    justify-content: center;
    color: white;

    li {
        list-style-type: none;
        height: 100%;
    }

    .navbar {

    }
    .navbar-items {
        height: 100%;
        // width: max-contents;
        // width: 40px;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    h1 {
        text-decoration: none;
        color: white;
        padding: 10px;
        font-size: 30px;
    }
`

const buttonLink = css`
    text-decoration: none;
    color: white;
    padding: 10px;
    font-size: 20px;
    background-color: black;
    border: 1px solid white;
    border-radius: 5px;
    margin: 5px;
`

const FixedRight = styled.div`
    position: absolute;
    right: 10px;
    top: 0;
    //height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export default function Navbar() {
    const [isLoggedIn, username] = useIsLoggedIn()
    const router = useRouter()

    return (
        <NavBarDiv>
            <Link href={"/"}>
                <h1>Benny&apos;s Movie Reviews</h1>
            </Link>
            <FixedRight>
                {router.route == "/login" ? null :
                    isLoggedIn ? (<><span>{username}</span><button css={buttonLink} onClick={signout}>Log out</button></>) : (<Link href={"/login?redirect=" + router.asPath} css={buttonLink}>Login</Link>)}
            </FixedRight>
        </NavBarDiv>
    )
}
