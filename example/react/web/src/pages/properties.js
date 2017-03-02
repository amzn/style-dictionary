import React from 'react';
import styleDictionary from '../styleDictionary/properties';
import Property from '../components/property';
import keys from 'lodash/keys';

class Properties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: styleDictionary
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    console.log(e);
  }

  renderNodes(node, path, name) {
    if (node.hasOwnProperty('value')) {
      return (
        <Property {...node} name={name} onClick={this.toggle} />
      );
    } else {
      return keys(node).map((key)=> {
        var path = path ? `${path}.${key}` : key;
        return (
          <Property {...node[key]} onClick={this.toggle} key={key} name={key}>
            {this.renderNodes(node[key], path, key)}
          </Property>
        )
      })
    }
  }

  render() {
    return (
      <div className="property-tree">
        {this.renderNodes(styleDictionary)}
      </div>
    )
  }
}

export default Properties;
