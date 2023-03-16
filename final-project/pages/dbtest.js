import React from 'react'

export default function DBTest() {

    async function handleClick() {
        const response = await fetch('./api/tests',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: "hello"})
        })
    }

    return (
        <button onClick={handleClick}>Insert Test</button>
    )
}