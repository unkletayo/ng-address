import { createApp } from './app.js';

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Nigerian Address Reference API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/healthz`);
  console.log(`📍 States taxonomy: http://localhost:${PORT}/api/v1/taxonomy/states`);
});
