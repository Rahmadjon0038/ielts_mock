'use client'
import React from 'react'
import { Conatiner, TitleInfo, Title, Cards, Card, CardInfo } from './style'
import Link from 'next/link'

function Home() {
    return (
        <Conatiner>
            <TitleInfo>
                <h1>IELTS Resources & Tools</h1>
                <p>Explore various IELTS tests and samples, complete with advanced tools to help you ace your examination.</p>
            </TitleInfo>
            <Title>IELTS Tests</Title>
            <Cards>
                <Link href={'/reading'}>
                    <Card>
                        <CardInfo id={'1'}>
                            <h2>IELTS READING TESTS</h2>
                        </CardInfo>
                    </Card>
                </Link>
                <Link href={'/listening'}>
                    <Card>
                        <CardInfo id={'3'}>
                            <h2>IELTS LISTENING TESTS</h2>
                        </CardInfo>
                    </Card>
                </Link>
                <Link href={'/speaking'}>
                    <Card>
                        <CardInfo id={'2'}>
                            <h2>IELTS SPEAKING TESTS</h2>
                        </CardInfo>
                    </Card>
                </Link>
                <Link href={'/writing'}>
                    <Card>
                        <CardInfo id={'4'}>
                            <h2>IELTS WRITING TESTS</h2>
                        </CardInfo>
                    </Card>
                </Link>
            </Cards>
        </Conatiner >
    )
}

export default Home