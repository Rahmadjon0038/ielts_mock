'use client'
import React from 'react'
import { Conatiner, TitleInfo, Title, Cards, Card, CardInfo } from './style'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/userData'
import { getNotify } from '@/hooks/notify'

function Home() {
    const { user } = useAuth();
    const router = useRouter();
    const notify = getNotify();

    const handleNavigate = (path) => {
        if (!user) {
            notify("err", "Iltimos, avval tizimga kiring!");
            return;
        }
        router.push(path);
    };

    return (
        <Conatiner>
            <TitleInfo>
                <h1>IELTS Resources & Tools</h1>
                <p>Explore various IELTS tests and samples, complete with advanced tools to help you ace your examination.</p>
            </TitleInfo>

            <Title>IELTS Tests</Title>
            <Cards>
                <Card onClick={() => handleNavigate('/reading')}>
                    <CardInfo id={'1'}>
                        <h2>IELTS READING TESTS</h2>
                    </CardInfo>
                </Card>
                <Card onClick={() => handleNavigate('/listening')}>
                    <CardInfo id={'3'}>
                        <h2>IELTS LISTENING TESTS</h2>
                    </CardInfo>
                </Card>
                <Card onClick={() => handleNavigate('/speaking')}>
                    <CardInfo id={'2'}>
                        <h2>IELTS SPEAKING TESTS</h2>
                    </CardInfo>
                </Card>
                <Card onClick={() => handleNavigate('/writing')}>
                    <CardInfo id={'4'}>
                        <h2>IELTS WRITING TESTS</h2>
                    </CardInfo>
                </Card>
            </Cards>
        </Conatiner>
    )
}

export default Home
