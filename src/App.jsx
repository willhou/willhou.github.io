import { useEffect, useState } from "react";

const work = [
  {
    name: "DoorDash",
    discipline: "Product engineering",
    copy: "Building mobile product experiences used in the moments when speed and clarity matter most.",
    links: [{ label: "Visit DoorDash", href: "https://www.doordash.com/" }],
  },
  {
    name: "Microsoft",
    discipline: "Mobile + design systems",
    copy: "Contributed to Outlook for Android and helped shape the Fluent Design System across products.",
    links: [
      {
        label: "Outlook for Android",
        href: "https://www.microsoft.com/en-us/microsoft-365/outlook-mobile-for-android-and-ios",
      },
      {
        label: "Fluent",
        href: "https://fluent2.microsoft.design/",
      },
    ],
  },
  {
    name: "Sunrise",
    discipline: "Calendar",
    copy: "Worked on a calendar people loved enough to miss. Sunrise was acquired by Microsoft.",
    links: [
      {
        label: "View the archive",
        href: "https://www.producthunt.com/products/sunrise-calendar",
      },
    ],
  },
  {
    name: "Foursquare",
    discipline: "Location products",
    copy: "Helped build the mobile experiences behind Swarm and City Guide.",
    links: [
      { label: "Swarm", href: "https://www.swarmapp.com/" },
      { label: "City Guide", href: "https://foursquare.com/city-guide" },
    ],
  },
];

const utilityLinks = [
  { label: "App ads", href: "/app-ads.txt" },
  { label: "CardMagic privacy", href: "/privacy/card.html" },
  { label: "Digital Clock privacy", href: "/privacy/dcw.html" },
  { label: "Mastermind privacy", href: "/privacy/mastermind.html" },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a className="monogram" href="#top" aria-label="Will Hou, home" onClick={closeMenu}>
          WH
        </a>
        <nav
          className={menuOpen ? "site-nav is-open" : "site-nav"}
          id="primary-navigation"
          aria-label="Primary"
        >
          <a href="#work" onClick={closeMenu}>
            Work
          </a>
          <a href="#studio" onClick={closeMenu}>
            Ezi Studio
          </a>
          <a href="mailto:apps@ezi.am" onClick={closeMenu}>
            Contact
          </a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">Will Hou / Software engineer + founder</p>
            <h1 id="hero-title">
              Software with
              <span>staying power.</span>
            </h1>
            <p className="hero-subtitle">
              Android, product systems, and small experiments from Brooklyn.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                See selected work
              </a>
              <a className="button button-secondary" href="mailto:apps@ezi.am">
                Start a conversation
              </a>
            </div>
          </div>

          <figure className="hero-media" data-reveal>
            <img
              src="/images/will-hou-editorial.webp"
              alt="Portrait of Will Hou"
              width="1023"
              height="1537"
              loading="eager"
              fetchPriority="high"
            />
          </figure>

          <p className="hero-name" aria-hidden="true">
            WILL
            <br />
            HOU
          </p>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading" data-reveal>
            <h2 id="work-title">Products people remember.</h2>
            <p>
              I have spent my career turning complex systems into mobile experiences that feel
              direct, useful, and human.
            </p>
          </div>

          <div className="work-list">
            {work.map((item) => (
              <article className="work-item" key={item.name} data-reveal>
                <div className="work-meta">
                  <p>{item.discipline}</p>
                </div>
                <div className="work-content">
                  <h3>{item.name}</h3>
                  <p>{item.copy}</p>
                </div>
                <div className="work-links" aria-label={`${item.name} links`}>
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

        <section className="craft-section" aria-labelledby="craft-title">
          <div className="craft-heading" data-reveal>
            <h2 id="craft-title">Clear thinking, made tangible.</h2>
          </div>

          <div className="craft-grid">
            <div className="craft-cell craft-image" data-reveal>
              <img
                src="/images/will-hou-editorial.webp"
                alt=""
                width="1023"
                height="1537"
                loading="lazy"
              />
            </div>
            <div className="craft-cell craft-statement" data-reveal>
              <p>Make it clear. Make it durable.</p>
            </div>
            <article className="craft-cell craft-detail craft-detail-dark" data-reveal>
              <h3>Mobile craft</h3>
              <p>Native-feeling interactions, resilient architecture, and careful performance.</p>
            </article>
            <article className="craft-cell craft-detail" data-reveal>
              <h3>Systems thinking</h3>
              <p>Design and engineering decisions that scale beyond a single screen or launch.</p>
            </article>
          </div>
        </section>

        <section className="studio-section" id="studio" aria-labelledby="studio-title">
          <div className="studio-copy" data-reveal>
            <p className="studio-kicker">Built on the side, taken seriously</p>
            <h2 id="studio-title">Ezi Studio</h2>
            <p>
              A small studio started at Waterloo for Android apps, early-stage product consulting,
              and teams that need experienced engineering judgment.
            </p>
            <a
              className="text-link"
              href="https://play.google.com/store/apps/details?id=com.maize.digitalClock"
              target="_blank"
              rel="noreferrer"
            >
              See an Android app <Arrow />
            </a>
          </div>
          <div className="studio-mark" aria-hidden="true" data-reveal>
            EZI
          </div>
        </section>

        <section className="outside-section" aria-labelledby="outside-title">
          <div data-reveal>
            <h2 id="outside-title">Away from the keyboard.</h2>
          </div>
          <div className="outside-list" data-reveal>
            <p>Dog walker</p>
            <p>Skier</p>
            <p>Arsenal supporter</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-lead">
          <p>Have a good problem?</p>
          <a href="mailto:apps@ezi.am">
            apps@ezi.am <Arrow />
          </a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Will Hou</p>
          <nav aria-label="Legal and utility links">
            {utilityLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}

export default App;
