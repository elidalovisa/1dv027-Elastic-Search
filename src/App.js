import './App.css';

import Graph from './components/Graph.js';


// GET ALL (set size) /argentina/_search?size=30&q=*:*
// /argentina/_search?pretty&q=TimeStamp:2022-05-13
// /argentina/_search?pretty
//https://sxr5w7jebl:ihql44kfcj@apple-279251793.eu-west-1.bonsaisearch.net:443
function App() {
  return (
    <div className="App">
      <header className="App-header">  
        <Graph />
      </header>
    </div>
  );
}

export default App;
