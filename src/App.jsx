import { useEffect, useRef, useState } from "react";

const portraitMoments = ["idea", "dog", "ski", "arsenal"];
const portraitMomentDurations = {
  idea: 1300,
  dog: 2200,
  ski: 2200,
  arsenal: 2200,
};

const work = [
  {
    name: "Roam",
    period: "Now",
    discipline: "!nventor, Android",
    copy: "Building the Roam Android app and bringing its virtual office experience to mobile.",
    logo: "/images/logos/roam.png",
    logoClass: "logo-roam",
    links: [{ label: "Roam", href: "https://ro.am/" }],
    projects: [
      {
        title: "Room presence",
        description:
          "A mobile room view designed to make it easy to see who is available and join a conversation quickly.",
        visual: "presence",
      },
      {
        title: "Conversation controls",
        description:
          "A focused in-call experience that keeps audio, movement, and teammate context within thumb reach.",
        visual: "controls",
      },
    ],
    current: true,
  },
  {
    name: "DoorDash",
    period: "Previously",
    discipline: "Product and infrastructure",
    copy: "Worked on DoorDash’s mobile design system and helped deploy Jetpack Compose across its product apps.",
    logo: "/images/logos/doordash.svg",
    links: [{ label: "DoorDash", href: "https://www.doordash.com/" }],
    projects: [
      {
        title: "Composable foundations",
        description:
          "A shared component set that helps product teams build consistent experiences across mobile surfaces.",
        visual: "system",
      },
      {
        title: "Migration pathways",
        description:
          "Patterns and examples that make Jetpack Compose adoption incremental and safer for established apps.",
        visual: "code",
      },
    ],
  },
  {
    name: "Microsoft",
    period: "Earlier",
    discipline: "Mobile and design systems",
    copy: "Contributed to Outlook for Android and helped shape the Fluent Design System.",
    logo: "/images/logos/microsoft.svg",
    logoClass: "logo-microsoft",
    links: [
      {
        label: "Outlook",
        href: "https://www.microsoft.com/en-us/microsoft-365/outlook-mobile-for-android-and-ios",
      },
      {
        label: "Fluent",
        href: "https://fluent2.microsoft.design/",
      },
    ],
    projects: [
      {
        title: "Focused inbox",
        description:
          "A clearer mobile information hierarchy for scanning, triaging, and acting on email.",
        visual: "mail",
      },
      {
        title: "Fluent on Android",
        description:
          "Reusable motion, color, and layout guidance adapted to native Android patterns.",
        visual: "system",
      },
    ],
  },
  {
    name: "Sunrise Calendar",
    period: "Earlier",
    discipline: "Android",
    copy: "Worked on a calendar people loved enough to miss. Sunrise was acquired by Microsoft.",
    logo: "/images/logos/sunrise.png",
    logoClass: "logo-sunrise",
    links: [
      {
        label: "Archive",
        href: "https://www.producthunt.com/products/sunrise-calendar",
      },
    ],
    projects: [
      {
        title: "Day at a glance",
        description:
          "A calm schedule view that makes a dense day easier to understand while moving between meetings.",
        visual: "calendar",
      },
      {
        title: "Quick event creation",
        description:
          "A lightweight flow for turning plans into calendar events with fewer decisions.",
        visual: "flow",
      },
    ],
  },
  {
    name: "Foursquare",
    period: "First chapter",
    discipline: "Mobile engineering",
    copy: "Helped build the mobile experiences behind Swarm and City Guide.",
    logo: "/images/logos/foursquare.svg",
    links: [
      { label: "Swarm", href: "https://www.swarmapp.com/" },
      { label: "City Guide", href: "https://foursquare.com/city-guide" },
    ],
    projects: [
      {
        title: "City discovery",
        description:
          "Place collections and nearby recommendations designed for fast, contextual browsing.",
        visual: "map",
      },
      {
        title: "Swarm moments",
        description:
          "A playful check-in flow that makes sharing where you are feel lightweight.",
        visual: "social",
      },
    ],
  },
  {
    name: "University of Waterloo",
    period: "Education",
    discipline: "BMath, Computer Science",
    copy: "Earned a BMath in Computer Science and started Ezi Studio while studying at Waterloo.",
    logo: "/images/logos/waterloo.png",
    links: [{ label: "Waterloo", href: "https://uwaterloo.ca/" }],
    projects: [
      {
        title: "Mobile foundations",
        description:
          "Coursework and side projects that turn computer science concepts into practical products.",
        visual: "code",
      },
      {
        title: "Ezi Studio beginnings",
        description:
          "Early Android experiments that grow into an independent product practice.",
        visual: "mobile",
      },
    ],
  },
];

