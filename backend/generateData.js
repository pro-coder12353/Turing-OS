const fs = require('fs');
const path = require('path');

const firstNames = ['Ahmed', 'Sarah', 'Tariq', 'Fatima', 'Omar', 'Mohammed', 'Ayesha', 'John', 'Emma', 'Khalid', 'Ali', 'Zayed', 'Layla', 'Mahmoud', 'David', 'Sophia', 'Yousef', 'Mariam', 'Hassan', 'Zainab'];
const lastNames = ['Al Mansoori', 'Jenkins', 'Mahmood', 'Al Hashimi', 'Abdullah', 'Al Qassimi', 'Smith', 'Chen', 'Al Futtaim', 'Khan', 'Patel', 'Al Suwaidi', 'Al Nuaimi', 'Al Shamsi', 'Garcia', 'Lee'];
const types = ['Mortgage Loan', 'Auto Loan', 'Personal Credit', 'Small Business', 'Corporate Line'];
const statuses = ['Denied', 'Flagged', 'Shadowbanned', 'Pending'];
const purposes = ['First-time home buyer', 'Electric Vehicle Financing', 'Unsecured Credit Line', 'Equipment Expansion', 'Refinance (Secondary Home)', 'Debt Consolidation', 'Working Capital', 'Commercial Real Estate'];
const reasons = [
  'Application address matches high-risk commercial zone instead of residential.',
  'Employment history gap detected in provided W-2 data.',
  'Synthetic identity patterns matched against global threat network.',
  'Revenue projections fall below algorithmic safety threshold for sector.',
  'Debt-to-income ratio fluctuates abnormally in cross-referenced accounts.',
  'High frequency of recent credit inquiries across GCC banks.',
  'KYC documentation flagged by optical character recognition (OCR) mismatch.',
  'Transaction history indicates unverified overseas transfers.'
];

const data = [];
for(let i = 1; i <= 85; i++) {
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const amount = `AED ${(Math.floor(Math.random() * 900) * 1000 + 15000).toLocaleString()}`;
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  data.push({
    id: `REQ-${1000 + i}`,
    applicant: name,
    amount: amount,
    purpose: purposes[Math.floor(Math.random() * purposes.length)],
    date: `Oct ${Math.floor(Math.random() * 28) + 1}, 2026`,
    type: types[Math.floor(Math.random() * types.length)],
    status: status,
    ai_confidence: Math.floor(Math.random() * 20) + 75,
    risk_score: Math.floor(Math.random() * 40) + 50,
    reason: reasons[Math.floor(Math.random() * reasons.length)]
  });
}

data.unshift(
  {
    "id": "REQ-842",
    "applicant": "Michael Chen",
    "amount": "AED 450,000",
    "purpose": "First-time home buyer (Primary Residence)",
    "date": "Oct 24, 2026",
    "type": "Mortgage Loan",
    "status": "Denied",
    "ai_confidence": 92,
    "risk_score": 85,
    "reason": "Application address matches high-risk commercial zone instead of residential."
  },
  {
    "id": "REQ-901",
    "applicant": "Sarah Jenkins",
    "amount": "AED 135,000",
    "purpose": "Electric Vehicle Financing",
    "date": "Oct 24, 2026",
    "type": "Auto Loan",
    "status": "Flagged",
    "ai_confidence": 88,
    "risk_score": 65,
    "reason": "Employment history gap detected in provided W-2 data."
  }
);

fs.writeFileSync(path.join(__dirname, 'src', 'dataset.json'), JSON.stringify(data, null, 2));
console.log('Generated 87 records with AED formatting into dataset.json');
