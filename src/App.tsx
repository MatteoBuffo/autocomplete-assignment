import React, {useEffect, useState} from 'react';
import AutoComplete from './components/AutoComplete';
import DataSourceOptions from "./components/DataSourceOptions";
import {DataSource} from "./types/dataSource";
import {fetchRemoteUsers} from "./services/remote";
import {fetchLocalUsers} from "./services/local";
import './App.css';

const App: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataSource>(DataSource.REMOTE);

  const handleDataSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataSource(e.target.value as DataSource);
  };

  const fetchData = async (searchTerm: string) => {
    return dataSource === DataSource.LOCAL
        ? fetchLocalUsers(searchTerm)
        : fetchRemoteUsers(searchTerm);
  };

  useEffect(() => {
    const setVh = () => {
      // Sets CSS variable --vh to 1% of the viewport height (useful for mobile layouts)
      const vh = window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  return (
      <div
          role="main"
          className="app-container"
      >

        {/* 1. (optional) App title */}
        <h1
            id="title"
            className="app-title"
        >
          My Auto-complete Component
        </h1>

        {/* 2. (optional) Select data source */}
        <DataSourceOptions
            dataSource={dataSource}
            handleDataSourceChange={handleDataSourceChange}
        />

        {/*/!* 3. Auto-complete *!/*/}
        <AutoComplete
            fetchData={fetchData}
            placeholder="Search users..."
        />

      </div>
  );
};

export default App;
