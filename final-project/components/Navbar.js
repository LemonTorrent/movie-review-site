import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

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

export default function Navbar() {
    return (
        <NavBarDiv>
            <Link href={"/"}>
                <h1>Benny's Movie Reviews</h1>
            </Link>
        </NavBarDiv>
    )
  }
  