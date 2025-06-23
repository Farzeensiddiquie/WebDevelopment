import React from "react";
import SearchBar from "../../Components/SearchBar/SearchBar";
import "./Home.css";
import Residense from "../../Components/Residense-cards/Residense";
import Button from "../../Components/Button/Button";
import Benefits from "../../Components/Benefits-cards/Benefits";
import Footer from "../../Components/Footer/Footer";
// import ArrowButton from "../../Components/Arrow-btn/ArrowButton";
export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="home-container">
          <div className="Hero-section-heading">
            <p className="heading1">
              Perfect way to buy <br />
              and sell a home
            </p>
            <br />
            <p className="heading2">
              Diam vitae, nec mattis lectus quam pretium amet facilisis. Urna,
              massa aliqua <br />
              dui pellentesque. Ac, gravida in eget non amet eget purus non.
            </p>

            <SearchBar marginTop="50px" />
          </div>
          <img
            className="hero-side-img"
            src="/Images/diamond overlay pattern.png"
          />
        </div>
        <p className="Featured-p">Featured In</p>
        <div className="logos">
          <img className="logo4 f-logo" src="/Images/logo4.png" />
          <img className="logo3 f-logo" src="/Images/logo3.png" />
          <img className="logo6 f-logo" src="/Images/logo6.png" />
          <img className="logo2 f-logo" src="/Images/logo2.png" />
          <img className="logo1 f-logo" src="/Images/logo1.png" />
        </div>
      </section>
      <section className="Residence-section">
        <div className="Residence-section">
          <h2 className="Residence-heading">Popular Residence</h2>
         
          <Residense className="Residense-card" />

          <Button
            className="Residense-btn"
            width="220px"
            text="View all properties"
            marginLeft="570px"
            fontSize="18px"
            height="50px"
            display="block"
            marginTop="50px"
          />
        </div>
      </section>
      <section className="Benefits-section-container">
        <h2 className="Benefits-heading">Why to choose us</h2>
        <div className="Benefits-section">
          <Benefits className="Benefits-cards" />
        </div>
        <div className="Benefits-testimonial">
          <img src="/Images/quotes.png" />
          <p className="testimonial-p">
            Massa semper non rutrum orci facilisi sit. Lectus porta Quam <br />{" "}
            a fringilla eget viverra sem. Vulputate massa hendrerit turpis{" "}
            <br /> gravida tempor, porttitor.
          </p>
          <div className="testimonial-name-container">
            <div className="testimonial-name-p">
              <p className="testimonial-name-p1">Elena Pravo</p>
              <p className="testimonial-name-p2">Ceo, Upstate</p>
            </div>
            <div className="testimonial-btn">
              <button className="arrow left">&#x276E;</button>
              <div className="divider"></div>
              <button className="arrow right">&#x276F;</button>
            </div>
          </div>
        </div>
      </section>
      <section className="Services">
        <div className="Services-images">
          <img
            className="serviceimg service-img1"
            src="/Images/Services1.png"
          />
          <img className="serviceimg" src="/Images/Services2.png" />
        </div>
        <div className="Services-text">
          <p className="Services-heading">
            We Help People To <br /> Find Homes
          </p>
          <p className="Services-p">
            Mauris orci donec blandit maecenas. Orci lorem purus porttitor massa{" "}
            <br /> consectetur. Neque, vestibulum sed varius magna et at. Eu,
            adipiscing <br /> morbi augue justo. Nibh laoreet volutpat quis
            velit. Blandit aliquam <br /> donec sed morbi congue eget lorem
            viverra porta id lobortis.
          </p>
          <Button
            className="Services-btn"
            width="190px"
            text="Get in Touch"
            marginLeft="0px"
            fontSize="18px"
            height="50px"
            display="block"
            marginTop="25px"
          />
        </div>
      </section>
      <section className="call-to-action">
        <p className="cta-heading">
          Let’s simply <br /> begin with <br /> rentiz.
        </p>
        <div className="cta-text-and-btn">
          <p className="cta-paragraph">
            Neque, vestibulum sed varius magna et at. Eu, adipiscing morbi augue{" "}
            <br /> justo. Nibh laoreet volutpat quis velit. Blandit aliquam
            donec sed morbi <br /> congue eget lorem viverra porta id lobortis.
          </p>
          <Button
            className="cta-btn"
            width="150px"
            text="Get Started"
            marginLeft="0px"
            fontSize="18px"
            height="45px"
            display="block"
            marginTop="25px"
          />
        </div>
      </section>
<Footer/>
    </>
  );
}
