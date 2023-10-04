import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);
  const [page, setPage] = useState(1);

  const itemsPerPage = 25;

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/', {
        params: {
          search: searchQuery,
          limit: itemsPerPage,
          start: (page - 1) * itemsPerPage,
        },
      });
      setData(response.data.winstrom['faktura-vydana']);
      setResultCount(response.data.winstrom['@rowCount']);
    } catch (error) {
      setError('Internal server error');
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleDownload = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:3000/download/${itemId}.pdf`, {
        responseType: 'blob',
      });
    
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      a.download = `faktura c.: ${itemId}.pdf`;
      a.click();
  
      window.URL.revokeObjectURL(window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' })));
    } catch (error) {
      setError('Error downloading the file.');
    }
  };
  
  const totalPages = Math.ceil(resultCount / itemsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className='App'>

      <div className='search'>
        <input
          type='text'
          placeholder='Search...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className='objednavky'>
        <h1>Objednávky</h1>

        {error ? (
          <div>{error}</div>
        ) : (
          <div>
            {resultCount > 0 ? (
              <div>{`Found ${resultCount} result(s).`}</div>
            ) : (
              <div>No results found.</div>
            )}
            {resultCount > 0 && (
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
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.uzivatel.replace('code:', '')}</td>
                  <td>{item.kod}</td>
                  <td>{item.kontaktJmeno}</td>
                  <td>{item.mesto}</td>
                  <td>{item.stat.replace('code:', '')}</td>
                  <td>{item.ulice}</td>
                  <td>{item.psc}</td>
                  <td>{item.ic}</td>
                  <td>{item.dic}</td>
                  <td>{item.formaDopravy.replace('code:', '')}</td>
                  <td>{item.formaUhradyCis.replace('code:', '')}</td>
                  <td>{item.stav}</td>
                  <td>{item.cisObj}</td>
                  <td>{item.nazevPolozky}</td>
                  <td>{item.sumCelkem},-{item.mena.replace('code:', '')}</td>
                  <td>{item.faktura}</td>
                  <td>
                  {item.typDokl === 'code:FAKTURA' && (
                    <button onClick={() => handleDownload(item.id)}>Download</button>
                  )}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            )}
          </div>
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={page === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>

    </div>
  );
}
export default App;
