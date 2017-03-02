import React from 'react';
import keys from 'lodash/keys';
import {content} from '../styleDictionary/properties';

function renderProp(props) {
  if (props.properties.original.value.indexOf('{') > -1) {
    let val = props.properties.original.value.replace(/{|}/g, '').replace('.value', '');
    return (
      <a id={props.path} href={`#${val}`}>{val}</a>
    )
  } else {
    return (
      <span id={props.path}>{props.properties.original.value}</span>
    )
  }
}

function render(props) {
  if (props.properties.hasOwnProperty('value')) {
    return renderProp(Object.assign({}, props, {path: props.path}));
  } else {
    return keys(props.properties).map((key)=> {
      var path = props.path ? `${props.path}.${key}` : key;
      return (
        <div className="property-node" key={key} id={path} onClick={props.onClick}>
          <div className="property-node-title">
            <i className="property-node-icon icon">
              {content.icon.expand_less.value}
            </i>
            {key}
          </div>
          {render(Object.assign({}, props, {properties: props.properties[key], path: path}))}
        </div>
      );
    });
  }
}

function renderTop(props) {
  return (
    <div className="property-tree">
      {render(props)}
    </div>
  )
}

// export default renderTop;

// export default function(props) {
//   if (props.hasOwnProperty('value')) {
//     if (props.original.value.indexOf('{') > -1) {
//       let val = props.original.value.replace(/{|}/g, '').replace('.value', '');
//       return (
//         <a id={props.path} href={`#${val}`}>{val}</a>
//       )
//     } else {
//       return (
//         <span id={props.path}>{props.original.value}</span>
//       )
//     }
//   } else {
//     return (
//       <div className="property-node" id={props.path} onClick={props.onClick}>
//         <div className="property-node-title">
//           <i className="property-node-icon icon">
//             {content.icon.expand_less.value}
//           </i>
//           {props.name}
//         </div>
//         {props.children}
//       </div>
//     )
//   }
// }

class Property extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.toggle = this.toggle.bind(this);
  }

  renderLeaf() {
    if (this.props.hasOwnProperty('value')) {
      if (this.props.original.value.indexOf('{') > -1) {
        let val = this.props.original.value.replace(/{|}/g, '').replace('.value', '');
        return (
          <a id={this.props.path} href={`#${val}`}>{val}</a>
        )
      } else {
        return (
          <span id={this.props.path}>{this.props.original.value}</span>
        )
      }
    }
  }

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      expanded: !this.state.expanded
    });
  }

  className() {
    if (this.state.expanded) {
      return 'property-node expanded'
    } else {
      return 'property-node'
    }
  }

  render() {
    return (
      <div className={this.className()} id={this.props.path} onClick={this.toggle}>
        <div className="property-node-title">
          <i className="property-node-icon icon">
            {content.icon.expand_less.value}
          </i>
          {this.props.name}
          {this.renderLeaf()}
        </div>
        {this.props.children}
      </div>
    )
  }
}

export default Property;
