'use client'
import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Logo>Taraqqiyot</Logo>
        <Nav>
          <NavItem href="/">Home</NavItem>
          <NavItem href="#">IELTS Mock</NavItem>
          <NavItem href="#">About Us</NavItem>
          <NavItem href="#">Contact</NavItem>
        </Nav>
        <CopyRight>
          © {new Date().getFullYear()} Tarqqiyot Training Center. All rights reserved.
        </CopyRight>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background: #131a29;
  color: #e2e8f0;
  padding: 2rem 1rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Logo = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const NavItem = styled.a`
  color: #e2e8f0;
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #38bdf8;
  }
`;

const CopyRight = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
`;
