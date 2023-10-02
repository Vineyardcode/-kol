import express from 'express';
import axios from 'axios';


const index = express();
const port = process.env.PORT || 3000;

const flexibeeConfig = axios.create({
  auth: {
    host: 'https://demo.flexibee.eu',
    firma: 'demo',
    username: 'winstrom',
    password: 'winstrom'
  }
});

index.get('/api/flexibee-json', async (req, res) => {
  try {
    const flexibeeURL = `${flexibeeConfig.host}/c/${flexibeeConfig.firma}/faktura-vydana.json`;

    const response = await axios.get(flexibeeURL, {
      auth: {
        username: flexibeeConfig.username,
        password: flexibeeConfig.password,
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
