var newrelic = require("newrelic");

module.exports = {
  initialize: function(api, next){
    api.newrelic = {
      middleware: function(data, next){
        if(data.connection.type === 'web'){
          // for now, the node newrelic agent only supports HTTP requests
          newrelic.setTransactionName(data.actionTemplate.name);
        }
        next();
      },

      errorReporter: function(err, type, name, objects, severity){
        newrelic.noticeError(err);
      }
    };

    next();
  },

  start: function(api, next){
    // load the newrelic middleware into actionhero
    api.actions.addMiddleware({
      name: 'NewRelic Middleware',
      global: true,
      priority: 1000,
      preProcessor: api.newrelic.middleware
    });
    // load the newrelic error reporter into actionhero
    api.exceptionHandlers.reporters.push( api.newrelic.errorReporter );
    // optional: ignore certain actions
    // newrelic.setIgnoreTransaction('actionName');
    next();
  }
};