const careerTimeline = work.map((item, workIndex) => ({ ...item, workIndex }));

const portraitCenterX = 62;
const portraitHairPoints = [
  70, 4.4, 83, 8.3, 94, 13.8, 98.3, 18, 98.8, 15.5, 100.8, 17.5, 103.4, 24.8,
  106.1, 24.3, 106.6, 27.9, 110, 30.8, 110.4, 36.2, 115.3, 48.8, 116, 58, 114,
  64, 112, 68, 109, 72, 106, 75, 103, 77, 103, 80, 100, 80, 101, 59, 100, 49,
  98, 45, 90, 37, 71, 36, 70, 34, 73, 33, 58, 35, 53, 39, 49, 49, 47, 49, 47,
  45, 44, 47, 37, 60, 34, 78, 31, 75, 30, 67, 21, 66, 22, 62, 20, 57, 19, 45,
  24, 36, 24, 31, 31, 25, 35, 20.6, 35.8, 16.8, 47.5, 9.2, 54.5, 7, 60.1,
  6.1, 64.4, 6.3, 64.9, 4.6, 68.1, 4.4, 68.5, 5.1, 68.8, 4.4,
];

const portraitPoses = {
  face: {
    left: [
      60, 36, 80, 32, 94, 41, 98, 60, 101, 83, 93, 103, 78, 114, 68, 121, 55, 122,
      45, 116, 34, 109, 29, 96, 29, 80, 29, 64, 38, 46, 60, 36,
    ],
    center: [
      63, 35, 84, 33, 97, 42, 101, 61, 104, 84, 96, 104, 82, 115, 72, 122, 59, 123,
      49, 117, 37, 110, 32, 98, 31, 83, 30, 66, 39, 47, 63, 35,
    ],
    right: [
      66, 35, 87, 33, 100, 43, 102, 62, 104, 85, 96, 105, 82, 115, 72, 122, 60, 122,
      50, 116, 39, 109, 34, 96, 33, 81, 32, 64, 42, 46, 66, 35,
    ],
  },
  jaw: {
    left: [29, 78, 29, 95, 34, 109, 45, 116, 55, 122, 68, 121, 78, 114, 91, 104, 98, 89, 99, 75],
    center: [
      31, 79, 31, 97, 37, 110, 49, 117, 59, 123, 72, 122, 82, 115, 96, 104, 102,
      87, 102, 76,
    ],
    right: [
      33, 78, 34, 96, 39, 109, 50, 116, 60, 122, 72, 122, 82, 115, 96, 105, 103,
      88, 103, 76,
    ],
  },
  browLeft: {
    left: [43, 57.5, 48, 53, 54, 53.5, 59, 56],
    center: [45, 57, 50, 52.5, 56, 53, 61, 56],
    right: [47, 57, 52, 53, 58, 53.5, 63, 56],
  },
  browRight: {
    left: [80, 56.5, 85, 53.5, 90, 54, 93, 58],
    center: [82, 56.5, 87, 53.5, 92, 54, 95, 58.5],
    right: [84, 57, 89, 54, 94, 54.5, 97, 59],
  },
  nose: {
    left: [65, 74, 64, 78, 64, 83, 64, 85, 65, 88, 68, 89, 70, 88.5],
    center: [72, 74, 72, 78, 73, 82, 73, 84, 72, 87, 70, 88, 68, 88.5],
    right: [76, 74, 77, 78, 78, 82, 78, 84, 77, 87, 75, 88, 72, 88.5],
  },
  bodyLeft: {
    left: [37, 118, 36, 124, 35, 130, 34, 136],
    center: [37, 106, 35, 116, 33, 126, 32, 136],
    right: [37, 106, 35, 116, 33, 126, 32, 136],
  },
  bodyRight: {
    left: [87, 106, 89, 116, 91, 126, 92, 136],
    center: [87, 118, 88, 124, 89, 130, 90, 136],
    right: [87, 118, 88, 124, 89, 130, 90, 136],
  },
  earLeft: {
    left: [26.5, 75, 4.5, 7],
    center: [26.5, 75, 7, 9.8],
    right: [27, 75, 7.5, 10],
  },
  earRight: {
    left: [103, 80, 7.5, 10],
    center: [105, 81, 6, 9],
    right: [105, 81, 4, 6.5],
  },
};

