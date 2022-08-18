import { FC } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { FullPost } from "./pages/fullpost"
import { Dashboard } from "src/pages/dashboard"


export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Dashboard />
        </Route>
        <Route path="/read-post/:id" >
          <FullPost />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
