'use client'

import React from 'react'
import { Conatiner, TitleInfo, Title, Cards, Card, CardInfo } from './style'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/userData'
import { getNotify } from '@/hooks/notify'
import { useGetHome } from '@/hooks/home'
import Loader from '../loader/Loader'

function Home() {
    const { user } = useAuth();
    const router = useRouter();
    const notify = getNotify();
    const { data, isLoading } = useGetHome();

    const handleNavigate = (path) => {
        if (!user) return notify("err", "Please log in first!");
        if (user?.user?.role === "admin") return router.push("/admin");
        router.push(path);
    };

    if (isLoading) return <Loader />

    const testCategories = [
        { id: '1', title: 'IELTS READING TESTS', path: '/reading' },
        { id: '3', title: 'IELTS LISTENING TESTS', path: '/listening' },
        { id: '2', title: 'IELTS SPEAKING TESTS', path: '/speaking' },
        { id: '4', title: 'IELTS WRITING TESTS', path: '/writing' },
    ];

    return (
        <Conatiner>
            <TitleInfo>
                <h1 id='title'>IELTS Resources & Tools</h1>
                <p>Explore various IELTS tests and samples, complete with advanced tools to help you ace your examination.</p>
            </TitleInfo>
            <Title>IELTS Tests</Title>
            <Cards>
                {testCategories.map((item) => (
                    <Card
                        key={item.id}
                        onClick={() => handleNavigate(item.path)}>
                        <CardInfo id={item.id}>
                            <h2>{item.title}</h2>
                        </CardInfo>
                    </Card>
                ))}
            </Cards>
        </Conatiner>
    )
}

export default Home