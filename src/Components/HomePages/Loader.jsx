import React from 'react';
import "./Loader.css";

const Loader = () => {
    return (
        <div className="flex items-center justify-center w-[100vw] h-[80vh] bg-[rgba(0, 0, 0, 0.8)]">
            <div className="loader">
                <div className="orbe" style={{ '--index': 0 }}></div>
                <div className="orbe" style={{ '--index': 1 }}></div>
                <div className="orbe" style={{ '--index': 2 }}></div>
                <div className="orbe" style={{ '--index': 3 }}></div>
                <div className="orbe" style={{ '--index': 4 }}></div>
            </div>
         </div>
    );
};

export default Loader;
