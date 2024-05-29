import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
 import AboutUs from "./components/AboutUs/AboutUs"
 import Feature from "./components/Features/Feature"
import Vote from "./components/Vote/Vote";
import Contacts from "./components/Contacts/Contacts";
import Footer from "./components/Footer/Footer";

import {Routes, Route, Link, Router} from 'react-router-dom'
export default function App() {
  return (
     <>
        <Navbar />
        <Hero />
        <AboutUs />
         <Feature />
        <Vote />
        <Contacts />
        <Footer />
     </>
  )
}