// Generated by CoffeeScript 1.10.0
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  arcs.views.CollectionList = (function(superClass) {
    extend(CollectionList, superClass);

    function CollectionList() {
      return CollectionList.__super__.constructor.apply(this, arguments);
    }

    CollectionList.prototype.initialize = function(options) {
      _.extend(this.options, _.pick(options, 'model', 'collection', 'el'));
      this.search = new arcs.utils.Search({
        container: $('.search-wrapper'),
        run: false,
        onSearch: (function(_this) {
          return function() {
            return location.href = arcs.url('search', _this.search.query);
          };
        })(this)
      });
      this.render();
      return this.$('details.open').each((function(_this) {
        return function(i, el) {
          return _this.renderDetails($(el));
        };
      })(this));
    };

    CollectionList.prototype.events = {
      'click summary': 'onClick',
      'click details.closed': 'onClick',
      'click #delete-btn': 'deleteCollection',
      'click .btn-show-all': 'onClick'
    };

    CollectionList.prototype.onClick = function(e) {
      var $el, limit, ref;
      console.log("Clicked here.");
      console.log(e.currentTarget.tagName);
      if (e.currentTarget.tagName === 'DETAILS') {
        $el = $(e.currentTarget);
        limit = 1;
        $el.toggleAttr('open');
        $el.toggleClass('closed').toggleClass('open');
      } else if (e.currentTarget.className === 'btn-show-all') {
        $el = $(e.currentTarget).parent().parent().parent().parent();
        $(e.currentTarget).parent().hide();
        limit = 0;
      } else {
        $el = $(e.currentTarget).parent();
        limit = 1;
        $el.toggleAttr('open');
        $el.toggleClass('closed').toggleClass('open');
      }
      console.log($el);
      this.renderDetails($el, limit);
      if (((ref = e.srcElement.tagName) !== 'SPAN' && ref !== 'BUTTON' && ref !== 'I' && ref !== 'A')) {
        e.preventDefault();
        return false;
      }
    };

    CollectionList.prototype.deleteCollection = function(e) {
      var $parent, id, model;
      e.preventDefault();
      $parent = $(e.currentTarget).parents('details');
      id = $parent.data('id');
      model = this.collection.get(id);
      return arcs.confirm("Are you sure you want to delete this collection?", ("<p>Collection <b>" + (model.get('title')) + "</b> will be ") + "deleted. <p><b>N.B.</b> Resources within the collection will not be " + "deleted. They may still be accessed from other collections to which they " + "belong.", (function(_this) {
        return function() {
          arcs.loader.show();
          return $.ajax({
            url: arcs.url('collections', 'delete', model.id),
            type: 'DELETE',
            success: function() {
              _this.collection.remove(model, {
                silent: true
              });
              _this.render();
              return arcs.loader.hide();
            }
          });
        };
      })(this));
    };

    CollectionList.prototype.render = function() {
      console.log(this.$el);
      console.log("Josh Test Here1");
      this.$el.html(arcs.tmpl('collections/list', {
        collections: this.collection.toJSON()
      }));
      return this;
    };

    CollectionList.prototype.renderDetails = function($el, limit) {
      var id, query, query2;
      id = $el.data('id');
      query = encodeURIComponent('collection_id:"' + id + '"');
      query2 = arcs.baseURL + "resources/search?";
      if (limit !== 0) {
        query2 += "n=15&";
      }
      return $.getJSON(query2 + ("q=" + query), function(response) {
        return $el.children('.results').html(arcs.tmpl('home/details', {
          resources: response.results,
          searchURL: arcs.baseURL + ("collection/" + id)
        }));
      });
    };

    return CollectionList;

  })(Backbone.View);

}).call(this);
