import React from 'react';
import { footer } from './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return <footer className={footer}>{`© ${currentYear}. Cobocho all rights reserved.`}</footer>;
};

export default Footer;
