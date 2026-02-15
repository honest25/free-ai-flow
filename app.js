const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const app = express();
app.use(express.json());

const PROJECT_ID = process.env.PROJECT_ID;
const LOCATION = process.env.LOCATION || 'us-central1';
const MODEL_ID = process.env.MODEL_ID || 'veo-3.1-generate-001';
const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

async function getAccessToken() {
  const client = new OAuth2Client();
  client.credentials = GOOGLE_APPLICATION_CREDENTIALS;
  const token = await client.getAccessToken();
  return token.token;
}

app.post('/generate-video', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).send('Prompt required');

  try {
    const token = await getAccessToken();
    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predictLongRunning`;
    
    const response = await axios.post(url, {
      instances: [{ prompt }],
      parameters: { storageUri: 'gs://your-bucket/output/' } // Replace with your GCS bucket
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
