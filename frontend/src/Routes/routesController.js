// renderRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminProtectedRoutes,ProtectedRoute } from '../ProtectedRoutes'
const renderRoutes = (myroutes,type="common",allowedRoles) => (
  <>
    {myroutes.map((myroute) => (
      <Route
        key={myroute.path}
        path={myroute.path}
      >
        <Route
            path={myroute.path}
            index
            element= {
            type==="common"?
            <ProtectedRoute  component={myroute.component}/>
            :
            <AdminProtectedRoutes component={myroute.component} allowedRoles={allowedRoles} />
            }
        />
        {myroute.subRoutes?.map((subroute)=>{
            return <Route
            key={subroute.path}
            path={subroute.path}
            element={<ProtectedRoute  component={subroute.component}  type={type}/>}
            />
        })}
        </Route>
    ))}
  </>
);

export default renderRoutes;