function mirrorXCoordinates(values) {
  return values.map((value, index) =>
    index % 2 === 0 ? portraitCenterX * 2 - value : value,
  );
}

function mirrorClosedCurve(values) {
  const start = [values[0], values[1]];
  const segments = [];
  let segmentStart = start;

  for (let index = 2; index < values.length; index += 6) {
    const segment = {
      start: segmentStart,
      control1: [values[index], values[index + 1]],
      control2: [values[index + 2], values[index + 3]],
      end: [values[index + 4], values[index + 5]],
    };
    segments.push(segment);
    segmentStart = segment.end;
  }

  const mirrorPoint = ([x, y]) => [portraitCenterX * 2 - x, y];
  const mirroredStart = mirrorPoint(start);

  return [
    ...mirroredStart,
    ...segments
      .reverse()
      .flatMap((segment) => [
        ...mirrorPoint(segment.control2),
        ...mirrorPoint(segment.control1),
        ...mirrorPoint(segment.start),
      ]),
  ];
}

function mirrorOpenCurve(values) {
  const start = [values[0], values[1]];
  const segments = [];
  let segmentStart = start;

  for (let index = 2; index < values.length; index += 6) {
    const segment = {
      start: segmentStart,
      control1: [values[index], values[index + 1]],
      control2: [values[index + 2], values[index + 3]],
      end: [values[index + 4], values[index + 5]],
    };
    segments.push(segment);
    segmentStart = segment.end;
  }

  const mirrorPoint = ([x, y]) => [portraitCenterX * 2 - x, y];

  return [
    ...mirrorPoint(segments.at(-1).end),
    ...segments
      .reverse()
      .flatMap((segment) => [
        ...mirrorPoint(segment.control2),
        ...mirrorPoint(segment.control1),
        ...mirrorPoint(segment.start),
      ]),
  ];
}

function mirrorPolygon(values) {
  const points = [];

  for (let index = 0; index < values.length; index += 2) {
    points.push([values[index], values[index + 1]]);
  }

  const mirrored = points
    .map(([x, y]) => [portraitCenterX * 2 - x, y])
    .reverse();
  let bestShift = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let shift = 0; shift < points.length; shift += 1) {
    let distance = 0;

    points.forEach(([x, y], index) => {
      const [mirroredX, mirroredY] = mirrored[(index + shift) % mirrored.length];
      distance += (x - mirroredX) ** 2 + (y - mirroredY) ** 2;
    });

    if (distance < bestDistance) {
      bestDistance = distance;
      bestShift = shift;
    }
  }

  return points.flatMap((_, index) => mirrored[(index + bestShift) % mirrored.length]);
}

const rightPortraitPose = {
  face: portraitPoses.face.right,
  jaw: portraitPoses.jaw.right,
  browLeft: portraitPoses.browLeft.right,
  browRight: portraitPoses.browRight.right,
  nose: portraitPoses.nose.right,
  bodyLeft: portraitPoses.bodyLeft.right,
  bodyRight: portraitPoses.bodyRight.right,
  earLeft: portraitPoses.earLeft.right,
  earRight: portraitPoses.earRight.right,
  hair: portraitHairPoints,
};

portraitPoses.face = {
  left: mirrorClosedCurve(rightPortraitPose.face),
  center: rightPortraitPose.face,
  right: rightPortraitPose.face,
};
portraitPoses.jaw = {
  left: mirrorOpenCurve(rightPortraitPose.jaw),
  center: rightPortraitPose.jaw,
  right: rightPortraitPose.jaw,
};
portraitPoses.browLeft = {
  left: mirrorOpenCurve(rightPortraitPose.browRight),
  center: rightPortraitPose.browLeft,
  right: rightPortraitPose.browLeft,
};
portraitPoses.browRight = {
  left: mirrorOpenCurve(rightPortraitPose.browLeft),
  center: rightPortraitPose.browRight,
  right: rightPortraitPose.browRight,
};
portraitPoses.nose = {
  left: mirrorXCoordinates(rightPortraitPose.nose),
  center: rightPortraitPose.nose,
  right: rightPortraitPose.nose,
};
portraitPoses.earLeft = {
  left: [
    portraitCenterX * 2 - rightPortraitPose.earRight[0],
    ...rightPortraitPose.earRight.slice(1),
  ],
  center: rightPortraitPose.earLeft,
  right: rightPortraitPose.earLeft,
};
portraitPoses.earRight = {
  left: [
    portraitCenterX * 2 - rightPortraitPose.earLeft[0],
    ...rightPortraitPose.earLeft.slice(1),
  ],
  center: rightPortraitPose.earRight,
  right: rightPortraitPose.earRight,
};
portraitPoses.hair = {
  left: mirrorPolygon(rightPortraitPose.hair),
  center: rightPortraitPose.hair,
  right: rightPortraitPose.hair,
};

