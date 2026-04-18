import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Main portfolio sections
import Navbar      from './components/Navbar/Navbar'
import Hero        from './components/Hero/Hero'
import About       from './components/About/About'
import Projects    from './components/Projects/Projects'
import Skills      from './components/Skills/Skills'
import Contact     from './components/Contact/Contact'
import ChatWidget  from './components/ChatWidget/ChatWidget'

// Admin dashboard — lazy loaded (not bundled into main chunk)
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))

function Portfolio() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      {/* Site-wide draggable AI chat widget */}
      <ChatWidget />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: '#09090b', color: '#f59e0b',
                fontFamily: 'monospace', fontSize: '14px'
              }}>
                Loading admin...
              </div>
            }>
              <AdminDashboard />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
