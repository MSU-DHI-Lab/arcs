// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  arcs.collections.JobList = (function(_super) {

    __extends(JobList, _super);

    function JobList() {
      return JobList.__super__.constructor.apply(this, arguments);
    }

    JobList.prototype.model = arcs.models.Job;

    return JobList;

  })(Backbone.Collection);

}).call(this);
