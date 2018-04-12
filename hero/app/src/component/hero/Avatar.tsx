import * as React from 'react';
import './hero.css';
import { heroApi } from 'api/heroApi';

interface IAvatarProps {
  url: string;
  onClick?: (id: number) => void;
  getClassName?: string;
}

export class Avatar extends React.Component<IAvatarProps, any> {
  constructor(props: IAvatarProps) {
    super(props);
  }
  render() {
    return <img src={this.props.url} className={this.props.getClassName} />;
  }
}
