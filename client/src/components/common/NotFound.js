import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: '100px',
        height: '100vh',
        width: '100vw'
      }}
    >
      <div>
        <h1>Page Not Found</h1>
        <p>
          Sorry, what you are trying to access does not exist. Return to{' '}
          <Link to="/dashboard">dashboard</Link>.
        </p>
      </div>
    </div>
  );
};
