import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useConfig from "./context/useConfig";
import Dashboard from "./Dashboard/Dashboard";
import Meeting from "./Meeting/Meeting";

export default function Postauth() {
  const stage = useConfig().app.STAGE;
  const urlStart = `/${stage}/`;

  return <Routes>
    <Route path={urlStart} element={<Dashboard/>}/>
    <Route path={`${urlStart}meeting/:meetingID`} element={<Meeting/>} />
    <Route path={`${urlStart}meeting/:meetingID/:accessToken`} element={<Meeting/>} />
    <Route path="*" element={<Navigate to={urlStart} replace/>} />
  </Routes>
}