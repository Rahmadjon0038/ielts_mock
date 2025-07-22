'use client'
import Link from "next/link";
import styled from "styled-components";

export default function NotAuthorized() {
    const Container = styled.div`
    border: 2px solid red;
    margin: 50px 100px;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    h2{
        margin-bottom: 10px;
    }
    u{
        color: blue;
    }
    `
  return (
    <Container className="text-center p-10">
      <h2 className="">Kirish taqiqlangan</h2>
      <p className="mt-4">Sizda bu sahifaga ruxsat yo‘q.</p> <br /> 
      <Link href={'/'}><u>Home</u></Link>
    </Container>
  );
}
