import React from 'react'
import CourseCardGrid from './components/CourseCardGrid'

export default function App(){
  return (
    <div className="app-root">
      <header>
        <h1>365 Evergreen LMS — SWA prototype</h1>
      </header>
      <main>
        <p>This is the migrated Azure Static Web App scaffold. Below are sample courses from Dataverse (via the functions proxy).</p>
        <CourseCardGrid />
      </main>
    </div>
  )
}
