import { app } from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🚀 ProntoPaga Score API iniciada exitosamente`);
  console.log(`📡 Puerto: ${config.port}`);
  console.log(`🌍 Ambiente: ${config.nodeEnv}`);
  console.log(`🔗 Health: http://localhost:${config.port}/health`);
  console.log(`🔐 Login:  POST http://localhost:${config.port}/login`);
  console.log(`📊 Score:  GET  http://localhost:${config.port}/score/:rut`);
  console.log(`=========================================`);
});

// Manejo de cierre elegante
process.on('SIGTERM', () => {
  console.log('Recibida señal SIGTERM, cerrando servidor HTTP...');
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recibida señal SIGINT (Ctrl+C), cerrando servidor HTTP...');
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
    process.exit(0);
  });
});
