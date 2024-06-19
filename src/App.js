import './App.css';
import { StartingPage } from "./pages/StartingPage/StartingPage";
import {
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import createRoutes from "./route/Route";
import {MainGamePage} from "./pages/MainGamePage/MainGamePage";
import {TransitionPage} from "./pages/TransitionPage/TransitionPage";
import {GameFailedPage} from "./pages/GameOverPage/GameFailedPage";
import {GameFinishedPage} from "./pages/GameOverPage/GameFinishedPage";
import {CarbonAmountPage} from "./pages/CarbonAmountPage.jsx.deprecated";

function App() {
  const routesConfig = [
    { path: '/', component: <StartingPage/>,index:0 },
      {path: '/main',component: <MainGamePage/>,index:1},
      {path:'/transition',component: <TransitionPage/>,index:2},
      {path: '/gameover',component: <GameFailedPage/>,index:3},
      {path: '/gamefinish',component: <GameFinishedPage/>,index:4},
      // {path:"/governmentCheckCarbonAmount",component: <CarbonAmountPage/>,index: 5}
  ];

  return (
      <Router>
        <Routes>
          {createRoutes(routesConfig)}
        </Routes>
      </Router>
  );
}

export default App;
