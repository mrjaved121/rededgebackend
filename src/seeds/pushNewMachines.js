// One-off, non-destructive push of new machines to a running Red Edge backend.
// Only creates/updates the two records below via the same admin API the app uses —
// unlike seed.js, this never deletes existing users, jobs, or checklists.
//
// Usage:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword node src/seeds/pushNewMachines.js
// Optional:
//   API_BASE=https://jellyfish-app-fs8p4.ondigitalocean.app/api/v1 (default: prod)

const { dozerBladeMountSteps, drillRigPilingSteps } = require('./newMachineTemplates');

const API_BASE = process.env.API_BASE || 'https://jellyfish-app-fs8p4.ondigitalocean.app/api/v1';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const machines = [
  { systemType: 'Dozer Blade Mount', name: 'Dozer Blade Mount', steps: dozerBladeMountSteps },
  { systemType: 'Drill Rig / Piling Machine', name: 'Drill Rig / Piling Machine', steps: drillRigPilingSteps },
];

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('ERROR: Set ADMIN_EMAIL and ADMIN_PASSWORD env vars before running.');
    process.exit(1);
  }

  console.log(`Target API: ${API_BASE}`);

  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error('Login failed:', loginData.error || loginRes.status);
    process.exit(1);
  }
  if (loginData.user.role !== 'admin') {
    console.error('This account is not an admin — aborting.');
    process.exit(1);
  }
  const token = loginData.token;
  console.log(`Logged in as ${loginData.user.email}`);

  for (const machine of machines) {
    // Create the system type (skip if it already exists)
    const stRes = await fetch(`${API_BASE}/system-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: machine.systemType }),
    });
    if (stRes.ok) {
      console.log(`Created system type "${machine.systemType}"`);
    } else if (stRes.status === 409) {
      console.log(`System type "${machine.systemType}" already exists — leaving as is`);
    } else {
      const err = await stRes.json();
      console.error(`Failed to create system type "${machine.systemType}":`, err.error || stRes.status);
      continue;
    }

    // Upsert the checklist template (creates new, or would overwrite if it already existed)
    const ctRes = await fetch(`${API_BASE}/checklists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ systemType: machine.systemType, name: machine.name, steps: machine.steps }),
    });
    if (ctRes.ok) {
      console.log(`Created checklist template "${machine.name}" (${machine.steps.length} steps)`);
    } else {
      const err = await ctRes.json();
      console.error(`Failed to create checklist template "${machine.name}":`, err.error || ctRes.status);
    }
  }

  console.log('\nDone. Nothing existing was deleted or modified.');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
