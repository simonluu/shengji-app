import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// imports main application
import App from './components/app';

export const routes = (
  <BrowserRouter>
    <Route component={App} />
  </BrowserRouter>
);

const Routes = () => (routes);

export default Routes;