// Generated by CoffeeScript 1.10.0
(function() {
  var base,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  if ((base = arcs.views).admin == null) {
    base.admin = {};
  }

  arcs.views.admin.Users = (function(superClass) {
    extend(Users, superClass);

    function Users() {
      return Users.__super__.constructor.apply(this, arguments);
    }

    Users.prototype.USER_ROLES = {
      'Researcher': 'Reseacher',
      'Moderator': 'Moderator',
      'Admin': 'Admin'
    };

    Users.prototype.initialize = function(options) {
      _.extend(this.options, _.pick(options, 'el', 'collection'));
      this.collection.on('add remove change sync', this.render, this);
      return this.render();
    };

    Users.prototype.events = {
      'click #delete-btn': 'deleteUser',
      'click #edit-btn': 'editUser',
      'click #new-btn': 'newUser',
      'click #invite-btn': 'sendInvite'
    };

    Users.prototype.deleteUser = function(e) {
      var user;
      user = this.collection.get($(e.currentTarget).data('id'));
      console.log(user);
      return arcs.confirm("Are you sure you want to delete this user?", "The account for <b>" + (user.get('name')) + "</b> will be deleted.", (function(_this) {
        return function() {
          arcs.loader.show();
          return user.destroy({
            success: arcs.loader.hide
          });
        };
      })(this));
    };

    Users.prototype.editUser = function(e) {
      var user;
      user = this.collection.get($(e.currentTarget).data('id'));
      console.log(this.collection);
      new arcs.views.Modal({
        title: 'Edit user',
        inputs: {
          name: {
            value: user.get('name')
          },
          username: {
            value: user.get('username')
          },
          email: {
            value: user.get('email')
          },
          role: {
            type: 'select',
            options: this.USER_ROLES
          },
          password: {
            type: 'password'
          }
        },
        buttons: {
          save: {
              validate: true,
              "class": 'btn btn-success',
              callback: (function (_this) {
                  return function (vals) {
                                    vals['adminapi'] = true;
                                    vals['id'] = user['id'];
                                    console.log(vals);
                      if (vals.password === '') {
                          delete vals.password;
                      }

                      arcs.loader.show();
                      $.ajax({
                          url: arcs.baseURL + 'user/edit/'+user['id'],
                          type: "POST",
                          data: vals,
                          success: function () {
                             window.location.reload();
                          }
                      });


                  };
              })(this)
          },
            cancel: function () {
            }
         }
      });
      return $('#modal-role-input').val(user.get('role'));
    };

    Users.prototype.newUser = function() {
      return new arcs.views.Modal({
        title: 'Create a new user',
        inputs: {
          name: {
            focused: true
          },
          username: true,
          email: true,
          password: {
            type: 'password'
          },
          role: {
            type: 'select',
            options: this.USER_ROLES
          }
        },
        buttons: {
          save: {
            "class": 'btn btn-success',
            callback: (function(_this) {
              return function(vals) {
                var user;
                user = new arcs.models.User(vals);
                arcs.loader.show();
                return user.save({}, {
                  success: function(m, r) {
                    user.id = r.id;
                    arcs.loader.hide();
                    return _this.collection.add(user);
                  }
                });
              };
            })(this)
          },
          cancel: function() {}
        }
      });
    };

    Users.prototype.sendInvite = function() {
      return new arcs.views.Modal({
        title: 'Invite someone to ARCS',
        subtitle: "Provide an email address and we'll send them a link that will " + "allow them to create an account.",
        inputs: {
          email: {
            focused: true
          },
          role: {
            type: 'select',
            options: this.USER_ROLES
          }
        },
        buttons: {
          send: {
            "class": 'btn btn-success',
            callback: (function(_this) {
              return function(vals) {
                vals.email = $.trim(vals.email);
                return $.postJSON(arcs.baseURL + 'users/invite', vals, function() {
                  return _this.collection.add(vals);
                });
              };
            })(this)
          },
          cancel: function() {}
        }
      });
    };

    Users.prototype.render = function() {
      this.$('#users').html(arcs.tmpl('admin/users', {
        users: this.collection.toJSON()
      }));
      return this;
    };

    return Users;

  })(Backbone.View);

}).call(this);
