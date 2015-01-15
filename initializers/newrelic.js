var newrelic = require("newrelic");

module.exports = {
  initialize: function(api, next){
    api.newrelic = {
      middleware: function(connection, actionTemplate, next){
        if(connection.type === 'web'){
          // for now, the node newrelic agent only supports HTTP requests
          newrelic.setTransactionName(actionTemplate.name);
        }
        next(connection, true);
      },

      errorReporter: function(type, err, extraMessages, severity){
        newrelic.noticeError(err);
      }
    };
  },

  start: function(api, next){
    // load the newrelic middleware into actionhero
    api.actions.addPreProcessor( api.newrelic.middleware );
    // load the newrelic error reporter into actionhero
    api.exceptionHandlers.reporters.push( api.newrelic.errorReporter );
    // optional: ignore certain actions
    // newrelic.setIgnoreTransaction('actionName');
    next();
  }
};