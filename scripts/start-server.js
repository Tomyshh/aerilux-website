const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

/**
 * Vérifie si un port est disponible
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Trouve un port disponible en commençant par startPort
 */
async function findAvailablePort(startPort = 3000, maxPort = 3010) {
  for (let port = startPort; port <= maxPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  // Si aucun port n'est trouvé dans la plage, utiliser le port par défaut et laisser react-scripts gérer l'erreur
  return startPort;
}

/**
 * Démarre le serveur React
 */
async function startServer() {
  const port = await findAvailablePort(3000, 3010);
  
  console.log(`Démarrage du serveur sur le port ${port}...`);
  
  const env = {
    ...process.env,
    PORT: port.toString(),
    ESLINT_NO_DEV_ERRORS: 'true',
  };
  
  // Utiliser directement react-scripts depuis node_modules pour éviter les conflits npx
  const reactScriptsPath = path.join(__dirname, '..', 'node_modules', '.bin', 'react-scripts');
  
  const reactScripts = spawn(reactScriptsPath, ['start'], {
    env,
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..'),
  });
  
  reactScripts.on('error', (error) => {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  });
  
  process.on('SIGINT', () => {
    reactScripts.kill();
    process.exit();
  });
}

startServer().catch((error) => {
  console.error('Erreur:', error);
  process.exit(1);
});
