import React from 'react'
import CourseCardGrid from './components/CourseCardGrid'
import Header from './components/Header'

export default function App(){
  return (
    <div className="app-root">
      <Header />
      <main>
        <section className="hero">
          <p>This is the migrated Azure Static Web App scaffold. Below are sample courses from Dataverse (via the functions proxy).</p>
        </section>
        <CourseCardGrid />
      </main>
    </div>
  )
}
