'use client';

import { useTranslations } from 'next-intl';
import type { JSX } from 'react';
import './about.styles.css';

export function About(): JSX.Element {
  const t = useTranslations('about');
  return (
    <section className="about">
      <div className="about__container">
        <h1 className="about__title">{t('title')}</h1>

        <div className="about__content">
          <div className="about__section">
            <h2 className="about__subtitle">{t('section1.title')}</h2>
            <p className="about__text">
             {t('section1.content')}
            </p>
          </div>

          <div className="about__section">
            <h2 className="about__subtitle">{t('section2.title')}</h2>
            <p className="about__text">
              {t('section2.content1')}{' '}
              <a
                href="https://stapi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="about__link"
              >
                Star Trek API (STAPI)
              </a>{' '}
              {t('section2.content2')}
            </p>
          </div>

          <div className="about__section">
            <h2 className="about__subtitle">{t('section3.title')}</h2>
            <ul className="about__features">
              <li className="about__feature-item">
                <span className="about__feature-icon">🔍</span>
                {t('section3.feature1')}
              </li>
              <li className="about__feature-item">
                <span className="about__feature-icon">📄</span>
                {t('section3.feature2')}
              </li>
              <li className="about__feature-item">
                <span className="about__feature-icon">⚡</span>
                {t('section3.feature3')}
              </li>
            </ul>
          </div>

          <div className="about__section">
            <h2 className="about__subtitle">{t('section4.title')}</h2>
            <p className="about__text">
              {t('section4.content1')}{' '}
              <a
                href="https://rs.school/courses/reactjs"
                target="_blank"
                rel="noopener noreferrer"
                className="about__link"
              >
                RS School React Course
              </a>{' '}
              {t('section4.content2')}
            </p>
          </div>

          <div className="about__section">
            <h2 className="about__subtitle">{t('section5.title')}</h2>
            <p className="about__text">
              {t('section5.content')}
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
