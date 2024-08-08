import React from 'react'

function Errordevice() {
  return (
    <div className="w-full h-screen bg-primary flex justify-center content-center	items-center	">
      <div className="w-9/12  h-3/5 bg-third   flex justify-center p-5">
        <div className="flex flex-col gap-10  items-center">
          <svg
            width="150"
            height="150"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="zoom"
          >
            <style>
              {`
        .zoom {
          animation: zoom-animation 1s infinite;
        }
        @keyframes zoom-animation {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}
            </style>
            {/* Circle */}
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="#fff"
              stroke="#FF5F00"
              strokeWidth="2"
            />
            {/* Small "X" */}
            <line
              x1="9"
              y1="9"
              x2="15"
              y2="15"
              stroke="#FF5F00"
              strokeWidth="1.5"
            />
            <line
              x1="15"
              y1="9"
              x2="9"
              y2="15"
              stroke="#FF5F00"
              strokeWidth="1.5"
            />
          </svg>
          <h1 className="text-lg font-semibold	text-white		">
            This website is not optimized for mobile devices. Please use a
            laptop <br />
            or desktop for the best experience.
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Errordevice