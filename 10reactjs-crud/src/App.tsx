import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';

import GlobalStyle from './styles/global';

const App: React.FC = () => (
  <>
    <GlobalStyle />
    <Router>
      <Routes />
    </Router>
  </>
);

export default App;

// yarn json-server server.json -p 3333