// App.js
import React from "react";
import "./footer.css";

function Footer() {
    return (
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-information">
                        <p>See it all</p>
                        <p>From local hotels to global brands, discover millions of rooms all around the world.</p>
                    </div>
                    <div className="footer-information">
                        <p>Compare right here</p>
                        <p>No need to search anywhere else. The biggest names in travel are right here.</p>
                    </div>
                    <div className="footer-information">
                        <p>Get exclusive rates</p>
                        <p>We‘ve special deals with the world’s leading hotels and we these savings with you.</p>
                    </div>
                </div>
            </footer>
    );
}

export default Footer;
