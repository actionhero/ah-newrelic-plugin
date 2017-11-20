## ActionHero Transactions for New Relic

## Notes
- install `npm install --save ah-newrelic-plugin`
- add `{'ah-newrelic-plugin': { path: __dirname + '/../node_modules/ah-newrelic-plugin' }` to your `config/plugins.js`
- be sure to enable the plugin within actionhero using ENV variables (https://github.com/newrelic/node-newrelic#configuring-the-module)
- you will need to add the newrelic package (`npm install newrelic --save`) to your package.json
