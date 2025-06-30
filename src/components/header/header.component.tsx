import React, { type ReactNode } from 'react';
import './header.styles.css';

export class Header extends React.Component {
  render(): ReactNode {
    return (
      <header>
        <h1>Star Trek</h1>
        <h2>Animals</h2>
      </header>
    );
  }
}
