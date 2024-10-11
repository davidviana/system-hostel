import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Erro:', error));
  }, []);

  return (
    <div className="App">
      <h1>Dados do DB</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
          <form action="/submit" method="POST">
            <input type="text" name="username" placeholder="Digite seu nome" required/>
            <button type="submit">Submit</button>
          </form>
      </ul>
    </div>
  );
}

export default App;
