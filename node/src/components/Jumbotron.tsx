import * as React from 'react';
import {
  Jumbotron
} from 'react-bootstrap';

interface JumboProps {
  name: string;
  desc: string;
}

export default class OurJumbotron extends React.Component<JumboProps, {}> {
  render() {
    return <div className="container">
      <Jumbotron>
        <h1>{this.props.name}</h1>
        <p>{this.props.desc}</p>
      </Jumbotron>
    </div>;
  }
}
