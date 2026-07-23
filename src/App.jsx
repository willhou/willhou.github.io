import { useRef, useState } from "react";

const work = [
  {
    name: "Roam",
    period: "Now",
    discipline: "!nventor, Android",
    copy: "Building the Roam Android app and bringing its virtual office experience to mobile.",
    logo: "/images/logos/roam.png",
    links: [{ label: "Roam", href: "https://ro.am/" }],
    current: true,
  },
  {
    name: "DoorDash",
    period: "Previously",
    discipline: "Product engineering",
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
];

const careerTimeline = work.map((item, workIndex) => ({ ...item, workIndex }));

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function App() {
  const [activeWork, setActiveWork] = useState(0);
  const roleRefs = useRef([]);
  const activeTimelineStop = activeWork;

  function selectWork(index, reveal = false) {
    setActiveWork(index);

    if (reveal) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      roleRefs.current[index]?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="shell site-header">
        <nav className="site-nav" aria-label="Primary">
          <a className="wordmark" href="#top" aria-label="Will Hou, home">
            <span className="wordmark-mark" aria-hidden="true">
              WH
            </span>
            <span>Will Hou</span>
          </a>
          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#studio">Ezi Studio</a>
            <a href="#about">About</a>
            <a href="mailto:apps@ezi.am">Email</a>
          </div>
        </nav>
      </header>

      <main className="shell" id="main">
        <section className="intro" id="top" aria-labelledby="intro-title">
          <img
            className="portrait"
            src="/images/will-hou-editorial.webp"
            alt="Portrait of Will Hou"
            width="1023"
            height="1537"
            loading="eager"
            fetchPriority="high"
          />
          <div className="intro-copy">
            <p className="intro-greeting">Hello, I’m Will.</p>
            <h1 id="intro-title">I make thoughtful software.</h1>
            <p className="intro-role">
              Currently an{" "}
              <a href="https://ro.am/" target="_blank" rel="noreferrer">
                !nventor at Roam
              </a>
              , working on the Android app.
            </p>
          </div>
          <p className="intro-note">
            A product-minded engineer in Brooklyn, focused on tools that are clear, useful, and
            considerate.
          </p>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div
            className="career-divider"
            style={{ "--timeline-progress": (activeTimelineStop + 0.5) / work.length }}
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
                      onFocus={() => selectWork(item.workIndex)}
                      onMouseEnter={() => selectWork(item.workIndex)}
                    >
                      <span className="career-marker">
                        <img src={item.logo} alt="" width="20" height="20" loading="lazy" />
                      </span>
                      <span className="career-label">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="section-head">
            <h2 id="work-title">Work over time</h2>
            <p>Selected work, newest first</p>
          </div>
          <div className="timeline">
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
                    className="company-logo"
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

        <section className="lower" aria-label="More about Will">
          <article id="studio">
            <p className="kicker">Independent practice</p>
            <h2>Ezi Studio</h2>
            <p>
              A small studio started at Waterloo for Android apps, personal experiments, and
              early-stage product consulting.
            </p>
            <a
              className="text-link"
              href="https://play.google.com/store/apps/details?id=com.maize.digitalClock"
              target="_blank"
              rel="noreferrer"
            >
              See an Android app <Arrow />
            </a>
          </article>

          <article id="about">
            <p className="kicker">Away from the screen</p>
            <h2>A little more human</h2>
            <p>
              I’m often walking the dog, skiing when winter cooperates, or following Arsenal with
              more optimism than good sense.
            </p>
          </article>

          <article>
            <p className="kicker">Keep in touch</p>
            <h2>Contact</h2>
            <div className="contact-list">
              <a href="mailto:apps@ezi.am">apps@ezi.am</a>
              <a href="https://github.com/mhhou" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </article>
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
