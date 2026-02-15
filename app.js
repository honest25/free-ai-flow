const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Mock database to simulate AI responses
const workflows = {};

// Simulate AI workflow generation endpoint
app.post('/generate-workflow', (req, res) => {
  const { prompt, type } = req.body;
  if (!prompt || !type) return res.status(400).send('Prompt and type required');

  const workflowId = uuidv4();
  const mockResultUrl = `https://example.com/${type}-output/${workflowId}.json`;

  workflows[workflowId] = {
    prompt,
    type,
    url: mockResultUrl,
    status: 'processing'
  };

  // Simulate async processing (5 seconds)
  setTimeout(() => {
    workflows[workflowId].status = 'ready';
  }, 5000);

  res.json({
    workflowId,
    status: 'processing',
    message: `${type} workflow generation started`,
    url: mockResultUrl
  });
});

// Check workflow status
app.get('/workflow-status/:id', (req, res) => {
  const workflow = workflows[req.params.id];
  if (!workflow) return res.status(404).send('Workflow not found');
  res.json(workflow);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Free AI Flow API running on port ${PORT}`));
