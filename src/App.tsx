import React from 'react';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Product from './components/Product';
import Technology from './components/Technology';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
  color: #ffffff;
`;

function App() {
  return (
    <AppContainer>
      <Navbar />
      <Hero />
      <Features />
      <Product />
      <Technology />
      <Pricing />
      <Footer />
    </AppContainer>
  );
}

export default App; 