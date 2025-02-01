const { defineConfig } = require('cypress');
const { exec } = require('child_process');
const path = require('path');

// Função para gerar um timestamp
function getTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
}

// Diretórios com timestamp
const timestamp = getTimestamp();
const screenshotsFolder = `cypress/screenshots/${timestamp}`;
const videosFolder = `cypress/videos/${timestamp}`;

module.exports = defineConfig({
  projectId: 'skqidb',
  video: true,
  screenshotsFolder,
  videosFolder,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('after:run', (results) => {
        exec('echo "Test run completed"');
        
        if (results.totalFailed === 0) {
          exec('git checkout main && git pull && npm run test', (err, stdout, stderr) => {
            if (err) {
              console.error(`exec error: ${err}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });
        }
      });
    },
  },
});