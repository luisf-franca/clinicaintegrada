import React, {useEffect} from 'react';
import './App.css';

// COMPONENTS
import Router from './components/Router/Router.jsx';

function App() {

  useEffect(() => {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImF0ZW5kZW50ZUB1c2VyLmNvbS5iciIsImp0aSI6IjczNzQ5NmQ4LTlhYzgtNDliYS1hMTI1LTViNTFkZjI4NjgxNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhdGVuZGVudGVAdXNlci5jb20uYnIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhdGVuZGVudGUiLCJleHAiOjE3MzI2MTAzMTYsImlzcyI6IkNsaW5pY2FJbnRlZ3JhZGFfSXNzdWVyIiwiYXVkIjoiQ2xpbmljYUludGVncmFkYV9BdWRpZW5jZSJ9.l0tr8r2akgAF6I9RTWEcE-s8jIAl7myLdO6oT8rU1bE');
  }, []);

  return (
    <>
      <Router />
    </>
  );
}

export default App;
