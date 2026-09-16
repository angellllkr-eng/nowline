import express from 'express';

const app = express();
app.use(express.json({ limit: '32kb' }));
let blocked = process.env.LAUNCH_BLOCKED === 'true';

app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'orchestrator', launch_blocked: blocked }));
app.post('/orchestrator/command', (req, res) => {
  const { action, scope = 'all', actor = 'unknown' } = req.body || {};
  if (action === 'emergency_stop') {
    blocked = true;
    console.log(JSON.stringify({ actor, action, scope, timestamp: new Date().toISOString(), launch_blocked: true }));
    return res.status(202).json({ accepted: true, action, scope, launch_blocked: true });
  }
  if (action === 'resume') return res.status(403).json({ error: 'founder_override_required' });
  return res.status(400).json({ error: 'unsupported_command' });
});

app.listen(Number(process.env.PORT || 8080), () => console.log('orchestrator listening'));
