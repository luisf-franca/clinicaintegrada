import React, {useEffect} from 'react';
import './App.css';

// COMPONENTS
import Router from './components/Router/Router.jsx';

function App() {

  useEffect(() => {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImF0ZW5kZW50ZUB1c2VyLmNvbS5iciIsImp0aSI6ImRmMzhhYWMyLWI1M2ItNGI3OC1hOGMxLWIwYWFjYzZkMDI2MCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhdGVuZGVudGVAdXNlci5jb20uYnIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhdGVuZGVudGUiLCJleHAiOjE3MzI1ODA5NDEsImlzcyI6IkNsaW5pY2FJbnRlZ3JhZGFfSXNzdWVyIiwiYXVkIjoiQ2xpbmljYUludGVncmFkYV9BdWRpZW5jZSJ9.POomWgAy22KLVWq9xR8KpiSId4EJciBw19SRoR6rUSg');
  }, []);

  return (
    <>
      <Router />
    </>
  );
}

export default App;
