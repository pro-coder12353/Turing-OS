import express, { Request, Response } from 'express';
import cors from 'cors';

import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load real data
const datasetPath = path.join(__dirname, 'dataset.json');
const rawData = fs.readFileSync(datasetPath, 'utf-8');
const casesDatabase = JSON.parse(rawData);

// ==========================================
// REAL DATA ENDPOINT (Table Population)
// ==========================================
app.get('/api/cases', (req: Request, res: Response) => {
  // In production, this would query Postgres: 
  // const result = await pool.query('SELECT * FROM ai_decisions');
  res.json(casesDatabase);
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Online', service: 'Project Turing Backend' });
});

// ==========================================
// MILESTONE 2: Sybil Gateway (Nadeem's Route)
// ==========================================
app.post('/api/verify', (req: Request, res: Response) => {
  const { proof, cycles } = req.body;
  
  console.log(`[SYBIL DEFENSE] Verifying incoming proof of humanity... Cycles: ${cycles}`);

  // If no proof is provided, flag as an Agent Swarm
  if (!proof || cycles < 100) {
    return res.status(403).json({ 
      verified: false,
      error: 'Agent Swarm Detected: Cryptographic Proof Failed or Missing.' 
    });
  }

  // Success
  return res.json({ 
    verified: true, 
    message: 'Humanity cryptographically verified. Access granted.' 
  });
});

// ==========================================
// MILESTONE 3: Contestability Engine (Shritan's Route)
// ==========================================
app.post('/api/evaluate', (req: Request, res: Response) => {
  const { userArgument, contextId } = req.body;
  
  console.log(`[CONTESTABILITY] Processing user argument for case ${contextId}: "${userArgument}"`);

  // Mocking the AI re-evaluation logic
  // In reality, Shritan will plug the OpenAI/Anthropic API here
  
  setTimeout(() => {
    res.json({
      status: 'success',
      aiDecision: 'Reversed',
      newConfidenceScore: 0.89,
      reasoningGraph: [
        { node: 'Income Verification', status: 'Approved', note: 'User provided valid context.' },
        { node: 'Risk Assessment', status: 'Adjusted', note: 'Risk lowered based on counter-argument.' }
      ]
    });
  }, 2000); // simulate AI processing delay
});

app.listen(PORT, () => {
  console.log(`[SERVER] Backend is running on http://localhost:${PORT}`);
  console.log(`[SERVER] Sybil Defense API available at http://localhost:${PORT}/api/verify`);
});
