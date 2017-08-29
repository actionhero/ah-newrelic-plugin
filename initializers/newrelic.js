var newrelic = require('newrelic')

module.exports = {
  startPriority: 1,

  start: function (api, next) {
    // load the newrelic action middleware into actionhero
    api.actions.addMiddleware({
      name: 'NewRelic Action Middleware',
      global: true,
      priority: 1,
      preProcessor: (data, next) => {
        if (data.connection.type === 'web') {
          // for now, the node newrelic agent only supports HTTP requests
          newrelic.setTransactionName(data.actionTemplate.name)
          newrelic.addCustomParameters(data.params)
        }
        next()
      }
    })

    api.tasks.addMiddleware({
      name: 'NewRelic Task Middleware',
      global: true,
      priority: 1,
      // using old ES5 syntax for the correct context of 'this' for the resque worker
      preProcessor: function(next) {
        let worker = this.worker
        newrelic.startBackgroundTransaction(worker.job.class)
        next()
      },

      postProcessor: (next) => {
        newrelic.endTransaction()
        next()
      }
    })

    // load the newrelic error reporter into actionhero
    api.exceptionHandlers.reporters.push((error) => {
      newrelic.noticeError(error)
    })

    // optional: ignore certain actions
    // newrelic.setIgnoreTransaction('actionName');
    next()
  }
}
