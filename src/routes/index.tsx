import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Dashboard } from '../pages/Dashboard'

export const Routes: React.FunctionComponent = () => {
  return (
    <React.Suspense fallback={'Loading...'}>
      <Switch>
        <Route component={Dashboard} path="/" exact />
      </Switch>
    </React.Suspense>
  )
}
