import React from "react";
import Header from "./Header"
import { Link } from "react-router-dom";
import useConfig from "../context/useConfig";
import { AiOutlineArrowRight } from "react-icons/ai"

export default function LandingPage() {
  const config = useConfig()
  const urlStart = `/${config.app.STAGE}/`;
  
  return <>
    <div id="outside-main-wrapper">
      <div id="main-wrapper">
        <div id="inside-main-wrapper">
          <div id="outside-cta-wrapper">
            <div id="cta-wrapper">
              <Header/>
              <div>
                <p>Set the tone for your investors. Own your board meetings. <br />Broadcast your message.</p>
                <Link to={urlStart + 'signup'}>Get started&nbsp;<AiOutlineArrowRight size="25"/></Link>
              </div>
            </div>
          </div>
          <div id="video-wrapper">Video Placeholder</div>
        </div>
      </div>
    </div>
  </>
}