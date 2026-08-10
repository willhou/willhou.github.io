import { useEffect, useRef, useState } from "react";

const portraitMoments = ["idea", "dog", "ski", "arsenal"];
const portraitMomentDurations = {
  idea: 1300,
  dog: 3300,
  ski: 3300,
  arsenal: 3300,
};

const work = [
  {
    name: "Roam",
    period: "Jul 2023 to present",
    startYear: "2023",
    endYear: String(new Date().getFullYear()),
    discipline: "!nventor, Android",
    copy: "Building the Roam Android app and bringing its virtual office experience to mobile.",
    logo: "/images/logos/roam.png",
    logoClass: "logo-roam",
    links: [{ label: "Roam", href: "https://ro.am/" }],
    projects: [
      {
        title: "Virtual office",
        description:
          "See your whole company at a glance, including who is available, where conversations are happening, and when to drop in.",
        visual: "presence",
      },
      {
        title: "Inbox",
        description:
          "AI-powered messaging that brings direct messages, group chats, threads, and meeting context together in one organized inbox.",
        visual: "controls",
      },
    ],
    current: true,
  },
  {
    name: "DoorDash",
    period: "Oct 2021 to Jun 2023",
    startYear: "2021",
    endYear: "2023",
    discipline: "Product and infrastructure",
    copy: "Worked on DoorDash’s mobile design system and helped deploy Jetpack Compose across its product apps.",
    logo: "/images/logos/doordash.svg",
    links: [{ label: "DoorDash", href: "https://www.doordash.com/" }],
    projects: [
      {
        title: "Prism design system",
        description:
          "I worked on Prism for Android, helping product teams adopt its themes and components across the DoorDash consumer, Dasher, Merchant, and Caviar apps. I also helped teams understand why using the system matters and how consistent adoption maintains product coherence. I spoke about the work at ",
        descriptionLink: {
          label: "Figma Schema 2022",
          href: "https://www.designsystems.com/schema-new-york-2022/",
        },
        descriptionSuffix: ".",
        visual: "prism",
      },
      {
        title: "Mobile infrastructure",
        description:
          "I helped initiate the team’s Jetpack Compose adoption, deployed lint rules to reinforce design system use, hosted weekly office hours to support teams through the transition, and partnered with HR on a pilot Android infrastructure bootcamp.",
        visual: "infrastructure",
      },
    ],
  },
  {
    name: "Microsoft",
    period: "Mar 2015 to Oct 2021",
    startYear: "2015",
    endYear: "2021",
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
        title: "Outlook Mobile",
        description:
          "As a founding member of the team, I helped build Outlook for Android from the ground up, shaping its product foundation and core inbox and calendar experiences.",
        visual: "mail",
      },
      {
        title: "Fluent Design System",
        description:
          "Much of the theming and UI work I contributed to Outlook Mobile helped bootstrap Fluent for mobile, which was later adopted company-wide across other Microsoft products, including Windows. Related work includes the ",
        descriptionLink: {
          label: "Fluent System Icons library",
          href: "https://github.com/microsoft/fluentui-system-icons",
        },
        descriptionSuffix: ".",
        visual: "fluent",
      },
    ],
  },
  {
    name: "Sunrise Calendar",
    period: "Oct 2014 to Aug 2016",
    startYear: "2014",
    endYear: "2016",
    discipline: "Android",
    copy: "Worked on a calendar people loved enough to miss. Sunrise was acquired by Microsoft.",
    logo: "/images/logos/sunrise.png",
    logoClass: "logo-sunrise",
    links: [
      {
        label: "Archive",
        href: "https://www.businessinsider.com/sunrise-calendar-meet-keyboard-makes-scheduling-meetings-on-your-phone-easy-2015-5",
      },
    ],
    projects: [
      {
        title: "Calendar experience",
        description:
          "I worked with the team to shape Sunrise’s calendar experience, including its adoption of Material Design and a refreshed event details view.",
        visual: "calendar",
      },
      {
        title: "Sunrise Meet keyboard",
        description:
          "I shipped Sunrise Meet, a calendar keyboard that let people share available times from any conversation without switching apps, turning meeting coordination into a single link.",
        visual: "meet",
      },
    ],
  },
  {
    name: "Foursquare",
    period: "Dec 2011 to Sep 2014",
    startYear: "2011",
    endYear: "2014",
    discipline: "Android engineering",
    copy: "Built Foursquare for Android and helped launch Swarm as its own app.",
    logo: "/images/logos/foursquare.svg",
    links: [
      { label: "Swarm", href: "https://www.swarmapp.com/" },
      { label: "Foursquare", href: "https://foursquare.com/" },
    ],
    projects: [
      {
        title: "Foursquare",
        description:
          "I worked on multiple redesigns of Foursquare for Android between 2011 and 2014, helping evolve the app from check-ins and friend activity toward richer place discovery and personalized recommendations.",
        visual: "foursquare",
      },
      {
        title: "Swarm",
        description:
          "I became part of the founding Swarm team when Foursquare split its original app in two. Swarm is a mobile app that allows users to share their locations with friends and create a record of their experiences in their personal lifelog.",
        visual: "swarm",
      },
    ],
  },
  {
    name: "University of Waterloo",
    period: "2006 to 2011",
    startYear: "2006",
    endYear: "2011",
    discipline: "BMath, Computer Science",
    copy: "Earned a BMath in Computer Science and started Ezi Studio while studying at Waterloo.",
    logo: "/images/logos/waterloo.png",
    links: [{ label: "Waterloo", href: "https://uwaterloo.ca/" }],
    projects: [],
  },
];

