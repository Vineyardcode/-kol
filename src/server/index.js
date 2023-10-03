import express from 'express';
import axios from 'axios';
import cors from 'cors';

const index = express();
const port = process.env.PORT || 3000;

const config = {
  host: 'https://demo.flexibee.eu',
  firma: 'demo',
  username: 'winstrom',
  password: 'winstrom'
};

index.use(
  cors({
    origin: 'http://localhost:5173',
    methods: 'GET',
  })
);

index.get('/download/:id.pdf', async (req, res) => {
  try {
    const itemId = req.params.id;
    const url = `${config.host}/c/${config.firma}/faktura-vydana/${itemId}.pdf`;
    const response = await axios.get(url, {
      auth: {
        username: config.username,
        password: config.password,
      },
      responseType: 'arraybuffer',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${itemId}.pdf"`);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating data.' });
  }
});

index.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const url = `${config.host}/c/${config.firma}/faktura-vydana.json?detail=full&start=0&q=${searchQuery}`;
    const response = await axios.get(url, {
      auth: {
        username: config.username,
        password: config.password,
      },
    });
    const jsonData = response.data;
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

index.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
