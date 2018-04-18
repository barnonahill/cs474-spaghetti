import * as React from 'react';

interface HeaderProps {
  tag?: string; // Optional param
}

export default class Header extends React.Component<HeaderProps, {}> {
  private tag: string;

  constructor(props: HeaderProps) {
    super(props);
    this.tag = props.tag ? `${props.tag}` : `h2`;
  }

  render() {
    return (
      <header className="page-header">
        <this.tag>{this.props.children}</this.tag>
      </header>
    );
  }
}
