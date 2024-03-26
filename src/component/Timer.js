


import React, { useRef, useEffect } from "react";
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";

export const Timer = ({ value }) => {
  const divRef = useRef();
  const tickRef = useRef();

  useEffect(() => {
    // Destroy the current Tick instance
    if (tickRef.current) {
      Tick.DOM.destroy(tickRef.current);
    }

    // Create a new Tick instance
    const currDiv = divRef.current;
    const didInit = tick => {
      tickRef.current = tick;
    };

    Tick.DOM.create(currDiv, {
      value,
      didInit,
      repeat: true,
      view: {
        children: [
          {
            root: "div",
            style: ".tick",
            repeat: true,
            children: [
              {
                view: "flip"
              }
            ]
          }
        ]
      }
    });

    return () => {
      if (tickRef.current) {
        Tick.DOM.destroy(tickRef.current);
      }
    };
  }, [value]);

  useEffect(() => {
    // Update the value when it changes
    if (tickRef.current) {
      tickRef.current.value = value;
    }
  }, [value]);

  return <div
    ref={divRef}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%", // Set a height to ensure centering in case of smaller content
      backgroundColor: "black", // Set your desired transparent background color
      padding: "10px", // Add padding if needed
      borderRadius: "8px", // Add border radius for rounded corners
    }}
  />;
};

export default Timer;
