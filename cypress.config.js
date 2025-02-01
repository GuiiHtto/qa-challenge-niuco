const { defineConfig } = require("cypress");
const { exec } = require('child_process');

module.exports = defineConfig({
  projectId: 'skqidb',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('after:run', (results) => {
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