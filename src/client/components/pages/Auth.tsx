import * as React from 'react';
import * as BS from 'react-bootstrap';

import LogIn from '../forms/LogIn';
import SignUp from '../forms/SignUp';

export const Auth = () =>  (
  <BS.Col xs={12}>
    <BS.PageHeader>
      Welcome Back!
    </BS.PageHeader>
    <BS.Col xs={12} sm={6} md={5} lg={4}>
      <BS.Panel header={'Sign into your account'}>
        <LogIn />
      </BS.Panel>
    </BS.Col>
    <BS.Col xs={12} sm={6} md={5} lg={4}>
      <BS.Panel header={'Create a new account'}>
        <SignUp />
      </BS.Panel>
    </BS.Col>
  </BS.Col>
);
