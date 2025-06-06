import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Product from '../components/Product';
import Technology from '../components/Technology';
import Pricing from '../components/Pricing';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Product />
      <Technology />
      <Pricing />
    </>
  );
};

export default HomePage; 