import React from "react";
import { Routes, Route } from "react-router-dom";

import Students from "./Students";
import RessultsList from './ResultsList'
import Ressult from './Result'
import Test from "./Test";
const App = () => {
    return (
      <Routes>
        <Route path="/manager" exact element={<Students />} />
        <Route path="/manager/results/:id" exact element={<RessultsList />} />  
        <Route path="/manager/result/:id/:quizzes_id" exact element={<Ressult />} />  
        <Route path="/user/panel/indexQuizze" exact element={<Test />} />  
      </Routes>
    );
}

export default App