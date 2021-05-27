const plugin = require("tailwindcss/plugin");

//
// Notes:
//
// This plugin generates utility classes for sequencing animations with Tailwind classes
// as well as animation duration utilities
//
// Exmample of classes generated:
// <div>
//  <p class="animate-fade-in">I animate at the <strong>immediately</strong>, or first step in the sequence</p>
//  <p class="animate-fade-in-2">I animate at the <strong>second</strong> step in the sequence</p>
//  <p class="animate-fade-in-3">I animate at the <strong>third</strong> step in the sequence</p>
//  <p class="animate-fade-in-4 animation-duration-1000">I animate at the <strong>fourth</strong> step in the sequence, and have a duration of 1000</p>
// </div>

  // tailwind.config.js
  // module.exports = {
  //   theme: {
  //     extend: {
  //       keyframes: {
  //         "slide-up": {
  //           "0%": { transform: "translateY(24px)", opacity: 0 },
  //           "100%": { transform: "translateY(0)", opacity: 1 },
  //         },
  //       },
  //     },
  //     animationSequence: {
  //       sequence: ["0s", ".25s", ".50s", ".75s", "1s"],
  //       options: {
  //         ...other options
  //       }
  //     },
  //   }
  // }


  // Using this config's sequence array, you will have:

  // (sequence: ["0s", ".25s", ".50s", ".75s", "1s"]) => {
  //   Class                    Properties
  //   animate-fade-in          runs animation at [0s delay]
  //   animate-fade-in-2        runs animation at [.25s delay]
  //   animate-fade-in-3        runs animation at [.50s delay]
  //   animate-fade-in-4        runs animation at [.75s delay]
  //   animate-fade-in-5        runs animation at [1s delay]
  // }


  // This plugin also generates animation duration utilities. 
  // Right now, these are generated based on the transitionDuration values

  // So, if using the default TW transitionDuration config, you will have these available:

  // Class                    Properties
  // animation-duration-75	   animation-duration: 75ms;
  // animation-duration-100	 animation-duration: 100ms;
  // animation-duration-150	 animation-duration: 150ms;
  // animation-duration-200	 animation-duration: 200ms;
  // animation-duration-300	 animation-duration: 300ms;
  // animation-duration-500	 animation-duration: 500ms;
  // animation-duration-700	 animation-duration: 700ms;
  // animation-duration-1000	 animation-duration: 1000ms;


const makeAnimationSequenceUtilities = (keyframes, options, sequence) => {
  const animations = {};
  const animationValues = [];
  const animationKeys = [];

  Object.keys(keyframes).forEach((keyframeName) => {
    sequence.forEach((sequent, idx) => {
      animationKeys.push(
        `.animate-${keyframeName}${idx === 0 ? `` : `-${idx + 1}`}`
      );
      animationValues.push({
        "animation-name": keyframeName,
        "animation-fill-mode": options.fillMode || "",
        "animation-delay": sequent,
        "animation-timing-function": options.easing,
        "animation-duration": options.duration || "",
      });
    });
  });

  animationKeys.forEach((_, idx) => {
    animations[animationKeys[idx]] = animationValues[idx];
  });

  return animations;
};

const makeAnimationDurationUtilities = (animationDurations) => {
  const durationUtilites = {};
  const durationKeys = [];
  const durationValues = [];

  Object.entries(animationDurations).forEach((duration) => {
    durationKeys.push(`.animation-duration-${duration[0]}`);
    durationValues.push({
      "animation-duration": duration[1],
    });
  });

  durationKeys.forEach((_, idx) => {
    durationUtilites[durationKeys[idx]] = durationValues[idx];
  });

  return durationUtilites;
};

module.exports = plugin(function ({ addUtilities, theme }) {
  const options = theme("animationSequence.options", {});
  const sequence = theme("animationSequence.sequence", []);
  const keyframes = theme("keyframes", {});
  // For now, animation-duration utilities use transitionDuration values
  const durations = theme("transitionDuration", {});
  const animationDurationUtilities = makeAnimationDurationUtilities(durations);
  const animationUtilities = makeAnimationSequenceUtilities(
    keyframes,
    options,
    sequence
  );

  addUtilities(animationUtilities);
  addUtilities(animationDurationUtilities);
});