function getCompanyTimelineYears(company) {
  const newestYear = Number(company.endYear);
  const oldestYear = Number(company.startYear);

  return Array.from(
    { length: newestYear - oldestYear + 1 },
    (_, index) => String(newestYear - index),
  );
}

const careerTimeline = work.map((item, workIndex) => ({
  ...item,
  workIndex,
  timelineYears: getCompanyTimelineYears(item),
}));

const projectPreviews = {
  presence: {
    kind: "phone",
    src: "/images/projects/roam-workspace-overview-device.png",
    alt: "Roam Android virtual office showing teams and available coworkers",
  },
  controls: {
    kind: "phone",
    src: "/images/projects/roam-hq-device.png",
    alt: "Roam Android inbox showing conversations and teammates",
  },
  prism: {
    kind: "phone",
    src: "/images/projects/doordash-prism-device-mobile.png",
    alt: "DoorDash Android product page built with the Prism design system",
  },
  infrastructure: {
    kind: "desktop",
    src: "/images/projects/doordash-prism-device-desktop.png",
    alt: "DoorDash desktop experience supported by shared product infrastructure",
  },
  mail: {
    kind: "phone",
    src: "/images/projects/outlook-device-inbox.png",
    alt: "Outlook Mobile inbox on Android",
  },
  fluent: {
    kind: "studio",
    alt: "Microsoft Surface Studio displaying a Fluent Design System demo",
  },
  calendar: {
    kind: "phone",
    src: "/images/projects/sunrise-device-agenda.png",
    alt: "Sunrise Calendar agenda on Android",
  },
  meet: {
    kind: "phone",
    src: "/images/projects/sunrise-device-meet-compose.png",
    alt: "Sunrise Meet keyboard composing an invitation on Android",
  },
  foursquare: {
    kind: "phone",
    src: "/images/projects/foursquare/foursquare-device-city-guide.png",
    alt: "Foursquare City Guide on Android",
  },
  swarm: {
    kind: "phone",
    src: "/images/projects/foursquare/swarm-device-checkin.png",
    alt: "Swarm check-in experience on Android",
  },
};

const portfolioStories = work.flatMap((company, workIndex) => {
  if (company.projects.length === 0) {
    return [
      {
        key: `${workIndex}-education`,
        workIndex,
        projectIndex: -1,
        company,
        title: company.discipline,
        description: company.copy,
        preview: { kind: "education" },
      },
    ];
  }

  return company.projects.map((project, projectIndex) => ({
    key: `${workIndex}-${projectIndex}`,
    workIndex,
    projectIndex,
    company,
    ...project,
    preview: projectPreviews[project.visual],
  }));
});

const launcherApps = [
  { label: "Roam", workIndex: 0, storyKey: "0-0" },
  { label: "DoorDash", workIndex: 1, storyKey: "1-0" },
  {
    label: "Outlook",
    workIndex: 2,
    storyKey: "2-0",
    logo: "/images/logos/outlook-transparent.png",
    logoClass: "logo-outlook",
  },
  { label: "Sunrise", workIndex: 3, storyKey: "3-0" },
  { label: "Foursquare", workIndex: 4, storyKey: "4-0" },
  {
    label: "Swarm",
    workIndex: 4,
    storyKey: "4-1",
    logo: "/images/logos/swarm.png",
  },
].map((app) => ({
  ...app,
  logo: app.logo ?? work[app.workIndex].logo,
  logoClass: app.logoClass ?? work[app.workIndex].logoClass,
}));

const launcherTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});
const launcherDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

let launcherWeatherCache;
let launcherWeatherRequest;

function getWeatherCondition(weatherCode) {
  if (weatherCode === 0) return { kind: "clear", label: "Clear" };
  if (weatherCode <= 2) return { kind: "partly-cloudy", label: "Partly cloudy" };
  if (weatherCode === 3) return { kind: "cloudy", label: "Cloudy" };
  if (weatherCode === 45 || weatherCode === 48) {
    return { kind: "fog", label: "Foggy" };
  }
  if (weatherCode >= 71 && weatherCode <= 77) {
    return { kind: "snow", label: "Snow" };
  }
  if (weatherCode >= 85 && weatherCode <= 86) {
    return { kind: "snow", label: "Snow showers" };
  }
  if (weatherCode >= 95) return { kind: "storm", label: "Storms" };
  return { kind: "rain", label: "Rain" };
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.responseType = "json";
    request.timeout = 7000;

    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error(`Request failed with status ${request.status}`));
        return;
      }

      try {
        resolve(
          request.response ?? JSON.parse(request.responseText || "null"),
        );
      } catch {
        reject(new Error("The service returned invalid data"));
      }
    };
    request.onerror = () => reject(new Error("The service is unavailable"));
    request.ontimeout = () => reject(new Error("The service timed out"));
    request.send();
  });
}