function interpolatePortraitPose(pose, turn) {
  const from = turn < 0.5 ? pose.left : pose.center;
  const to = turn < 0.5 ? pose.center : pose.right;
  const progress = turn < 0.5 ? turn * 2 : (turn - 0.5) * 2;

  return from.map((value, index) => value + (to[index] - value) * progress);
}

function facePath(values) {
  return `${curvePath(values)} Z`;
}

function curvePath(values) {
  return `M ${values[0]} ${values[1]} C ${values.slice(2).join(" ")}`;
}

function roundedPolygonPath(values, rounding = 0.22) {
  const points = [];

  for (let index = 0; index < values.length; index += 2) {
    points.push([values[index], values[index + 1]]);
  }

  const between = (from, to, progress) => [
    from[0] + (to[0] - from[0]) * progress,
    from[1] + (to[1] - from[1]) * progress,
  ];
  const commands = points.flatMap((point, index) => {
    const next = points[(index + 1) % points.length];
    const exit = between(point, next, rounding);
    const approach = between(point, next, 1 - rounding);

    return [`Q ${point[0]} ${point[1]} ${exit[0]} ${exit[1]}`, `L ${approach[0]} ${approach[1]}`];
  });
  const previous = points.at(-1);
  const start = between(previous, points[0], 1 - rounding);

  return `M ${start[0]} ${start[1]} ${commands.join(" ")} Z`;
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function PrototypeVisual({ title, visual }) {
  return (
    <div
      className={`project-visual visual-${visual}`}
      role="img"
      aria-label={`Prototype interface placeholder for ${title}`}
    >
      <div className="prototype-primary" aria-hidden="true">
        <div className="prototype-window">
          <span className="prototype-toolbar">
            <i />
            <i />
            <i />
          </span>
          <span className="prototype-shape prototype-shape-one" />
          <span className="prototype-shape prototype-shape-two" />
          <span className="prototype-shape prototype-shape-three" />
          <span className="prototype-shape prototype-shape-four" />
          <span className="prototype-shape prototype-shape-five" />
        </div>
      </div>
      <div className="prototype-companion" aria-hidden="true">
        <span className="prototype-companion-bar" />
        <span className="prototype-companion-hero" />
        <span className="prototype-companion-line prototype-companion-line-one" />
        <span className="prototype-companion-line prototype-companion-line-two" />
        <span className="prototype-companion-action" />
      </div>
    </div>
  );
}

function IdeaBulb() {
  return (
    <span className="portrait-idea" aria-hidden="true">
      <svg viewBox="0 0 40 44" role="presentation" focusable="false">
        <g className="portrait-idea-rays">
          <path d="M 19 1.5 L 19 4.5" />
          <path d="M 5.2 7.8 L 7.8 10.4" />
          <path d="M 32.8 7.8 L 30.2 10.4" />
        </g>
        <path
          className="portrait-idea-glass"
          d="M 10.5 18 C 10.5 12.5 14 8.8 19 8.8 C 24.2 8.8 27.6 12.4 27.5 17.9 C 27.4 21.4 25.5 23.8 23.1 25.6 C 21.8 26.6 21.1 27.8 21.1 29.2 L 16.7 29.2 C 16.7 27.8 16 26.6 14.8 25.6 C 12.3 23.7 10.5 21.4 10.5 18 Z"
        />
        <path d="M 16.2 32.5 C 17.9 33 20.2 33 21.8 32.5" />
        <path d="M 17.5 35.8 C 18.5 36.2 19.6 36.2 20.5 35.8" />
      </svg>
    </span>
  );
}

function PortraitThought() {
  return (
    <span className="portrait-thought" aria-hidden="true">
      <span className="portrait-thought-content portrait-thought-dog">
        <img src="/images/my-dog.png" alt="" />
      </span>
      <span className="portrait-thought-content portrait-thought-ski" role="presentation">
        ⛷️
      </span>
      <span className="portrait-thought-content portrait-thought-arsenal">
        <img src="/images/arsenal.png" alt="" />
      </span>
    </span>
  );
}

function PortraitArt() {
  return (
    <div className="portrait-art" aria-hidden="true">
      <svg
        className="portrait-character"
        viewBox="0 0 124 136"
        role="presentation"
        focusable="false"
      >
        <path
          className="portrait-body-line"
          data-portrait-body-left
          d="M 37 106 C 35 116 33 126 32 136"
        />
        <path
          className="portrait-body-line"
          data-portrait-body-right
          d="M 87 118 C 88 124 89 130 90 136"
        />
        <ellipse
          className="portrait-ear"
          data-portrait-ear-left
          cx={portraitPoses.earLeft.center[0]}
          cy={portraitPoses.earLeft.center[1]}
          rx={portraitPoses.earLeft.center[2]}
          ry={portraitPoses.earLeft.center[3]}
        />
        <ellipse
          className="portrait-ear"
          data-portrait-ear-right
          cx={portraitPoses.earRight.center[0]}
          cy={portraitPoses.earRight.center[1]}
          rx={portraitPoses.earRight.center[2]}
          ry={portraitPoses.earRight.center[3]}
        />
        <path
          className="portrait-face"
          data-portrait-face
          d={facePath(portraitPoses.face.center)}
        />
        <path
          className="portrait-jaw"
          data-portrait-jaw
          d={curvePath(portraitPoses.jaw.center)}
        />
        <path
          className="portrait-feature"
          data-portrait-brow-left
          d={curvePath(portraitPoses.browLeft.center)}
        />
        <path
          className="portrait-feature"
          data-portrait-brow-right
          d={curvePath(portraitPoses.browRight.center)}
        />
        <path
          className="portrait-feature"
          data-portrait-nose
          d={curvePath(portraitPoses.nose.center)}
        />
        <path
          className="portrait-hair"
          data-portrait-hair
          d={roundedPolygonPath(portraitPoses.hair.center)}
        />
      </svg>
      <span className="portrait-mouth" />
      <span className="portrait-eye portrait-eye-left" />
      <span className="portrait-eye portrait-eye-right" />
      <span className="portrait-pupil portrait-pupil-left" />
      <span className="portrait-pupil portrait-pupil-right" />
    </div>
  );
}

function PointerPortrait() {
  const portraitRef = useRef(null);

  useEffect(() => {
    const portrait = portraitRef.current;

    if (!portrait) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const portraitParts = {
      face: portrait.querySelector("[data-portrait-face]"),
      jaw: portrait.querySelector("[data-portrait-jaw]"),
      browLeft: portrait.querySelector("[data-portrait-brow-left]"),
      browRight: portrait.querySelector("[data-portrait-brow-right]"),
      nose: portrait.querySelector("[data-portrait-nose]"),
      bodyLeft: portrait.querySelector("[data-portrait-body-left]"),
      bodyRight: portrait.querySelector("[data-portrait-body-right]"),
      earLeft: portrait.querySelector("[data-portrait-ear-left]"),
      earRight: portrait.querySelector("[data-portrait-ear-right]"),
      hair: portrait.querySelector("[data-portrait-hair]"),
    };
    let motionEnabled = finePointer.matches && !reducedMotion.matches;
    let animationFrame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let blinkTimer = 0;
    let blinkResetTimer = 0;
    let momentTimer = 0;
    let momentResetTimer = 0;
    let momentIndex = 0;

    function morphPortrait(turn) {
      portraitParts.face.setAttribute(
        "d",
        facePath(interpolatePortraitPose(portraitPoses.face, turn)),
      );
      portraitParts.jaw.setAttribute(
        "d",
        curvePath(interpolatePortraitPose(portraitPoses.jaw, turn)),
      );
      portraitParts.browLeft.setAttribute(
        "d",
        curvePath(interpolatePortraitPose(portraitPoses.browLeft, turn)),
      );
      portraitParts.browRight.setAttribute(
        "d",
        curvePath(interpolatePortraitPose(portraitPoses.browRight, turn)),
      );
      portraitParts.nose.setAttribute(
        "d",
        curvePath(interpolatePortraitPose(portraitPoses.nose, turn)),
      );
      portraitParts.bodyLeft.setAttribute(
        "d",
        curvePath(interpolatePortraitPose(portraitPoses.bodyLeft, turn)),
      );
      portraitParts.bodyRight.setAttribute(
        "d",
        curvePath(interpolatePortraitPose(portraitPoses.bodyRight, turn)),
      );
      portraitParts.hair.setAttribute(
        "d",
        roundedPolygonPath(interpolatePortraitPose(portraitPoses.hair, turn)),
      );

      [
        [portraitParts.earLeft, portraitPoses.earLeft],
        [portraitParts.earRight, portraitPoses.earRight],
      ].forEach(([ear, pose]) => {
        const [cx, cy, rx, ry] = interpolatePortraitPose(pose, turn);
        ear.setAttribute("cx", cx);
        ear.setAttribute("cy", cy);
        ear.setAttribute("rx", rx);
        ear.setAttribute("ry", ry);
      });
    }

    function clearBlinkTimers() {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(blinkResetTimer);
      blinkTimer = 0;
      blinkResetTimer = 0;
    }

    function scheduleBlink() {
      if (reducedMotion.matches) return;

      window.clearTimeout(blinkTimer);
      blinkTimer = window.setTimeout(
        () => {
          blinkTimer = 0;
          portrait.classList.add("is-blinking");
          blinkResetTimer = window.setTimeout(() => {
            blinkResetTimer = 0;
            portrait.classList.remove("is-blinking");
            scheduleBlink();
          }, 160);
        },
        3000 + Math.random() * 2000,
      );
    }

    function clearMomentTimers() {
      window.clearTimeout(momentTimer);
      window.clearTimeout(momentResetTimer);
      momentTimer = 0;
      momentResetTimer = 0;
    }

    function clearMoment() {
      portrait.classList.remove("has-idea", "has-thought");
      delete portrait.dataset.moment;
    }

    function scheduleMoment() {
      if (reducedMotion.matches) return;

      window.clearTimeout(momentTimer);
      momentTimer = window.setTimeout(
        () => {
          momentTimer = 0;
          const moment = portraitMoments[momentIndex % portraitMoments.length];
          const momentClass = moment === "idea" ? "has-idea" : "has-thought";
          momentIndex += 1;
          portrait.dataset.moment = moment;
          portrait.classList.add(momentClass);
          momentResetTimer = window.setTimeout(() => {
            momentResetTimer = 0;
            clearMoment();
          }, portraitMomentDurations[moment]);
          scheduleMoment();
        },
        6000 + Math.random() * 3000,
      );
    }

    function paint() {
      velocityX = (velocityX + (targetX - currentX) * 0.11) * 0.72;
      velocityY = (velocityY + (targetY - currentY) * 0.11) * 0.72;
      currentX += velocityX;
      currentY += velocityY;

      const scale = Math.min(portrait.getBoundingClientRect().width / 124, 1);
      const faceX = currentX * 2.2 * scale;
      const mouthX = currentX * 1.15 * scale;
      const pupilX = currentX * 1.8 * scale;
      const mouthAngle = currentX * -3.5 + currentY * 0.9;
      const clampedX = Math.max(-1, Math.min(1, currentX));
      const turn = (clampedX + 1) / 2;
      const mirrorProgress = Math.max(0, -clampedX);
      const eyeLeftX = 42.969 + (30.078 - 42.969) * mirrorProgress;
      const eyeLeftY = 50.625 + (52.143 - 50.625) * mirrorProgress;
      const eyeRightX = 69.922 + (57.031 - 69.922) * mirrorProgress;
      const eyeRightY = 52.143 + (50.625 - 52.143) * mirrorProgress;

      portrait.style.setProperty("--head-x", `${currentX * 4.5 * scale}px`);
      portrait.style.setProperty("--head-y", `${currentY * 3.2 * scale}px`);
      portrait.style.setProperty("--head-yaw", `${currentX * 3}deg`);
      portrait.style.setProperty("--head-pitch", `${currentY * -3.5}deg`);
      portrait.style.setProperty("--head-roll", `${currentX * 0.35}deg`);
      portrait.style.setProperty("--face-x", `${faceX}px`);
      portrait.style.setProperty("--mouth-x", `${mouthX}px`);
      portrait.style.setProperty("--mouth-left", `${52 - 4 * mirrorProgress}%`);
      portrait.style.setProperty("--pupil-x", `${pupilX}px`);
      portrait.style.setProperty("--pupil-y", `${currentY * 3 * scale}px`);
      portrait.style.setProperty("--eye-left-x", `${eyeLeftX}%`);
      portrait.style.setProperty("--eye-left-y", `${eyeLeftY}%`);
      portrait.style.setProperty("--eye-right-x", `${eyeRightX}%`);
      portrait.style.setProperty("--eye-right-y", `${eyeRightY}%`);
      portrait.style.setProperty(
        "--mouth-scale",
        `${1 - Math.abs(currentX) * 0.09 + currentY * 0.025}`,
      );
      portrait.style.setProperty("--mouth-angle", `${mouthAngle}deg`);
      portraitParts.hair.style.transform = `translateX(${currentX * 1.2}px) skewX(${
        currentX * -2
      }deg)`;
      morphPortrait(turn);

      const settled =
        Math.abs(targetX - currentX) < 0.001 &&
        Math.abs(targetY - currentY) < 0.001 &&
        Math.abs(velocityX) < 0.001 &&
        Math.abs(velocityY) < 0.001;

      if (settled) {
        animationFrame = 0;
        return;
      }

      animationFrame = window.requestAnimationFrame(paint);
    }

    function requestPaint() {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(paint);
      }
    }

    function resetPortrait() {
      targetX = 0;
      targetY = 0;
      requestPaint();
    }

    function handlePointerMove(event) {
      if (!motionEnabled) return;

      const rect = portrait.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const horizontalRange =
        event.clientX < centerX
          ? Math.max(centerX, 1)
          : Math.max(window.innerWidth - centerX, 1);
      const verticalRange = Math.max(window.innerHeight * 0.42, 1);

      targetX = Math.max(-1, Math.min(1, (event.clientX - centerX) / horizontalRange));
      targetY = Math.max(-1, Math.min(1, (event.clientY - centerY) / verticalRange));
      requestPaint();
    }

    function handleMotionPreference() {
      motionEnabled = finePointer.matches && !reducedMotion.matches;

      if (!motionEnabled) resetPortrait();

      if (reducedMotion.matches) {
        clearBlinkTimers();
        clearMomentTimers();
        portrait.classList.remove("is-blinking");
        clearMoment();
      } else if (!blinkTimer && !blinkResetTimer) {
        scheduleBlink();
        scheduleMoment();
      }
    }

    scheduleBlink();
    scheduleMoment();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetPortrait);
    document.documentElement.addEventListener("mouseleave", resetPortrait);
    reducedMotion.addEventListener("change", handleMotionPreference);
    finePointer.addEventListener("change", handleMotionPreference);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPortrait);
      document.documentElement.removeEventListener("mouseleave", resetPortrait);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      finePointer.removeEventListener("change", handleMotionPreference);
      window.cancelAnimationFrame(animationFrame);
      clearBlinkTimers();
      clearMomentTimers();
      portrait.classList.remove("is-blinking");
      clearMoment();
    };
  }, []);

  return (
    <div
      className="portrait-stage"
      ref={portraitRef}
      role="img"
      aria-label="Illustration of Will Hou looking toward the pointer and occasionally thinking about his dog, skiing, and Arsenal"
    >
      <IdeaBulb />
      <PortraitThought />
      <div className="portrait-rig">
        <PortraitArt />
      </div>
    </div>
  );
}

