import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = 'http://localhost:3000';
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data.winstrom['faktura-vydana']);
      } catch (error) {
        setError('Internal server error');
      }
    };
    fetchData();
  }, []);

  console.log(data);

  return (
<div className="App">
  <h1>Objednávky</h1>
  {error ? (
    <div>{error}</div>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Uživatel</th>
          <th>Kód</th>
          <th>Kontakt Jméno</th>
          <th>Město</th>
          <th>Stát</th>
          <th>Ulice</th>
          <th>PSČ</th>
          <th>IČ</th>
          <th>DIČ</th>
          <th>Forma dopravy</th>
          <th>Způsob platby</th>
          <th>Stav</th>
          <th>Kód položky</th>
          <th>Název položky</th>
          <th>Celková cena</th>
          <th>Faktura</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item["uzivatel@showAs"]}</td>
            <td>{item.kod}</td>
            <td>{item.kontaktJmeno}</td>
            <td>{item.mesto}</td>
            <td>{item["statDph@showAs"]}</td>
            <td>{item.ulice}</td>
            <td>{item.psc}</td>
            <td>{item.ic}</td>
            <td>{item.dic}</td>
            <td>{item["formaDopravy@showAs"]}</td>
            <td>{item["formaUhradyCis@showAs"]}</td>
            <td>{item.stav}</td>
            <td>{item.cisObj}</td>
            <td>{item.nazevPolozky}</td>
            <td>{item.sumCelkem},-{ item["mena@showAs"]}</td>
            <td>{item.faktura}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


  );
}

export default App;
