import React from 'react';
import {Link} from 'react-router';
import Routes from '../modules/routes';

export default function(props) {
  return (
    <nav>
      {Routes.map((route)=>{
        return (
          <Link className="nav-link"
                activeClassName="active"
                to={`/${route.path}`}
                key={route.path}>
              {route.name}
          </Link>
        )
      })}
    </nav>
  )
}
