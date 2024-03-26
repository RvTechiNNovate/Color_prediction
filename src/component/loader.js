// import React from 'react';

// const Loader = () => {
//   const dotsContainerStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100%',
//     width: '100%',
//   };

//   const dotStyle = {
//     height: '20px',
//     width: '20px',
//     marginRight: '10px',
//     borderRadius: '10px',
//     backgroundColor: '#b3d4fc',
//     animation: 'pulse 1.5s infinite ease-in-out',
//   };

//   const lastDotStyle = {
//     marginRight: '0',
//   };

//   return (
//     <section style={dotsContainerStyle}>
//       <div style={{ ...dotStyle, animationDelay: '-0.3s' }}></div>
//       <div style={{ ...dotStyle, animationDelay: '-0.1s' }}></div>
//       <div style={{ ...dotStyle, animationDelay: '0.1s' }}></div>
//       <div style={{ ...dotStyle, animationDelay: '0.3s' }}></div>
//       <div style={{ ...dotStyle, animationDelay: '0.5s' }}></div>

//       <style>
//         {`
//           @keyframes pulse {
//             0% {
//               transform: scale(0.8);
//               background-color: #b3d4fc;
//               box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
//             }
//             50% {
//               transform: scale(1.2);
//               background-color: #6793fb;
//               box-shadow: 0 0 0 10px rgba(178, 212, 252, 0);
//             }
//             100% {
//               transform: scale(0.8);
//               background-color: #b3d4fc;
//               box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
//             }
//           }
//         `}
//       </style>
//     </section>
//   );
// };

// export default Loader;

import React from 'react';
import { Container } from 'react-bootstrap';

const Loader = () => {


    const loaderStyle = {
        width: '6em',
        height: '6em',
        margin: 'auto'
    };

    const ringStyle = {
        stroke: '#f42f25',
        strokeWidth: '20',
        fill: 'none',
        strokeLinecap: 'round',
        animation: 'ringA 2s linear infinite',
    };

    const ringBStyle = {
        stroke: '#f49725',
        strokeWidth: '20',
        fill: 'none',
        strokeLinecap: 'round',
        animation: 'ringB 2s linear infinite',
    };

    const ringCStyle = {
        stroke: '#255ff4',
        strokeWidth: '20',
        fill: 'none',
        strokeLinecap: 'round',
        animation: 'ringC 2s linear infinite',
    };

    const ringDStyle = {
        stroke: '#f42582',
        strokeWidth: '20',
        fill: 'none',
        strokeLinecap: 'round',
        animation: 'ringD 2s linear infinite',
    };
    const appStyle = {
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'white',
        maxWidth: '400px',
        // minWidth: '400px',
        alignItems: 'center',
        height: '100vh'
    };
    return (
        <Container style={appStyle}>
            <div style={{paddingTop:'50%'}}>
                <svg style={loaderStyle} viewBox="0 0 240 240">
                    <circle cx="120" cy="120" r="105" style={ringStyle} />
                    <circle cx="120" cy="120" r="35" style={ringBStyle} />
                    <circle cx="85" cy="120" r="70" style={ringCStyle} />
                    <circle cx="155" cy="120" r="70" style={ringDStyle} />

                    <style>
                        {`
          @keyframes ringA {
            from, 4% {
              stroke-dasharray: 0 660;
              stroke-width: 20;
              stroke-dashoffset: -330;
            }
          
            12% {
              stroke-dasharray: 60 600;
              stroke-width: 30;
              stroke-dashoffset: -335;
            }
          
            32% {
              stroke-dasharray: 60 600;
              stroke-width: 30;
              stroke-dashoffset: -595;
            }
          
            40%, 54% {
              stroke-dasharray: 0 660;
              stroke-width: 20;
              stroke-dashoffset: -660;
            }
          
            62% {
              stroke-dasharray: 60 600;
              stroke-width: 30;
              stroke-dashoffset: -665;
            }
          
            82% {
              stroke-dasharray: 60 600;
              stroke-width: 30;
              stroke-dashoffset: -925;
            }
          
            90%, to {
              stroke-dasharray: 0 660;
              stroke-width: 20;
              stroke-dashoffset: -990;
            }
          }
          
          @keyframes ringB {
            from, 12% {
              stroke-dasharray: 0 220;
              stroke-width: 20;
              stroke-dashoffset: -110;
            }
          
            20% {
              stroke-dasharray: 20 200;
              stroke-width: 30;
              stroke-dashoffset: -115;
            }
          
            40% {
              stroke-dasharray: 20 200;
              stroke-width: 30;
              stroke-dashoffset: -195;
            }
          
            48%, 62% {
              stroke-dasharray: 0 220;
              stroke-width: 20;
              stroke-dashoffset: -220;
            }
          
            70% {
              stroke-dasharray: 20 200;
              stroke-width: 30;
              stroke-dashoffset: -225;
            }
          
            90% {
              stroke-dasharray: 20 200;
              stroke-width: 30;
              stroke-dashoffset: -305;
            }
          
            98%, to {
              stroke-dasharray: 0 220;
              stroke-width: 20;
              stroke-dashoffset: -330;
            }
          }
          
          @keyframes ringC {
            from {
              stroke-dasharray: 0 440;
              stroke-width: 20;
              stroke-dashoffset: 0;
            }
          
            8% {
              stroke-dasharray: 40 400;
              stroke-width: 30;
              stroke-dashoffset: -5;
            }
          
            28% {
              stroke-dasharray: 40 400;
              stroke-width: 30;
              stroke-dashoffset: -175;
            }
          
            36%, 58% {
              stroke-dasharray: 0 440;
              stroke-width: 20;
              stroke-dashoffset: -220;
            }
          
            66% {
              stroke-dasharray: 40 400;
              stroke-width: 30;
              stroke-dashoffset: -225;
            }
          
            86% {
              stroke-dasharray: 40 400;
              stroke-width: 30;
              stroke-dashoffset: -395;
            }
          
            94%, to {
              stroke-dasharray: 0 440;
              stroke-width: 20;
              stroke-dashoffset: -440;
            }
          }
          
          @keyframes ringD {
            from, 8% {
              stroke-dasharray: 0 440;
              stroke-width: 20;
              stroke-dashoffset: 0;
            }
          
            16% {
              stroke-dasharray: 40 400;
              stroke-width: 30;
              stroke-dashoffset: -5;
            }
          
            36% {
              stroke-dasharray: 40 400;
              stroke-width: 30;
              stroke-dashoffset: -175;
            }
          
            44%, 50% {
              stroke-dasharray: 0 440;
              stroke-width: 20;
              stroke-dashoffset: -220;
            }
          
            58% {
              stroke-dasharray: 40 400;
              stroke-width: 30;
              stroke-dashoffset: -225;
            }
          
            78% {
              stroke-dasharray: 40 400;
              stroke-width: 30;
              stroke-dashoffset: -395;
            }
          
            86%, to {
              stroke-dasharray: 0 440;
              stroke-width: 20;
              stroke-dashoffset: -440;
            }
          
        `}
                    </style>
                </svg>
            </div>
        </Container >
    );
};

export default Loader;
