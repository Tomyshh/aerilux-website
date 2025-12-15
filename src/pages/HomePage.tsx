import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import InAction from '../components/InAction';
import Product from '../components/Product';
import Technology from '../components/Technology';
import Pricing from '../components/Pricing';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <InAction />
      <Product />
      <Technology />
      <Pricing />
    </>
  );
};

export default HomePage; 