import express from 'express';
import cors from 'cors';
import { getProfile, createProfile, updateProfile } from './api/profiles';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Profile routes
app.get('/api/profiles/:userId', getProfile);
app.post('/api/profiles', createProfile);
app.put('/api/profiles/:userId', updateProfile);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server running' });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});