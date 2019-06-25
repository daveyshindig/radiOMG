/* global
  AccountsTemplates: false,
  FlowRouter: false
*/
'use strict';
var FlowRouter = (Package['ostrio:flow-router-extra'] ||
  Package['kadira:flow-router']).FlowRouter;
AccountsTemplates.atInputRendered.push(function(){
  var fieldId = this.data._id;
  var queryKey = this.data.options && this.data.options.queryKey || fieldId;
  var inputQueryVal = FlowRouter.getQueryParam(queryKey);
  if (inputQueryVal) {
    this.$("input#at-field-" + fieldId).val(inputQueryVal);
  }
});