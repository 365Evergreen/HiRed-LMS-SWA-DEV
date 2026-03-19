import React, { useEffect, useState } from 'react'
import './CourseCardGrid.css'

export default function CourseCardGrid(){
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      setError(null)
      try{
        const res = await fetch('/api/dataverse-proxy')
        if(!res.ok) throw new Error(`Proxy error ${res.status}`)
        // Safely handle empty responses (204) which would cause res.json() to throw
        const text = await res.text()
        const data = text ? JSON.parse(text) : { value: [] }
        if(mounted){
          setCourses(data.value || [])
        }
      }catch(err){
        if(mounted) setError(err.message)
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if(loading) return <div className="course-grid__status">Loading courses…</div>
  if(error) return <div className="course-grid__status error">Error: {error}</div>

  if(courses.length === 0) return <div className="course-grid__status">No courses found</div>

  return (
    <div className="course-grid">
      {courses.map(c => (
        <article key={c.e365_learningcourseid} className="course-card">
          <h3 className="course-card__title">{c.e365_name || 'Untitled course'}</h3>
          <div className="course-card__meta">ID: {c.e365_learningcourseid}</div>
        </article>
      ))}
    </div>
  )
}
