import React, { useEffect, useRef, useState } from 'react';
import Navbar from "../../layout/Navbar";
import SideBar from '../../layout/SideBar';

const MainLayout = ({ children }) => {
    const navbarRef = useRef(null); // Ref to store the navbar reference
    const [navbarHeight, setNavbarHeight] = useState(0); // State to hold navbar height

    useEffect(() => {
        // Calculate and set the navbar height when the component mounts
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight); // Get the height of the navbar
        }
    }, [navbarRef]); // Run this effect only once after the initial render
    return (
        <div style={mainStyle}>
            <div style={sideBarStyle}>
                <SideBar />
            </div>
            <main style={mainContentStyle}>
                <div style={navbar} ref={navbarRef}>
                    <Navbar />
                </div>
                <div style={{ ...bodyStyle, paddingTop: `${navbarHeight + 8}px` }}>{children}</div>
            </main>
        </div>
    );
};


const mainStyle = {
    display: 'grid',
    height: '100vh',
};
const sideBarStyle = {

    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 3,
    width: "20%",
    height: "100vh",

};
const navbar = {
    position: "fixed",
    top: 0,
    right: 0,
    zIndex: 3,
    width: '80%'

};

const mainContentStyle = {
    width: '100%',
    overflow: 'auto',
    paddingLeft: '20%'

};

const bodyStyle = {
    backgroundColor: "var(--cl_1)",
    padding: "0.5rem",
};

export default MainLayout;
