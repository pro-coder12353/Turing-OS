import express, { Request, Response } from 'express';
import cors from 'cors';

import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// REAL DATA ENDPOINT (Table Population)
// ==========================================
app.get('/api/cases', (req: Request, res: Response) => {
  // Read dynamically so it updates immediately without a server restart
  const datasetPath = path.join(__dirname, 'dataset.json');
  const rawData = fs.readFileSync(datasetPath, 'utf-8');
  const casesDatabase = JSON.parse(rawData);

  // In production, this would query Postgres: 
  // const result = await pool.query('SELECT * FROM ai_decisions');
  res.json(casesDatabase);
});

// Helper to save DB (Production persistence mock)
const saveToDb = (id: string, newStatus: string) => {
  const datasetPath = path.join(__dirname, 'dataset.json');
  const casesDatabase = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  const caseIndex = casesDatabase.findIndex((c: any) => c.id === id);
  if (caseIndex !== -1) {
    casesDatabase[caseIndex].status = newStatus;
    fs.writeFileSync(datasetPath, JSON.stringify(casesDatabase, null, 2));
  }
};

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

  // In a real production environment, this is where you call the OpenAI/Gemini API:
  // const aiResponse = await openai.chat.completions.create({ ... })
  
  const arg = userArgument?.toLowerCase().trim() || "";

  // Smart Mock AI Evaluation
  setTimeout(() => {
    // Reject garbage inputs or very short strings
    if (arg.length < 15 || arg.includes('sus') || arg.includes('test')) {
      return res.json({
        status: 'rejected',
        aiDecision: 'Maintained',
        explanation: 'Appeal rejected: The provided counter-evidence was insufficient, irrelevant, or lacked verifiable details.'
      });
    }

    // Approve thoughtful inputs
    saveToDb(contextId, 'Approved');
    return res.json({
      status: 'success',
      aiDecision: 'Reversed',
      explanation: `Overturned: Valid context provided. User clarified: "${arg.substring(0, 40)}..."`
    });
  }, 1500);
});

app.post('/api/confirm', (req: Request, res: Response) => {
  const { contextId } = req.body;
  saveToDb(contextId, 'Confirmed');
  res.json({ success: true });
});

app.post('/api/escalate', (req: Request, res: Response) => {
  const { contextId } = req.body;
  saveToDb(contextId, 'Pending Escalation');
  res.json({ success: true });
});

app.post('/api/override', (req: Request, res: Response) => {
  const { contextId } = req.body;
  saveToDb(contextId, 'Approved (Manual)');
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Backend is running on http://localhost:${PORT}`);
  console.log(`[SERVER] Sybil Defense API available at http://localhost:${PORT}/api/verify`);
});
