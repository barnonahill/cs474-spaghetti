import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Jumbotron from '@src/components/Jumbotron.tsx';
import Header from '@src/components/Header.tsx';
// import Hello from './components/Hello';

class App {
  constructor(private container: HTMLDivElement) {}

  /**
   * Render our React application to the DOM.
   */
  render() {
    ReactDOM.render(
      <Jumbotron name="Cantus" desc="She lives!" />,
      this.container
    );

    ReactDOM.render(
      <Header tag="h2" inner="Home" />,
      this.container
    );
  }
}

const app: App = new App((document.getElementById('app') as HTMLDivElement));
app.render();
