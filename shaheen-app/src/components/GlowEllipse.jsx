import React from "react";

const GlowEllipse = ({ className = "", style = {} }) => (
  <div
    className={"glow-ellipse " + className}
    style={{
      position: "relative",
      width: "3000px",
      height: "1000px",
      //   maxWidth: "1000px",
      margin: "0 auto",
      ...style,
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 600"
      style={{ display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="600"
        cy="350"
        rx="500"
        ry="250"
        fill="black"
        filter="url(#glow)"
      />
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="40"
            floodColor="#8f5cf7"
            floodOpacity="0.7"
          />
        </filter>
      </defs>
    </svg>
  </div>
);

export default GlowEllipse;
