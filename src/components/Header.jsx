import React from 'react'
import './Header.css'

export default function Header(){
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <img src="/assets/hero.png" alt="365 Evergreen" className="app-header__logo" />
        <div>
          <div className="app-header__title">365 Evergreen LMS</div>
          <div className="app-header__subtitle">SWA prototype</div>
        </div>
      </div>
      <nav className="app-header__nav" aria-label="Main navigation">
        <a href="#" className="app-header__link">Home</a>
        <a href="#" className="app-header__link">Courses</a>
        <a href="#" className="app-header__link">About</a>
      </nav>
    </header>
  )
}
