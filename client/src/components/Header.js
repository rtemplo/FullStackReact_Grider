import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


class Header extends Component {
  renderContent = () => {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <li><a href="/auth/google">Login With Google</a></li>;
      default:
        return <li><a href="/api/logout">Logout</a></li>;
    }
  }

  render() {
    console.log(this.props);
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to={this.props.auth ? '/surveys' : '/'} style={{"left":"8px"}} className="left brand-logo">Emaily</Link>
          <ul className="right">
            { this.renderContent() }
            {/* <li><a>Login With Google</a></li> */}
          </ul>
        </div>
      </nav>
    );
  }
}

//condensed below using destructuring and object literal extensions
// const mapStateToProps = state => {
//   return { auth: state.auth };
// }
const mapStateToProps = ({ auth }) => {
  return { auth };
}

export default connect(mapStateToProps)(Header);