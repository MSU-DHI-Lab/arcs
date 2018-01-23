// Generated by CoffeeScript 1.10.0
(function() {
  var base,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  if ((base = arcs.views).admin == null) {
    base.admin = {};
  }

  arcs.views.admin.Flags = (function(superClass) {
    extend(Flags, superClass);

    function Flags() {
      return Flags.__super__.constructor.apply(this, arguments);
    }

    Flags.prototype.initialize = function(options) {
      _.extend(this.options, _.pick(options, 'el', 'collection'));
      this.collection.on('add remove change sync', this.render, this);
      return this.render();
    };

    Flags.prototype.render = function() {
      this.$('#flags').html(arcs.tmpl('admin/flags', {
        flags: this.collection.toJSON()
      }));
      return this;
    };

    return Flags;

  })(Backbone.View);

}).call(this);

$(document).ready(function() {
    $('#flags').on('click', '.delete-flag-btn', function(e){
        var flagID = ($(this).data('id'));
        $.ajax({
            url: arcs.baseURL + 'admin/editFlags',
            type: "POST",
            data:  {
              status: 'delete',
              flagID: flagID,
              api: true
            },
            success: function (data) {
                location.reload();
            }
        });
    });

    $('#flags').on('click', '.edit-flag-btn', function(e){
        var oldSelect = $('.flag-select');
        if( $(oldSelect).length > 0 ){
          $(oldSelect).parent().html($(oldSelect).attr('data-current'));
          $('.edit-flag-btn').html('Edit');
          $('.save-flag-btn').removeClass('save-flag-btn').addClass('edit-flag-btn').html('Edit');
        }
        var statusBox = $(this).parent().prevAll('.flag-status');
        var currentStatus = $(statusBox).html();
        var select =
            "<div class=\"styled-select flag-select\" data-current='"+currentStatus+"'>"+
            "<select>"+
                "<option class='unresolved' value=\"unresolved\">unresolved</option>"+
                "<option class='resolved' value=\"resolved\">resolved</option>"+
                "<option class='pending' value=\"pending\">pending</option>"+
            "</select>"+
            "<span></span>"+
            "</div>";
        $(statusBox).html(select);
        $('.'+currentStatus).attr('selected', 'selected');
        $(this).html('Submit');
        $(this).removeClass('edit-flag-btn').addClass('save-flag-btn');
    });

    $('#flags').on('click', '.save-flag-btn', function(e){
        var statusBox = $(this).parent().prevAll('.flag-status');
        var updateTo = $(statusBox).find(" :selected").text();
        var flagID = $(this).attr('data-id');
        $.ajax({
            url: arcs.baseURL + 'admin/editFlags',
            type: "POST",
            data:  {
              status: 'edit',
              flagID: flagID,
              api: true,
              updateTo: updateTo
            },
            success: function (data) {
                location.reload();
            }
        });
    });


});
