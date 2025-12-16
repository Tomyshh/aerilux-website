import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import InAction from '../components/InAction';
import Product from '../components/Product';
import Technology from '../components/Technology';
import Pricing from '../components/Pricing';
import PigeonGame from '../components/PigeonGame';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <InAction />
      <Product />
      <Technology />
      <Pricing />
      <PigeonGame />
    </>
  );
};

export default HomePage; 