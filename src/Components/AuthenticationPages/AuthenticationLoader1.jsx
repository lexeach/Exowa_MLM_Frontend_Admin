
import React from 'react';
import "./AuthenticationLoader1.css";

const AuthenticationLoader1 = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="loaderauth">
                <div className="orbeauth" style={{ '--index': 0 }}></div>
                <div className="orbeauth" style={{ '--index': 1 }}></div>
                <div className="orbeauth" style={{ '--index': 2 }}></div>
                <div className="orbeauth" style={{ '--index': 3 }}></div>
                <div className="orbeauth" style={{ '--index': 4 }}></div>
            </div>
         </div>
    );
};

export default AuthenticationLoader1;