async function loadLauncherWeather() {
  if (launcherWeatherCache) return launcherWeatherCache;

  if (!launcherWeatherRequest) {
    launcherWeatherRequest = (async () => {
      const location = await requestJson(
        "https://free.freeipapi.com/api/json",
      );
      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        throw new Error("Approximate location unavailable");
      }

      const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
      weatherUrl.search = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: "temperature_2m,weather_code,is_day",
        temperature_unit:
          location.countryCode === "US" ? "fahrenheit" : "celsius",
        forecast_days: "1",
      }).toString();

      const weather = await requestJson(weatherUrl.toString());
      const temperature = Number(weather.current?.temperature_2m);
      const weatherCode = Number(weather.current?.weather_code);

      if (!Number.isFinite(temperature) || !Number.isFinite(weatherCode)) {
        throw new Error("Weather data unavailable");
      }

      const condition = getWeatherCondition(weatherCode);

      launcherWeatherCache = {
        ...condition,
        temperature: Math.round(temperature),
        unit: weather.current_units?.temperature_2m ?? "°",
      };

      return launcherWeatherCache;
    })().catch((error) => {
      launcherWeatherRequest = undefined;
      throw error;
    });
  }

  return launcherWeatherRequest;
}

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

function EziStudioWordmark() {
  const [isTouchActive, setIsTouchActive] = useState(false);
  const touchTimerRef = useRef(0);

  useEffect(
    () => () => {
      window.clearTimeout(touchTimerRef.current);
    },
    [],
  );

  function handlePointerDown(event) {
    if (event.pointerType !== "touch") return;

    window.clearTimeout(touchTimerRef.current);
    setIsTouchActive(true);
    touchTimerRef.current = window.setTimeout(() => {
      touchTimerRef.current = 0;
      setIsTouchActive(false);
    }, 1100);
  }

  return (
    <span
      className={`ezi-studio-wordmark${isTouchActive ? " is-touch-active" : ""}`}
      data-text="Ezi Studio"
      onPointerDown={handlePointerDown}
    >
      Ezi Studio
    </span>
  );
}

function RoleDetail({ copy }) {
  const wordmark = "Ezi Studio";
  const wordmarkIndex = copy.indexOf(wordmark);

  if (wordmarkIndex === -1) {
    return <p className="role-detail">{copy}</p>;
  }

  return (
    <p className="role-detail">
      {copy.slice(0, wordmarkIndex)}
      <EziStudioWordmark />
      {copy.slice(wordmarkIndex + wordmark.length)}
    </p>
  );
}

