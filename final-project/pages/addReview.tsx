/** @jsxImportSource @emotion/react */
import Navbar from "@/components/Navbar";
import {css} from "@emotion/react";
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import {useState} from "react";
import { getUsername } from "@/lib/clientsideAuth";

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

export default function SearchResults() {
    const router = useRouter();
    const {movieID} = router.query;

    const [stars, setStars] = useState(0);
    const [content, setContent] = useState("");

    async function submitReview(){
        const res = await fetch('/api/reviews',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": Cookies.get("csrf") ?? ""
            },
            body: JSON.stringify({
                movieID: Number(movieID),
                stars,
                content,
                reviewer: await getUsername(),
            })
        })
        const resBody = await res.json()
        console.log(resBody);
    }

    return (
        <>
            <Navbar />
            <form css={formCSS} onSubmit={async e => {
                        e.preventDefault();
                        await submitReview();
                        router.back();
                    }}>
                <input type="hidden" name="movieID" value={movieID} />
                <label htmlFor="stars">Rating:</label>
                <input type="number" name="stars" id="stars" value={stars} min={0} max={10} onChange={(e)=>{setStars(Number(e.target.value))}}/>
                <label htmlFor="content">Review:</label>
                <textarea name="content" id="content" cols={30} rows={10} value={content} onChange={(e)=>{setContent(e.target.value)}}></textarea>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}
