import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Header from './Header';
import useConfig from '../context/useConfig';

export default function LandingPage() {
  const config = useConfig();
  const urlStart = `/${config.app.STAGE}/`;

  return (
    <div id="outside-main-wrapper">
      <div id="main-wrapper">
        <div id="inside-main-wrapper">
          <div id="outside-cta-wrapper">
            <div id="cta-wrapper">
              <Header />
              <div>
                <p>
                  Set the tone for your investors. Own your board meetings.
                  <br />
                  Broadcast your message.
                </p>
                <Link to={`${urlStart}signup`}>
                  Get started&nbsp;
                  <AiOutlineArrowRight size="25" />
                </Link>
              </div>
            </div>
          </div>
          <div id="video-wrapper"><iframe width="560" height="315" src="https://www.youtube.com/embed/S3vsMwZ6swc" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
        </div>
      </div>
    </div>
  );
}
