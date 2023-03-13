import React from 'react'

import styled from '@emotion/styled'

const Container = styled.div`
    padding: 10px;
    background-color: #ff7c7c;
    color: #fff;
`

export default function ErrorContainer({ children }) {
    return <Container>{children}</Container>
}

