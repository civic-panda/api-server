import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { auth } from '../../modules';

interface Props {
  isLoggedIn: boolean;
  logOut(): any;
}

const NavLinks = (props: Props) => (
  <BS.Navbar.Collapse>
    <BS.Nav>
      <LinkContainer to={'/causes'}>
        <BS.NavItem>Causes</BS.NavItem>
      </LinkContainer>
      <LinkContainer to={'/tasks'}>
        <BS.NavItem>Tasks</BS.NavItem>
      </LinkContainer>
      <LinkContainer to={'/volunteers'}>
        <BS.NavItem>Volunteers</BS.NavItem>
      </LinkContainer>
      <BS.NavItem
        onClick={() => window.open('https://www.actonthis.org', '_blank')}
        href={'https://www.actonthis.org'}
        target={'_blank'}
        role={'Link out to client facing site'}
      >
        ActOnThis.org <BS.Glyphicon glyph={'new-window'} />
      </BS.NavItem>
    </BS.Nav>
    <BS.Navbar.Form pullRight>
      <BS.Button onClick={props.logOut} bsStyle={'link'}>Log Out</BS.Button>
    </BS.Navbar.Form>
  </BS.Navbar.Collapse>
);

const NavBarInstance = (props: Props) => (
  <BS.Navbar staticTop collapseOnSelect>
    <BS.Navbar.Header>
      <IndexLink to="/">
        <BS.Navbar.Brand>
          <img
            className={'nav-logo'}
            src={'/assets/images/act-on-this-logo.png'}
            alt={'act on this logo'}
          />
        </BS.Navbar.Brand>
      </IndexLink>
      <BS.Navbar.Toggle />
    </BS.Navbar.Header>
    {props.isLoggedIn && <NavLinks {...props} />}
  </BS.Navbar>
);

const mapStateToProps = (state: any) => ({
  isLoggedIn: auth.selectors.isLoggedIn(state),
})

const mapDispatchToProps = {
  logOut: auth.logOut
}

export const NavBar = connect(mapStateToProps, mapDispatchToProps, null, {
  pure: false
})(NavBarInstance);
