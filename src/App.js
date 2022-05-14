import './App.css';
import base64 from 'base-64'
import utf8 from 'utf8'


// GET ALL (set size) /argentina/_search?size=30&q=*:*
// /argentina/_search?pretty&q=TimeStamp:2022-05-13
// /argentina/_search?pretty
//https://sxr5w7jebl:ihql44kfcj@apple-279251793.eu-west-1.bonsaisearch.net:443
function App() {

  const getProvince= async () => {
    const body = {
      fields: ['province']
    }
    const credUtf = utf8.encode(process.env.REACT_APP_USERNAME + ':' + process.env.REACT_APP_PASSWORD)
    const credentials = base64.encode(credUtf)
    const response = await fetch(process.env.REACT_APP_BONSAI_URL + '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.province', {
      method: 'GET',
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + credentials,

       },
    })
    const result = await response.json()
    console.log(result.hits.hits[0]._source.province)

  }
/*  const connect = () => {
    this.client = elasticsearch.Client({
      host: "https://sxr5w7jebl:ihql44kfcj@apple-2792517
      93.eu-west-1.bonsaisearch.net:443"
  })

  this.client.ping({
      requestTimeout: 30000,
  }, function (error) {
      if (error) {
          console.error('elasticsearch cluster is down!');
      } else {
          console.log('All is well');
      }
  })
}*/
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={getProvince}>Get province</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
