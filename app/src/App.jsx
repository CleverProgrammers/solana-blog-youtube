import { useMemo } from "react"
import { BlogProvider } from "src/context/Blog"
import { Router } from "src/router"
import "./App.css"


export const App = () => {

  return (
    <BlogProvider>
      <Router />
    </BlogProvider>
  )
}