function App() {
  const [activeWork, setActiveWork] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const activeTimelineStop = activeWork;
  const selectedWork = work[activeWork];
  const selectedProject = selectedWork.projects[activeProject];
  const timelineProgress =
    activeTimelineStop === work.length - 1
      ? 1
      : (activeTimelineStop + 0.5) / work.length;

  function selectWork(index) {
    setActiveWork(index);
    setActiveProject(0);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <main className="shell" id="main">
        <section className="intro" id="top" aria-labelledby="intro-title">
          <PointerPortrait />
          <div className="intro-copy">
            <p className="intro-greeting">Hello, I’m Will.</p>
            <h1 id="intro-title">
              A product-minded engineer in Brooklyn, currently an{" "}
              <a href="https://ro.am/" target="_blank" rel="noreferrer">
                !nventor at Roam
              </a>
              {" "}building its Android app. I also make independent software through{" "}
              <span className="ezi-studio-wordmark" data-text="Ezi Studio">
                Ezi Studio
              </span>
              .
            </h1>
          </div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div
            className="career-divider"
            style={{ "--timeline-progress": timelineProgress }}
          >
            <div className="career-divider-inner">
              <span className="career-track" aria-hidden="true">
                <span className="career-progress" />
              </span>
              <div
                className="career-stops"
                role="group"
                aria-label="Work timeline, current to earliest"
              >
                {careerTimeline.map((item) => {
                  const isActive = activeWork === item.workIndex;

                  return (
                    <button
                      className={isActive ? "career-stop active" : "career-stop"}
                      type="button"
                      aria-controls="work-showcase"
                      aria-pressed={isActive}
                      key={item.name}
                      onClick={() => selectWork(item.workIndex)}
                      onFocus={() => selectWork(item.workIndex)}
                      onMouseEnter={() => selectWork(item.workIndex)}
                    >
                      <span className="career-marker">
                        <img
                          className={item.logoClass}
                          src={item.logo}
                          alt=""
                          width="20"
                          height="20"
                          loading="lazy"
                        />
                      </span>
                      <span className="career-label">{item.name}</span>
                    </button>
                  );
                })}
              </div>
              <span className="timeline-surprise timeline-future" aria-hidden="true">
                <span className="pixel-ufo" />
              </span>
              <span className="timeline-surprise timeline-past" aria-hidden="true">
                <span className="pixel-dino" />
              </span>
            </div>
          </div>
          <div className="section-head">
            <h2 id="work-title">My journey</h2>
          </div>
          <div
            className="journey-showcase"
            id="work-showcase"
            key={selectedWork.name}
            aria-label={`${selectedWork.name} work showcase`}
          >
            <article className="journey-summary">
              <div className="journey-identity">
                <p className="period">{selectedWork.period}</p>
                <h3 className="company-name">
                  <img
                    className={["company-logo", selectedWork.logoClass]
                      .filter(Boolean)
                      .join(" ")}
                    src={selectedWork.logo}
                    alt=""
                    width="24"
                    height="24"
                  />
                  <span>{selectedWork.name}</span>
                </h3>
                <p className="role-title">{selectedWork.discipline}</p>
              </div>
              <p className="role-detail">{selectedWork.copy}</p>
              <div className="role-links" aria-label={`${selectedWork.name} links`}>
                {selectedWork.links.map((link) => (
                  <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                    {link.label} <Arrow />
                  </a>
                ))}
              </div>
            </article>

            <div className="journey-projects">
              <div className="project-stage" aria-live="polite">
                <div className="project-stage-meta">
                  <p>
                    Prototype story {String(activeProject + 1).padStart(2, "0")} /{" "}
                    {String(selectedWork.projects.length).padStart(2, "0")}
                  </p>
                  <p>Use the story index to explore</p>
                </div>
                <article
                  className="project-feature"
                  key={`${selectedWork.name}-${selectedProject.title}`}
                >
                  <PrototypeVisual
                    title={selectedProject.title}
                    visual={selectedProject.visual}
                  />
                  <div className="project-feature-copy">
                    <p>Selected work</p>
                    <h3>{selectedProject.title}</h3>
                    <p>{selectedProject.description}</p>
                  </div>
                </article>
              </div>
              <div className="project-index" aria-label={`${selectedWork.name} project stories`}>
                {selectedWork.projects.map((project, index) => (
                  <button
                    type="button"
                    className={activeProject === index ? "active" : ""}
                    aria-pressed={activeProject === index}
                    key={project.title}
                    onClick={() => setActiveProject(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{project.title}</strong>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="shell site-footer">
        <p className="footer-identity">
          © {new Date().getFullYear()} Will Hou <span aria-hidden="true">·</span>{" "}
          <a
            href="https://www.linkedin.com/in/william-hou-07282130/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>{" "}
          <span aria-hidden="true">·</span>{" "}
          <a href="https://github.com/willhou" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </p>
        <p className="footer-note">
          All rights reserved. I know it is unlikely for you to steal this, but just in case.
        </p>
      </footer>
    </>
  );
}

export default App;
