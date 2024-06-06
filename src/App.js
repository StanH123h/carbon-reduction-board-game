import './App.css';
import { StartingPage } from "./pages/StartingPage/StartingPage";
import {
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import createRoutes from "./route/Route";
import {MainGamePage} from "./pages/MainGamePage/MainGamePage";
import {TransitionPage} from "./pages/TransitionPage/TransitionPage";
import {GameOverPage} from "./pages/GameOverPage/GameOverPage";

function App() {
  const routesConfig = [
    { path: '/', component: <StartingPage/>,index:0 },
      {path: '/main',component: <MainGamePage/>,index:1},
      {path:'/transition',component: <TransitionPage/>,index:2},
      {path: '/gameover',component: <GameOverPage/>,index:3}
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
