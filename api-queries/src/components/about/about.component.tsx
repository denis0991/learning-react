import type { JSX } from 'react';
import './about.styles.css';

export function About(): JSX.Element {
  return (
    <section className="about">
      <div className="about__container">
        <h1 className="about__title">About Star Trek Explorer</h1>

        <div className="about__content">
          <div className="about__section">
            <h2 className="about__subtitle">Our Application</h2>
            <p className="about__text">
              Star Trek Explorer is a comprehensive search application that
              allows you to explore the vast universe of Star Trek characters
              and animals. Whether you&apos;re a dedicated Trekkie or just your
              journey through the final frontier, our app provides an intuitive
              way to discover and learn about the diverse creatures that inhabit
              the Star Trek universe.
            </p>
          </div>

          <div className="about__section">
            <h2 className="about__subtitle">Powered by STAPI</h2>
            <p className="about__text">
              Our application leverages the powerful{' '}
              <a
                href="https://stapi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="about__link"
              >
                Star Trek API (STAPI)
              </a>{' '}
              — the first public RESTful API dedicated to Star Trek data. STAPI
              provides access to a comprehensive database of Star Trek lore,
              including characters, species, animals, and much more from across
              all Star Trek series and movies.
            </p>
          </div>

          <div className="about__section">
            <h2 className="about__subtitle">Key Features</h2>
            <ul className="about__features">
              <li className="about__feature-item">
                <span className="about__feature-icon">🔍</span>
                Real-time search across thousands of Star Trek animals and
                creatures
              </li>
              <li className="about__feature-item">
                <span className="about__feature-icon">📄</span>
                Detailed information cards with species classification
              </li>
              <li className="about__feature-item">
                <span className="about__feature-icon">⚡</span>
                Fast and efficient pagination for browsing large datasets
              </li>
            </ul>
          </div>

          <div className="about__section">
            <h2 className="about__subtitle">Development</h2>
            <p className="about__text">
              This application was built as part of the{' '}
              <a
                href="https://rs.school/courses/reactjs"
                target="_blank"
                rel="noopener noreferrer"
                className="about__link"
              >
                RS School React Course
              </a>{' '}
              — a free, community-based education program conducted by The
              Rolling Scopes Community. The course covers modern React
              development practices, including TypeScript, routing, state
              management, and testing.
            </p>
          </div>

          <div className="about__section">
            <h2 className="about__subtitle">Author</h2>
            <p className="about__text">
              Developed with passion for both Star Trek and modern web
              technologies.
            </p>
            <div className="about__socials">
              <p className="about__social-placeholder">
                <a
                  className="about__link"
                  href="https://github.com/JasonScriptLord"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>{' '}
                <a
                  className="about__link"
                  href="https://www.linkedin.com/in/%D0%B4%D0%B5%D0%BD%D0%B8%D1%81-%D0%BD%D0%B0%D1%81%D0%BE%D0%BD%D0%BE%D0%B2-46722b281/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