function FluentVideoVisual() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);
  const controlsTimerRef = useRef(0);

  useEffect(() => {
    return () => {
      window.clearTimeout(controlsTimerRef.current);
    };
  }, []);

  function hideControlsAfter(delay = 2400) {
    window.clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, delay);
  }

  function revealControls() {
    if (!isPlaying) return;

    setShowControls(true);
    hideControlsAfter();
  }

  function handleVideoPlay() {
    setIsPlaying(true);
    setShowControls(true);
    hideControlsAfter();
  }

  function handlePlay() {
    const playback = videoRef.current?.play();

    if (playback) {
      playback.catch(() => setIsPlaying(false));
    }
  }

  return (
    <div
      className="project-visual visual-fluent"
      aria-label="Microsoft Surface Studio displaying a Fluent Design System demo"
    >
      <div className="surface-studio-real">
        <img
          className="surface-studio-frame"
          src="/images/projects/surface-studio-2-dark-frame.png"
          alt=""
          width="1800"
          height="1627"
        />
        <div
          className="surface-studio-screen"
          onPointerEnter={revealControls}
          onPointerMove={revealControls}
          onPointerDown={revealControls}
          onPointerLeave={() => hideControlsAfter(700)}
          onFocusCapture={revealControls}
        >
          <video
            ref={videoRef}
            poster="/images/projects/fluent-video-poster.jpg"
            aria-label="Fluent Design System demo"
            preload="metadata"
            playsInline
            loop
            controls={showControls}
            controlsList="nodownload"
            onPlay={handleVideoPlay}
            onPause={revealControls}
          >
            <source src="/videos/fluent-mobile-experiences.webm" type="video/webm" />
            <source src="/videos/fluent-mobile-experiences.mp4" type="video/mp4" />
          </video>
          {!isPlaying && (
            <button
              className="surface-studio-poster"
              type="button"
              aria-label="Play Fluent Design System video"
              onClick={handlePlay}
            >
              <img
                src="/images/projects/fluent-video-poster.jpg"
                alt=""
                width="1280"
                height="720"
              />
              <span className="surface-studio-play" aria-hidden="true">
                <span />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PrototypeVisual({ title, visual }) {
  if (visual === "mail") {
    return (
      <div
        className="project-visual visual-mail"
        role="img"
        aria-label="Outlook Mobile dark and light inbox, and calendar screens"
      >
        <div className="outlook-phone-stack" aria-hidden="true">
          <img
            className="outlook-phone outlook-phone-left"
            src="/images/projects/outlook-device-dark-inbox.png"
            alt=""
            width="840"
            height="1545"
          />
          <img
            className="outlook-phone outlook-phone-center"
            src="/images/projects/outlook-device-inbox.png"
            alt=""
            width="840"
            height="1617"
          />
          <img
            className="outlook-phone outlook-phone-calendar"
            src="/images/projects/outlook-device-calendar.png"
            alt=""
            width="840"
            height="1572"
          />
        </div>
      </div>
    );
  }

  if (visual === "calendar") {
    return (
      <div
        className="project-visual visual-calendar"
        role="img"
        aria-label="Sunrise Calendar agenda and event detail screens"
      >
        <div className="sunrise-phone-stack" aria-hidden="true">
          <img
            className="sunrise-phone sunrise-phone-agenda"
            src="/images/projects/sunrise-device-agenda.png"
            alt=""
            width="840"
            height="1346"
          />
          <img
            className="sunrise-phone sunrise-phone-detail"
            src="/images/projects/sunrise-device-event-detail.png"
            alt=""
            width="840"
            height="1342"
          />
        </div>
      </div>
    );
  }

  if (visual === "meet") {
    return (
      <div
        className="project-visual visual-meet"
        role="img"
        aria-label="Sunrise Meet keyboard, invitation, and availability picker screens"
      >
        <div className="meet-device-stack" aria-hidden="true">
          <img
            className="meet-device meet-device-compose"
            src="/images/projects/sunrise-device-meet-compose.png"
            alt=""
            width="840"
            height="1335"
          />
          <img
            className="meet-device meet-device-invite"
            src="/images/projects/sunrise-device-meet-invite.png"
            alt=""
            width="840"
            height="1444"
          />
          <img
            className="meet-device meet-device-picker"
            src="/images/projects/sunrise-device-meet-picker.png"
            alt=""
            width="840"
            height="1444"
          />
        </div>
      </div>
    );
  }

  if (visual === "fluent") {
    return <FluentVideoVisual />;
  }

  if (visual === "prism") {
    return (
    <div
      className="project-visual visual-prism"
      role="img"
      aria-label="DoorDash desktop and mobile, and Caviar mobile product experiences using the Prism design system"
    >
      <div className="prism-device-stack" aria-hidden="true">
        <img
          className="prism-device prism-device-desktop"
          src="/images/projects/doordash-prism-device-desktop.png"
          alt=""
          width="1680"
          height="1065"
        />
        <img
          className="prism-device prism-device-caviar"
          src="/images/projects/caviar-prism-device-mobile.png"
          alt=""
          width="760"
          height="1493"
        />
        <img
          className="prism-device prism-device-doordash"
          src="/images/projects/doordash-prism-device-mobile.png"
          alt=""
          width="760"
          height="1493"
        />
      </div>
    </div>
    );
  }

  if (visual === "infrastructure") {
    return (
      <div
        className="project-visual visual-infrastructure"
        role="img"
        aria-label="Low-fidelity diagram showing Jetpack Compose adoption supported by lint guardrails, design system coherence, and an Android infrastructure bootcamp"
      >
        <div className="infrastructure-diagram" aria-hidden="true">
          <span className="infrastructure-connector connector-compose" />
          <span className="infrastructure-connector connector-branch" />
          <span className="infrastructure-connector connector-system" />
          <span className="infrastructure-connector connector-bootcamp" />

          <div className="infrastructure-card infrastructure-compose">
            <span className="infrastructure-kicker">01 · adoption</span>
            <strong>Jetpack Compose</strong>
            <div className="infrastructure-code">
              <i />
              <i />
              <i />
              <i />
            </div>
            <span className="infrastructure-status">
              <i />
              team rollout
            </span>
          </div>

          <div className="infrastructure-lint">
            <span>✓</span>
            <strong>lint</strong>
          </div>

          <div className="infrastructure-card infrastructure-system">
            <span className="infrastructure-kicker">02 · coherence</span>
            <strong>Design system</strong>
            <div className="infrastructure-rule-list">
              <span>
                <i />
                components
              </span>
              <span>
                <i />
                tokens
              </span>
            </div>
          </div>

          <div className="infrastructure-card infrastructure-bootcamp">
            <span className="infrastructure-kicker">03 · practice</span>
            <strong>Android bootcamp</strong>
            <div className="infrastructure-cohort">
              <span>
                <i />
                <i />
                <i />
              </span>
              <small>HR + Android infra</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visual === "foursquare" || visual === "swarm") {
    const isFoursquare = visual === "foursquare";
    const archiveDevices = isFoursquare
      ? [
          {
            position: "left",
            src: "/images/projects/foursquare/foursquare-device-2012.png",
          },
          {
            position: "center",
            src: "/images/projects/foursquare/foursquare-device-adventures.png",
          },
          {
            position: "right",
            src: "/images/projects/foursquare/foursquare-device-city-guide.png",
          },
        ]
      : [
          {
            position: "left",
            src: "/images/projects/foursquare/swarm-device-checkin.png",
          },
          {
            position: "center",
            src: "/images/projects/foursquare/swarm-device-nearby.png",
          },
          {
            position: "right",
            src: "/images/projects/foursquare/swarm-device-activity.png",
          },
        ];

    return (
      <div
        className={`project-visual visual-archive visual-${visual}`}
        role="img"
        aria-label={
          isFoursquare
            ? "Three historic Foursquare for Android screens showing the app’s evolution from social activity to personalized place discovery"
            : "Three Swarm app screens showing check-in, nearby friends, and activity"
        }
      >
        <div className="archive-phone-stack" aria-hidden="true">
          {archiveDevices.map((device) => (
            <div
              className={`archive-phone-card archive-phone-${device.position}`}
              key={device.src}
            >
              <img
                className="archive-device-image"
                src={device.src}
                alt=""
                width="420"
                height="780"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
    <span className="portrait-thought">
      <a
        className="portrait-thought-content portrait-thought-dog"
        href="https://www.instagram.com/solmi.sesame/"
        target="_blank"
        rel="noreferrer"
        aria-label="View Solmi the dog on Instagram"
      >
        <img src="/images/my-dog.png" alt="Solmi the dog" />
      </a>
      <span
        className="portrait-thought-content portrait-thought-ski"
        aria-hidden="true"
        role="presentation"
      >
        ⛷️
      </span>
      <span
        className="portrait-thought-content portrait-thought-arsenal"
        aria-hidden="true"
      >
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
    let motionEnabled = !reducedMotion.matches;
    let activeTouchPointerId = null;
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

    function updatePortraitTarget(event) {
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

    function handlePointerDown(event) {
      if (event.pointerType !== "touch") return;

      activeTouchPointerId = event.pointerId;
      updatePortraitTarget(event);
    }

    function handlePointerMove(event) {
      if (
        event.pointerType === "touch" &&
        event.pointerId !== activeTouchPointerId
      ) {
        return;
      }

      updatePortraitTarget(event);
    }

    function handlePointerEnd(event) {
      if (
        event.pointerType !== "touch" ||
        event.pointerId !== activeTouchPointerId
      ) {
        return;
      }

      activeTouchPointerId = null;
      resetPortrait();
    }

    function handleMotionPreference() {
      motionEnabled = !reducedMotion.matches;

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
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerEnd, { passive: true });
    window.addEventListener("pointercancel", handlePointerEnd, { passive: true });
    window.addEventListener("blur", resetPortrait);
    document.documentElement.addEventListener("mouseleave", resetPortrait);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("blur", resetPortrait);
      document.documentElement.removeEventListener("mouseleave", resetPortrait);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      window.cancelAnimationFrame(animationFrame);
      clearBlinkTimers();
      clearMomentTimers();
      portrait.classList.remove("is-blinking");
      clearMoment();
    };
  }, []);

  return (
    <div className="portrait-stage" ref={portraitRef}>
      <IdeaBulb />
      <PortraitThought />
      <div
        className="portrait-rig"
        role="img"
        aria-label="Illustration of Will Hou looking toward the pointer or touch and occasionally thinking about his dog, skiing, and Arsenal"
      >
        <PortraitArt />
      </div>
    </div>
  );
}

function DevicePreview({ story }) {
  const preview = story.preview;

  if (preview.kind === "studio") {
    return (
      <div className="device-preview device-preview-studio">
        <FluentVideoVisual />
      </div>
    );
  }

  if (preview.kind === "education") {
    return (
      <div
        className="device-preview device-preview-education"
        role="img"
        aria-label="University of Waterloo crest with Bachelor of Mathematics in Computer Science"
      >
        <img src={story.company.logo} alt="" width="96" height="96" />
        <p>University of Waterloo</p>
        <strong>BMath, Computer Science</strong>
      </div>
    );
  }

  return (
    <div className={`device-preview device-preview-${preview.kind}`}>
      <img
        src={preview.src}
        alt={preview.alt}
        loading={story.key === portfolioStories[0].key ? "eager" : "lazy"}
      />
    </div>
  );
}

function PortfolioLauncher({
  animatePowerOn,
  onPowerOnAnimationStart,
  onSelectStory,
  poweredOn,
}) {
  const [launcherNow, setLauncherNow] = useState(() => new Date());
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    let clockTimer;

    const syncClock = () => {
      window.clearTimeout(clockTimer);

      const now = new Date();
      setLauncherNow(now);

      const millisecondsUntilNextMinute =
        60_000 - (now.getSeconds() * 1_000 + now.getMilliseconds());

      clockTimer = window.setTimeout(
        syncClock,
        millisecondsUntilNextMinute + 25,
      );
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) syncClock();
    };

    syncClock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(clockTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const launcherTime = launcherTimeFormatter.format(launcherNow);
  const launcherDate = launcherDateFormatter.format(launcherNow);

  useEffect(() => {
    if (poweredOn && animatePowerOn) onPowerOnAnimationStart();
  }, [animatePowerOn, onPowerOnAnimationStart, poweredOn]);

  useEffect(() => {
    let ignoreResult = false;

    loadLauncherWeather()
      .then((nextWeather) => {
        if (!ignoreResult) setWeather(nextWeather);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!ignoreResult) setWeatherLoading(false);
      });

    return () => {
      ignoreResult = true;
    };
  }, []);

  return (
    <div className="device-preview device-preview-launcher">
      <div className="launcher-phone">
        <div className="launcher-speaker" aria-hidden="true" />
        <div className="launcher-camera" aria-hidden="true" />
        <div
          className={`launcher-screen${poweredOn ? " is-powered-on" : ""}${
            poweredOn && animatePowerOn ? " is-powering-on" : ""
          }`}
          aria-busy={!poweredOn}
        >
          <div className="launcher-desktop">
            <div className="launcher-status" aria-hidden="true">
              <span>{launcherTime}</span>
              <span className="launcher-system-status">
                <span>5G</span>
                <span className="launcher-signal">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="launcher-battery">
                  <i />
                </span>
              </span>
            </div>
            <div className="launcher-at-a-glance">
              <strong>{launcherDate}</strong>
              {weather ? (
                <span
                  className="launcher-weather"
                  aria-label={`${weather.temperature}${weather.unit}, ${weather.label}`}
                >
                  <i
                    className={`launcher-weather-icon is-${weather.kind}`}
                    aria-hidden="true"
                  />
                  <span aria-hidden="true">
                    {weather.temperature}
                    {weather.unit}
                  </span>
                </span>
              ) : null}
              {weatherLoading ? (
                <span className="launcher-weather-loading" aria-hidden="true">
                  <i />
                  <i />
                </span>
              ) : null}
            </div>
            <div className="launcher-grid" aria-label="Career apps">
              {launcherApps.map((app, index) => (
                <button
                  type="button"
                  className="launcher-app"
                  key={app.label}
                  onClick={() => onSelectStory(app.storyKey)}
                  style={{ "--launcher-index": index }}
                  aria-label={`Open the ${app.label} chapter`}
                  disabled={!poweredOn}
                >
                  <span className="launcher-app-icon" aria-hidden="true">
                    <img
                      className={app.logoClass}
                      src={app.logo}
                      alt=""
                      width="64"
                      height="64"
                    />
                  </span>
                  <span className="launcher-app-label">{app.label}</span>
                </button>
              ))}
            </div>
            <div className="launcher-skeleton" aria-hidden="true">
              <div className="launcher-skeleton-apps">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="launcher-skeleton-search">
                <i />
                <span />
                <b />
              </div>
            </div>
            <div className="launcher-gesture" aria-hidden="true" />
          </div>
          <div className="launcher-crt-static" aria-hidden="true" />
          <div className="launcher-crt-beam" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function CareerYearStops({ company, registerYearNode, withinProjects }) {
  const yearCount = company.timelineYears.length;
  const projectCount = company.projects.length;
  const edgeInset = withinProjects && projectCount > 0 ? 50 / projectCount : 0;
  const stopRange = withinProjects ? 100 - edgeInset * 2 : 50;

  return (
    <div className="career-year-stops" aria-hidden="true">
      {company.timelineYears.map((year, yearIndex) => {
        const progress = yearCount === 1 ? 0 : yearIndex / (yearCount - 1);
        const stopPosition = edgeInset + progress * Math.max(0, stopRange);
        const stopKey = `${company.workIndex}-${year}`;

        return (
          <span
            className="career-year-stop"
            data-timeline-year={year}
            data-work-index={company.workIndex}
            key={stopKey}
            ref={(node) => registerYearNode(stopKey, node)}
            style={{ "--year-stop-position": `${stopPosition}%` }}
          />
        );
      })}
    </div>
  );
}

function YearTicker({ company, value }) {
  const previousValueRef = useRef(value);
  const transitionIdRef = useRef(0);
  const [transition, setTransition] = useState({
    from: value,
    to: value,
    direction: "older",
    id: 0,
  });

  useEffect(() => {
    if (previousValueRef.current === value) return;

    transitionIdRef.current += 1;
    setTransition({
      from: previousValueRef.current,
      to: value,
      direction:
        Number(value) < Number(previousValueRef.current) ? "older" : "newer",
      id: transitionIdRef.current,
    });
    previousValueRef.current = value;
  }, [value]);

  const previousDigits = transition.from.padStart(4, "0").split("");
  const currentDigits = transition.to.padStart(4, "0").split("");
  const lastChangedDigit = currentDigits.reduce(
    (lastIndex, digit, index) =>
      previousDigits[index] === digit ? lastIndex : index,
    -1,
  );

  return (
    <div
      className={`career-year-readout is-${transition.direction}`}
      aria-label={`${company}, ${value}`}
    >
      <span className="career-year-ticker" aria-hidden="true">
        {currentDigits.map((digit, index) => {
          const previousDigit = previousDigits[index];
          const changed = previousDigit !== digit;

          return (
            <span className="career-year-digit" key={`${index}-${transition.id}`}>
              {changed ? (
                <>
                  <span
                    className="career-year-number is-outgoing"
                    style={{ "--digit-index": index }}
                  >
                    {previousDigit}
                  </span>
                  <span
                    className="career-year-number is-incoming"
                    onAnimationEnd={
                      index === lastChangedDigit
                        ? () =>
                            setTransition((current) =>
                              current.id === transition.id
                                ? { ...current, from: current.to }
                                : current,
                            )
                        : undefined
                    }
                    style={{ "--digit-index": index }}
                  >
                    {digit}
                  </span>
                </>
              ) : (
                <span className="career-year-number is-static">{digit}</span>
              )}
            </span>
          );
        })}
      </span>
    </div>
  );
}

function App() {
  const [activeStoryKey, setActiveStoryKey] = useState(portfolioStories[0].key);
  const [showLauncher, setShowLauncher] = useState(true);
  const [launcherPoweredOn, setLauncherPoweredOn] = useState(false);
  const [activeTimelinePoint, setActiveTimelinePoint] = useState({
    year: careerTimeline[0].timelineYears[0],
    workIndex: 0,
  });
  const storyNodesRef = useRef(new Map());
  const yearNodesRef = useRef(new Map());
  const workHeaderRef = useRef(null);
  const launcherAnimationPlayedRef = useRef(false);
  const programmaticNavigationRef = useRef(null);
  const programmaticNavigationTimerRef = useRef(null);
  const activeStory =
    portfolioStories.find((story) => story.key === activeStoryKey) ??
    portfolioStories[0];

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setLauncherPoweredOn(true);
      return undefined;
    }

    const powerTimer = window.setTimeout(
      () => setLauncherPoweredOn(true),
      1600,
    );

    return () => window.clearTimeout(powerTimer);
  }, []);

  useEffect(
    () => () => {
      if (programmaticNavigationTimerRef.current) {
        window.clearTimeout(programmaticNavigationTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const workHeader = workHeaderRef.current;

    if (!workHeader) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowLauncher(
          !entry.isIntersecting && entry.boundingClientRect.top > 0,
        );
      },
      {
        rootMargin: "0px 0px -45% 0px",
        threshold: 0,
      },
    );

    observer.observe(workHeader);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nodes = [...storyNodesRef.current.values()];

    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const navigation = programmaticNavigationRef.current;

        if (navigation) {
          const targetReached = entries.some(
            (entry) =>
              entry.target === navigation.node && entry.isIntersecting,
          );

          if (!targetReached) return;

          programmaticNavigationRef.current = null;

          if (programmaticNavigationTimerRef.current) {
            window.clearTimeout(programmaticNavigationTimerRef.current);
            programmaticNavigationTimerRef.current = null;
          }

          return;
        }

        const centeredEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              Math.abs(
                  first.boundingClientRect.top +
                    first.boundingClientRect.height / 2 -
                    window.innerHeight * 0.5,
              ) -
              Math.abs(
                  second.boundingClientRect.top +
                    second.boundingClientRect.height / 2 -
                    window.innerHeight * 0.5,
              ),
          )[0];

        const previewKey = centeredEntry?.target.dataset.previewKey;

        if (!previewKey) return;

        setActiveStoryKey(previewKey);

        if (centeredEntry.target.dataset.chapterStop === "true") {
          const story = portfolioStories.find((item) => item.key === previewKey);
          const company = story ? careerTimeline[story.workIndex] : undefined;

          if (company) {
            setActiveTimelinePoint({
              year: company.timelineYears[0],
              workIndex: company.workIndex,
            });
          }
        }
      },
      {
        rootMargin: "-48% 0px -48% 0px",
        threshold: 0,
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nodes = [...yearNodesRef.current.values()];

    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (programmaticNavigationRef.current) return;

        const centeredEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              Math.abs(
                first.boundingClientRect.top - window.innerHeight * 0.5,
              ) -
              Math.abs(
                second.boundingClientRect.top - window.innerHeight * 0.5,
              ),
          )[0];

        if (!centeredEntry?.target.dataset.timelineYear) return;

        const nextPoint = {
          year: centeredEntry.target.dataset.timelineYear,
          workIndex: Number(centeredEntry.target.dataset.workIndex),
        };

        setActiveTimelinePoint((current) =>
          current.year === nextPoint.year &&
          current.workIndex === nextPoint.workIndex
            ? current
            : nextPoint,
        );
      },
      {
        rootMargin: "-48% 0px -48% 0px",
        threshold: 0,
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  function registerStoryNode(key, node) {
    if (node) {
      storyNodesRef.current.set(key, node);
    } else {
      storyNodesRef.current.delete(key);
    }
  }

  function registerYearNode(key, node) {
    if (node) {
      yearNodesRef.current.set(key, node);
    } else {
      yearNodesRef.current.delete(key);
    }
  }

  function selectStory(key) {
    const node = storyNodesRef.current.get(key);
    const story = portfolioStories.find((item) => item.key === key);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setShowLauncher(false);
    setActiveStoryKey(key);

    if (story) {
      const years = getCompanyTimelineYears(story.company);
      const projectCount = story.company.projects.length;
      const progress =
        projectCount > 1 && story.projectIndex >= 0
          ? story.projectIndex / (projectCount - 1)
          : 0;
      const yearIndex = Math.round(progress * (years.length - 1));

      setActiveTimelinePoint({
        year: years[yearIndex],
        workIndex: story.workIndex,
      });
    }

    node?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  function selectLauncherStory(key) {
    const story = portfolioStories.find((item) => item.key === key);

    if (!story) return;

    const nodeKey =
      story.projectIndex === 0 && story.company.projects.length
        ? `chapter-${story.key}`
        : story.key;
    const node = storyNodesRef.current.get(nodeKey);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const years = getCompanyTimelineYears(story.company);
    const projectCount = story.company.projects.length;
    const progress =
      projectCount > 1 && story.projectIndex >= 0
        ? story.projectIndex / (projectCount - 1)
        : 0;
    const yearIndex = Math.round(progress * (years.length - 1));

    if (programmaticNavigationTimerRef.current) {
      window.clearTimeout(programmaticNavigationTimerRef.current);
      programmaticNavigationTimerRef.current = null;
    }

    if (node) {
      programmaticNavigationRef.current = { node };
      programmaticNavigationTimerRef.current = window.setTimeout(() => {
        programmaticNavigationRef.current = null;
        programmaticNavigationTimerRef.current = null;
      }, reducedMotion ? 250 : 2600);
    }

    setShowLauncher(false);
    setActiveStoryKey(story.key);
    setActiveTimelinePoint({
      year: years[yearIndex],
      workIndex: story.workIndex,
    });

    node?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  function selectCompany(workIndex) {
    const story = portfolioStories.find(
      (item) => item.workIndex === workIndex,
    );

    if (!story) return;

    const nodeKey = story.company.projects.length
      ? `chapter-${story.key}`
      : story.key;
    const node = storyNodesRef.current.get(nodeKey);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (programmaticNavigationTimerRef.current) {
      window.clearTimeout(programmaticNavigationTimerRef.current);
      programmaticNavigationTimerRef.current = null;
    }

    if (node) {
      programmaticNavigationRef.current = { node };
      programmaticNavigationTimerRef.current = window.setTimeout(() => {
        programmaticNavigationRef.current = null;
        programmaticNavigationTimerRef.current = null;
      }, reducedMotion ? 250 : 2600);
    }

    setShowLauncher(false);
    setActiveStoryKey(story.key);
    setActiveTimelinePoint({
      year: careerTimeline[workIndex].timelineYears[0],
      workIndex,
    });

    node?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <main className="portfolio-shell" id="main">
        <section
          className="portfolio-intro"
          id="top"
          aria-labelledby="intro-title"
        >
          <div className="portfolio-intro-inner">
            <PointerPortrait />
            <div className="intro-copy">
              <h1 id="intro-title">Hello, I’m Will</h1>
              <p className="intro-description">
                A product-minded engineer in Brooklyn, currently an{" "}
                <a href="https://ro.am/" target="_blank" rel="noreferrer">
                  !nventor at Roam
                </a>{" "}
                building its Android app. I also make independent software through{" "}
                <EziStudioWordmark />.
              </p>
            </div>
          </div>
        </section>

        <aside className="portfolio-preview-column" aria-label="Selected project preview">
          <div
            className={`portfolio-preview-surface preview-company-${activeStory.workIndex}${
              showLauncher ? " is-launcher" : ""
            }`}
          >
            {!showLauncher ? (
              <div className="preview-year">
                <YearTicker
                  company={careerTimeline[activeTimelinePoint.workIndex].name}
                  value={activeTimelinePoint.year}
                />
              </div>
            ) : null}
            <div
              className="preview-visual"
              key={showLauncher ? "launcher" : activeStory.key}
            >
              {showLauncher ? (
                <PortfolioLauncher
                  animatePowerOn={!launcherAnimationPlayedRef.current}
                  onPowerOnAnimationStart={() => {
                    launcherAnimationPlayedRef.current = true;
                  }}
                  onSelectStory={selectLauncherStory}
                  poweredOn={launcherPoweredOn}
                />
              ) : (
                <DevicePreview story={activeStory} />
              )}
            </div>
            {!showLauncher ? (
              <div className="preview-caption" aria-live="polite">
                <span>{activeStory.company.name}</span>
                <strong>{activeStory.title}</strong>
              </div>
            ) : null}
          </div>
        </aside>

        <section
          className="portfolio-work"
          id="work"
          aria-labelledby="work-title"
        >
          <header className="portfolio-work-header" ref={workHeaderRef}>
            <h2 id="work-title">My work over the years</h2>
          </header>

          <div className="vertical-career" aria-label="Work timeline, newest first">
            {careerTimeline.map((company) => {
              const companyStories = portfolioStories.filter(
                (story) => story.workIndex === company.workIndex,
              );
              const firstStory = companyStories[0];
              const hasProjects = company.projects.length > 0;
              const isActive = activeStory.workIndex === company.workIndex;

              return (
                <article
                  className={`career-chapter${isActive ? " is-active" : ""}${
                    hasProjects ? "" : " is-summary"
                  }`}
                  key={company.name}
                  style={{ "--chapter-year-count": company.timelineYears.length }}
                >
                  {!hasProjects ? (
                    <CareerYearStops
                      company={company}
                      registerYearNode={registerYearNode}
                      withinProjects={false}
                    />
                  ) : null}

                  <div className="career-chapter-marker">
                    <div className="career-logo-anchor">
                      <button
                        type="button"
                        className="career-logo-button"
                        aria-label={`Show ${company.name} work`}
                        aria-pressed={isActive}
                        onClick={() => selectStory(firstStory.key)}
                      >
                        <img
                          className={company.logoClass}
                          src={company.logo}
                          alt=""
                          width="28"
                          height="28"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="career-chapter-content">
                    <header className="career-chapter-header">
                      <div className="career-chapter-heading">
                        <span
                          className="career-story-stop"
                          data-preview-key={firstStory.key}
                          data-chapter-stop="true"
                          aria-hidden="true"
                          ref={(node) =>
                            registerStoryNode(
                              hasProjects
                                ? `chapter-${firstStory.key}`
                                : firstStory.key,
                              node,
                            )
                          }
                        />
                        <h3>{company.name}</h3>
                        <RoleDetail copy={company.copy} />
                      </div>
                    </header>

                    {hasProjects ? (
                      <div className="career-projects">
                        <CareerYearStops
                          company={company}
                          registerYearNode={registerYearNode}
                          withinProjects
                        />
                        {companyStories.map((story) => {
                          const storyIsActive = activeStory.key === story.key;

                          return (
                            <article
                              className={`career-project${
                                storyIsActive ? " is-active" : ""
                              }`}
                              data-preview-key={story.key}
                              key={story.key}
                              ref={(node) => registerStoryNode(story.key, node)}
                            >
                              <button
                                type="button"
                                className="career-project-select"
                                aria-pressed={storyIsActive}
                                onClick={() => selectStory(story.key)}
                              >
                                <span>{story.title}</span>
                              </button>
                              <p>
                                {story.description}
                                {story.descriptionLink ? (
                                  <>
                                    <a
                                      href={story.descriptionLink.href}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {story.descriptionLink.label}
                                    </a>
                                    {story.descriptionSuffix}
                                  </>
                                ) : null}
                              </p>
                            </article>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="portfolio-footer">
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
            All rights reserved. I know it is unlikely for you to steal this, but
            just in case.
          </p>
        </footer>
      </main>
    </>
  );
}

export default App;
