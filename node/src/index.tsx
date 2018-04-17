import * as React from 'react';
import * as ReactDOM from 'react-dom';

import LibraryForm from '@src/components/forms/Library.tsx'
// import Hello from './components/Hello';

class App {
  constructor(private container: HTMLDivElement) {}

  /**
   * Render our React application to the DOM.
   */
  render() {
    ReactDOM.render(
      <LibraryForm stack={[]} />,
      this.container
    );
    // ReactDOM.render(
    //   <Jumbotron name="Cantus" desc="She lives!" />,
    //   this.container
    // );
    //
    // ReactDOM.render(
    //   <Header tag="h2" inner="Home" />,
    //   this.container
    // );
  }
}

const app: App = new App((document.getElementById('app') as HTMLDivElement));
app.render();
