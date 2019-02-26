var newrelic = require('newrelic')

const { Initializer, api } = require('actionhero')

module.exports = class NewRelicInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'newrelic'
    this.loadPriority = 1000
    this.startPriority = 1
    this.stopPriority = 2000
  }

  start () {
    // load the newrelic action middleware into actionhero
    api.actions.addMiddleware({
      name: 'NewRelic Action Middleware',
      global: true,
      priority: 1,
      preProcessor: (data) => {
        if (data.connection.type === 'web') {
          // for now, the node newrelic agent only supports HTTP requests
          newrelic.setTransactionName(data.actionTemplate.name)
          newrelic.addCustomAttributes(data.params)
        }
      }
    })

    api.tasks.addMiddleware({
      name: 'NewRelic Task Middleware',
      global: true,
      priority: 1,
      // using old ES5 syntax for the correct context of 'this' for the resque worker
      preProcessor: function () {
        let worker = this.worker
        newrelic.startBackgroundTransaction(worker.job.class)
      },

      postProcessor: () => {
        newrelic.endTransaction()
      }
    })

    // load the newrelic error reporter into actionhero
    api.exceptionHandlers.reporters.push((error) => {
      newrelic.noticeError(error)
    })

  // optional: ignore certain actions
  // newrelic.setIgnoreTransaction('actionName')
  }
}
