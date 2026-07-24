import { useEffect, useRef, useState } from "react";

const work = [
  {
    name: "Roam",
    period: "Now",
    discipline: "!nventor, Android",
    copy: "Building the Roam Android app and bringing its virtual office experience to mobile.",
    logo: "/images/logos/roam.png",
    logoClass: "logo-roam",
    links: [{ label: "Roam", href: "https://ro.am/" }],
    current: true,
  },
  {
    name: "DoorDash",
    period: "Previously",
    discipline: "Product and infrastructure",
    copy: "Built mobile product experiences used in moments when speed and clarity mattered most.",
    logo: "/images/logos/doordash.svg",
    links: [{ label: "DoorDash", href: "https://www.doordash.com/" }],
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
  },
  {
    name: "University of Waterloo",
    period: "Education",
    discipline: "BMath, Computer Science",
    copy: "Earned a BMath in Computer Science and started Ezi Studio while studying at Waterloo.",
    logo: "/images/logos/waterloo.png",
    links: [{ label: "Waterloo", href: "https://uwaterloo.ca/" }],
  },
];

const careerTimeline = work.map((item, workIndex) => ({ ...item, workIndex }));

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function PointerPortrait() {
  const portraitRef = useRef(null);

  useEffect(() => {
    const portrait = portraitRef.current;

    if (!portrait) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let motionEnabled = finePointer.matches && !reducedMotion.matches;
    let animationFrame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let velocityX = 0;
    let velocityY = 0;

    function paint() {
      velocityX = (velocityX + (targetX - currentX) * 0.11) * 0.72;
      velocityY = (velocityY + (targetY - currentY) * 0.11) * 0.72;
      currentX += velocityX;
      currentY += velocityY;

      const scale = Math.min(portrait.getBoundingClientRect().width / 124, 1);

      portrait.style.setProperty("--head-x", `${currentX * 4.5 * scale}px`);
      portrait.style.setProperty("--head-y", `${currentY * 3.2 * scale}px`);
      portrait.style.setProperty("--head-yaw", `${currentX * 5}deg`);
      portrait.style.setProperty("--head-pitch", `${currentY * -3.5}deg`);
      portrait.style.setProperty("--head-roll", `${currentX * 0.35}deg`);
      portrait.style.setProperty("--pupil-x", `${currentX * 1.8 * scale}px`);
      portrait.style.setProperty("--pupil-y", `${currentY * 3 * scale}px`);

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
      const horizontalRange = Math.max(window.innerWidth * 0.42, 1);
      const verticalRange = Math.max(window.innerHeight * 0.42, 1);

      targetX = Math.max(-1, Math.min(1, (event.clientX - centerX) / horizontalRange));
      targetY = Math.max(-1, Math.min(1, (event.clientY - centerY) / verticalRange));
      requestPaint();
    }

    function handleMotionPreference() {
      motionEnabled = finePointer.matches && !reducedMotion.matches;

      if (!motionEnabled) resetPortrait();
    }

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
    };
  }, []);

  return (
    <div
      className="portrait-stage"
      ref={portraitRef}
      role="img"
      aria-label="Illustration of Will Hou looking toward the pointer"
    >
      <div className="portrait-rig">
        <span className="portrait-body" aria-hidden="true" />
        <img
          className="portrait-character"
          src="/images/will-hou-character.png"
          alt=""
          width="512"
          height="560"
          loading="eager"
          fetchPriority="high"
        />
        <span className="portrait-pupil portrait-pupil-left" aria-hidden="true" />
        <span className="portrait-pupil portrait-pupil-right" aria-hidden="true" />
      </div>
    </div>
  );
}

function App() {
  const [activeWork, setActiveWork] = useState(0);
  const roleRefs = useRef([]);
  const timelineRef = useRef(null);
  const activeTimelineStop = activeWork;
  const timelineProgress =
    activeTimelineStop === work.length - 1
      ? 1
      : (activeTimelineStop + 0.5) / work.length;

  function selectWork(index, reveal = false) {
    setActiveWork(index);

    if (!reveal) return;

    const timeline = timelineRef.current;
    const role = roleRefs.current[index];

    if (!timeline || !role || timeline.scrollWidth <= timeline.clientWidth) return;

    const timelineRect = timeline.getBoundingClientRect();
    const roleRect = role.getBoundingClientRect();
    const isOutside =
      roleRect.left < timelineRect.left || roleRect.right > timelineRect.right;

    if (!isOutside) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timeline.scrollTo({
      left:
        timeline.scrollLeft +
        roleRect.left -
        timelineRect.left -
        (timeline.clientWidth - roleRect.width) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
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
              , working on the Android app and focused on tools that are clear, useful, and
              considerate.
            </h1>
            <p className="intro-details">
              I also run Ezi Studio for{" "}
              <a
                href="https://play.google.com/store/apps/details?id=com.maize.digitalClock"
                target="_blank"
                rel="noreferrer"
              >
                Android apps
              </a>
              , personal experiments, and early-stage product consulting. Away from the screen,
              I’m usually walking the dog, skiing, or following Arsenal. Find me on{" "}
              <a
                href="https://www.linkedin.com/in/william-hou-07282130/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>{" "}
              and{" "}
              <a href="https://github.com/mhhou" target="_blank" rel="noreferrer">
                GitHub
              </a>
              .
            </p>
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
                      aria-controls={`work-role-${item.workIndex}`}
                      aria-pressed={isActive}
                      key={item.name}
                      onClick={() => selectWork(item.workIndex, true)}
                      onFocus={() => selectWork(item.workIndex, true)}
                      onMouseEnter={() => selectWork(item.workIndex, true)}
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
            <p>Work and education, newest first</p>
          </div>
          <div className="timeline" ref={timelineRef}>
            {work.map((item, index) => (
              <article
                className={[
                  "role",
                  item.current ? "current" : "",
                  activeWork === index ? "selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                id={`work-role-${index}`}
                key={item.name}
                ref={(node) => {
                  roleRefs.current[index] = node;
                }}
                onFocusCapture={() => selectWork(index)}
                onMouseEnter={() => selectWork(index)}
              >
                <p className="period">{item.period}</p>
                <h3 className="company-name">
                  <img
                    className={["company-logo", item.logoClass].filter(Boolean).join(" ")}
                    src={item.logo}
                    alt=""
                    width="24"
                    height="24"
                    loading="lazy"
                  />
                  <span>{item.name}</span>
                </h3>
                <p className="role-title">{item.discipline}</p>
                <p className="role-detail">{item.copy}</p>
                <div className="role-links" aria-label={`${item.name} links`}>
                  {item.links.map((link) => (
                    <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                      {link.label} <Arrow />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      <footer className="shell site-footer">
        <p>© {new Date().getFullYear()} Will Hou</p>
        <p className="footer-note">
          All rights reserved. I know it is unlikely for you to steal this, but just in case.
        </p>
      </footer>
    </>
  );
}

export default App;
