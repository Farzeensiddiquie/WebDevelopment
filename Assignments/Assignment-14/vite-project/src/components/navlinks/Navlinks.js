import React from 'react';
import { Link, useLocation } from "react-router-dom";
import home from '../../assets/home.svg';
import friends from '../../assets/friends.svg';
import groups from '../../assets/groups.svg';
import video from '../../assets/video.svg';
import gaming from '../../assets/gaming.svg';
const Navlinks = () => {
    const location = useLocation();

    return (
        <div className="fb-center">
            <ul>
                <li key="home"  className="fb-icon-container">
                    <div  className={`navbar-item ${location.pathname === "/" ? "active" : ""}`}>
                        <Link to="/" className="navbar-link">
                   <div className='fb-icon fb-icon1 active'>
                   
                
                            <img   className='nav-img'src={home} alt="Home" />
                            </div>
                        </Link>
                    </div>
                </li>
                <li key="friends" className="fb-icon-container">
                    <div className={`navbar-item ${location.pathname === "/Friends" ? "active" : ""}`}>
                        <Link to="/Friends" className="navbar-link">
                        <div className='fb-icon fb-icon2'>
                            <img className='nav-img' src={friends} alt="Friends" />
                            </div>
                        </Link>
                    </div>
                </li>
                <li key="videos" className="fb-icon-container">
                    <div className={`navbar-item ${location.pathname === "/Videos" ? "active" : ""}`}>
                        <Link to="/Videos" className="navbar-link">
                        <div className='fb-icon fb-icon3'>
                            <img className='nav-img' src={video} alt="Video" />
                            </div>
                        </Link>
                    </div>
                </li>
                <li key="groups" className="fb-icon-container">
                    <div className={`navbar-item ${location.pathname === "/Groups" ? "active" : ""}`}>
                        <Link to="/Groups" className="navbar-link">
                        <div className='fb-icon fb-icon4'>
                            <img  className='nav-img'src={groups} alt="Groups" />
                            </div>
                        </Link>
                    </div>
                </li>
                <li key="gaming" className="fb-icon-container">
                    <div className={`navbar-item ${location.pathname === "/Gaming" ? "active" : ""}`}>
                        <Link to="/Gaming" className="navbar-link">
                        <div className='fb-icon fb-icon5'>
                            <img  className='nav-img'src={gaming} alt="Gaming" />
                            </div>
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Navlinks;
