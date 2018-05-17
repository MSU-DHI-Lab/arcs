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
      'click .edit-prof-btn': 'editUser',
      'click #new-btn': 'newUser',
      'click #invite-btn': 'sendInvite'
    };

    Users.prototype.deleteUser = function(e) {
      var user;
      user = this.collection.get($(e.currentTarget).data('id'));
      return arcs.confirm("Are you sure you want to delete this user?", "<p id='delete-msg' class='dontDelete'>The account for <b class='dontDelete'>" + (user.get('name')) + "</b> will be deleted.</p>", (function(_this) {
        return function() {
          arcs.loader.show();
          return $.postJSON(arcs.baseURL + 'api/users/delete', user, function() {
              arcs.loader.hide();
              window.location.reload();
            return;// _this.collection.add(vals);
          });
        };
      })(this));
    };


    Users.prototype.editUser = function(e) {
      var user;
      user = this.collection.get($(e.currentTarget).data('id'));
      new arcs.views.Modal({
        title: 'Edit user',
        subtitle: null,
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
        subtitle: null,
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

    // Users.prototype.sendInvite = function() {
	// 	console.log('hi im here');
    //   return new arcs.views.Modal({
    //     title: 'Invite someone to ARCS',
    //     subtitle: "Provide an email address and we'll send them a link that will " + "allow them to create an account.",
    //     inputs: {
    //         name: {
    //           focused: true
    //         },
    //       email: {
    //         focused: true
    //       },
    //       role: {
    //         type: 'select',
    //         options: this.USER_ROLES
    //       }
    //     },
    //     buttons: {
    //       send: {
    //         "class": 'btn btn-success',
    //         callback: (function(_this) {
    //           return function(vals) {
    //             vals.email = $.trim(vals.email);
    //             //console.log(vals);
    //             return $.postJSON(arcs.baseURL + 'api/users/invite', vals, function() {
    //               return _this.collection.add(vals);
    //             });
    //           };
    //         })(this)
    //       },
    //       cancel: function() {}
    //     }
    //   });
    // };


    Users.prototype.render = function() {
      this.$('#users').html(arcs.tmpl('admin/users', {
        users: this.collection.toJSON()
      }));
      return this;
    };

    return Users;

  })(Backbone.View);

}).call(this);

function hideAll(t) {
	$('.admin-header-users p').css('opacity', '.3');
    $(t).css('opacity', '1');
	$('.all-users, .pending-users, .users-head, .admin-pagination, .create-user, .invite-user').css('display', 'none');
}

$(document).ready(function() {
    var remainingProjectsCreate = projectNames.slice();
    var remainingProjectsInvite = projectNames.slice();
    // var remainingProjectNames = projectNames.slice();

    $('.proj-select > option').each(function(){
        this.innerHTML = this.innerHTML.replace('_', ' ');

    });


    if($('#admin-users')[0]) {
        $('#projectSelect').css({
            'display' : 'block',
            'float' : 'right',
            'margin-top' : '195px',
            'margin-right' : '9%',
            'padding-right' : '20px',
            'cursor' : 'pointer',
            '-webkit-appearance' : 'none',
            'border' : 'none',
            'background' : '#fff',
            'font-size' : '16px',
            'text-transform' : 'capitalize'
        });
    }

    usersWrapWidth();
    $(window).on('resize', function() {
      usersWrapWidth();
    })

    $('.admin-header-users').on('click', function(e){
        if($('.allUsers').is(e.target)) {
			hideAll(e.target);

            $('.active-line').css({
                'width' : '97.09px' ,
                'left'  : 'calc(9% - 1px)'
            });
            $('.users-head').not('.pending').css('display', 'block');
            $('.all-users').css('display', 'block');
            $('.admin-pagination').css('display', 'block');

            $('.admin-pagination .ipp .drop .per').text('25 ITEMS PER PAGE');
            $('.admin-pagination .ipp .menu .curr').removeClass('curr');
            $('.admin-pagination .ipp .menu p').first().addClass('curr');
        } else if ($('.create').is(e.target)) {
			hideAll(e.target);
            $('.active-line').css({
                'width' : '73.13px' ,
                'left'  : 'calc(12.28% + 94.09px)'
            });
            $('.create-user').css('display', 'block');
        } else if ($('.invite').is(e.target)) {
			hideAll(e.target);
            $('.active-line').css({
                'width' : '59.34px' ,
                'left'  : 'calc(15.56% + 165.22px)'
            });
           $('.invite-user').css('display', 'block');
        } else if ($('.pending').is(e.target)) {
			hideAll(e.target);
            $('.active-line').css({
                'width' : '90px' ,
                'left'  : 'calc(18.84% + 222.56px)'
            });
			$('.pending').css('display', 'block');
            $('.pending-users').css('display', 'block');
            $('.admin-pagination').css('display', 'block');

            $('.admin-pagination .ipp .drop .per').text('25 ITEMS PER PAGE');
            $('.admin-pagination .ipp .menu .curr').removeClass('curr');
            $('.admin-pagination .ipp .menu p').first().addClass('curr');
        }

        usersWrapWidth();
    });

    $('#projectSelect').on('click', function(e) {
        if($('.admin-header-users span.chevron').hasClass('open')) {
            $('.admin-header-users span.chevron').removeClass('open');
        } else {
            $('.admin-header-users span.chevron').addClass('open');
        }
    })

	$('.users-head').on('click', function(e) {
		if($('.name').is(e.target)) {
			sortBy('a.name');
		} else if($('.username').is(e.target)) {
			sortBy('p.username');

		} else if($('.joined').is(e.target)) {
			sortBy('p.joined');
		} else if($('.select-all').is(e.target)) {
			if($('.bullet').length == $('.bullet.selected').length) {
				$('.bullet').removeClass('selected');
			} else {
				$('.bullet').addClass('selected');
			}
		}
	});

    $(document).on('click', function(e) {
        if($('.removePR').is(e.target)) {
            var formID = e.target.id;
            if (formID == 'createRemove') {
                var remainingProjectNames = remainingProjectsCreate;
            }
            else {
                var remainingProjectNames = remainingProjectsInvite;
            }
            var removedProject = $(e.target).closest('.pnr-single').find('.proj-select').find('option:selected').data('name');
            if (removedProject != 'Select a project') {
                // add the removed project back to the remaining project list
                if (remainingProjectNames.indexOf(removedProject) == -1) {
                    remainingProjectNames.push(removedProject);
                }
            }
            $(e.target).closest('.pnr-single').remove();
            //add an add another project button
            if (remainingProjectNames.length > 0) {
                $('.anotherPR').css('display', 'block');
            }
        } else if($('.bullet').is(e.target)){
            $dot = $(e.target);
            if($dot.hasClass('selected')){
                $dot.removeClass('selected');
            } else {
               $dot.addClass('selected');
            }
        } else if($('.anotherPR.create').is(e.target)){
            var remainingProjectNames = remainingProjectsCreate;
            var projectOptions = "";
            remainingProjectNames.forEach(function(pName){
                var displayName = pName.replace('_', ' ');
                projectOptions += "<option data-name="+pName+">"+displayName+"</option>";
            });
            $('.pnr-container.create').append(
                "<div class=\"pnr-single\">"+
                    "<label>Project "+
                        "<select class = \"proj-select\" name=\"project\">"+
                            "<option style='display:none;' selected>Select a project</option>"+
                             projectOptions+
                        "</select></label>"+
                    "<label>Role "+
                        "<select name=\"role\">"+
                            "<option style='display:none;' selected>Select a role</option>"+
                            "<option>Researcher</option>"+
                            "<option>Moderator</option>"+
                            "<option>Admin</option>"+
                        "</select></label>"+
                    "<p id='createRemove' class='removePR'>Remove This Project/Role</p><br>"+
                "</div>"
            );
			$('.anotherPR.create').css('display', 'none');
        } else if($('.anotherPR.invite').is(e.target)){
            var remainingProjectNames = remainingProjectsInvite;
            var projectOptions = "";
            remainingProjectNames.forEach(function(pName){
                var displayName = pName.replace('_', ' ');
                projectOptions += "<option data-name="+pName+">"+displayName+"</option>";
            });
            $('.pnr-container.invite').append(
                "<div class=\"pnr-single\">"+
                    "<label>Project "+
                        "<select class=\"proj-select\" name=\"project\">"+
                            "<option style='display:none;' selected>Select a project</option>"+
 							 projectOptions+
                        "</select></label>"+
                    "<label>Role "+
                        "<select name=\"role\">"+
                            "<option style='display:none;' selected>Select a role</option>"+
                            "<option>Researcher</option>"+
                            "<option>Moderator</option>"+
                            "<option>Admin</option>"+
                        "</select></label>"+
                    "<p id='inviteRemove' class='removePR'>Remove This Project/Role</p><br>"+
                "</div>"
            );
            $('.anotherPR.invite').css('display', 'none');
        } else if($('#projectSelect').is(e.target)){

        } else {
            $('.admin-header-users .open').removeClass('open');
        }
    })

	//hide the add another project until the first is chosen.
	$('.anotherPR').css('display', 'none');


    var previous = "";
    $('.create-user').on('focus', '.proj-select', function(e){
        previous = $(this).find('option:selected').data('name');
    }).change(function(e){
        if (projectNames.indexOf(previous) > -1 && remainingProjectsCreate.indexOf(previous) == -1) {
            remainingProjectsCreate.push(previous);
        }
		var selectedProject = $(e.target).find('option:selected').data('name');
		var index = remainingProjectsCreate.indexOf(selectedProject)
		if (index > -1) {
			//remove the selected project from the remaining project list
			remainingProjectsCreate.splice(index, 1);
		}
		//decide if an add another project button should display
		if (remainingProjectsCreate.length > 0) {
			$('.anotherPR').css('display', 'block');
		}else {
			$('.anotherPR').css('display', 'none');
		}
        $('.proj-select').blur();
	});

    var previous = "";
    $('.invite-user').on('focus', '.proj-select', function(e){
        previous = $(this).find('option:selected').data('name');
    }).change(function(e){
        if (projectNames.indexOf(previous) > -1 && remainingProjectsInvite.indexOf(previous) == -1) {
            remainingProjectsInvite.push(previous);
        }
		var selectedProject = $(e.target).find('option:selected').data('name');
		var index = remainingProjectsInvite.indexOf(selectedProject)
		if (index > -1) {
			//remove the selected project from the remaining project list
			remainingProjectsInvite.splice(index, 1);
		}
		//decide if an add another project button should display
		if (remainingProjectsInvite.length > 0) {
			$('.anotherPR').css('display', 'block');
		}else {
			$('.anotherPR').css('display', 'none');
		}
        $('.proj-select').blur();
	});


    $("[name='pw']").keyup(checkPasswordMatch);
    $("[name='rpw']").keyup(checkPasswordMatch);
    function checkPasswordMatch() {
        var password = $("[name='pw']").val();
        var confirmPassword = $("[name='rpw']").val();
        if (password.length < 6) {
            $(".matching-pw").html('Passwords must be at least 6 characters long');
            $(".matching-pw").css('color','red');
            return false;
        }
        if (password != confirmPassword){
            $(".matching-pw").html('Passwords do not match');
            $(".matching-pw").css('color','red');
            return false;
        }else{
            $(".matching-pw").html('Passwords match!');
            $(".matching-pw").css('color','green');
            return true;
        }
    }


    $('#create-user-submit').on('click', function(e){
        if (!checkPasswordMatch()) {
            return;
        }
		e.preventDefault();
        var formData = $('.create-user form').serializeArray();
        //adjusted data is formatted for the api to read it
        var adjustedData = {
            'form':{
				'firstname': '',
				'lastname': '',
				'user': '',
				'pass': '',
				'email': '',
                'projects': []
            }
        };

        var currentProjectInput = '';
        var formLength = formData.length;
        //push the form data into adjusted data and check for required fields
        for (var i = 0; i < formLength; i++) {
            var input = formData[i];
            if (input.name == 'fname') {
                if (input.value.trim() == '') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['firstname'] = input.value;
            }else if (input.name == 'lname') {
                if (input.value.trim() == '') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['lastname'] = input.value;
            }else if (input.name == 'uname') {
                if (input.value.trim() == '') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['user'] = input.value;
            }else if (input.name == 'email') {
                if (input.value.trim() == '') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['email'] = input.value;
            }else if (input.name == 'pw') {
                if (input.value.trim() == '') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['pass'] = input.value;
            }else if (input.name == 'project') {
                currentProjectInput = input.value.toLowerCase();
                if (currentProjectInput.toLowerCase() == 'select a project') {
                    currentProjectInput = "";
                    alert('Please enter all required fields.');
                    return;
                }
                currentProjectInput = currentProjectInput.replace(' ', '_');
            }else if (input.name == 'role' && currentProjectInput != "") {
                if (input.value.toLowerCase() == 'select a role') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['projects'].push({
                    'project': currentProjectInput,
                    'role': input.value
                });
            }
        }

		$.ajax({
			url: arcs.baseURL + 'api/users/add',
			type: "POST",
			data: adjustedData,
			success: function (res) {
				var image = document.getElementById('profileImageDrop').files[0];
				var username = res['status']['User']['username'];
				if (typeof(image) != 'undefined') {
					var data = new FormData();
					data.append('user_image', image);
					data.append('username', username);
					//upload the profile image after creating the account
					$.ajax({
						url: arcs.baseURL + 'api/users/upload',
						type: "POST",
						data: data,
						cache: false,
						processData: false,  // tell jQuery not to process the data
						contentType: false,  // tell jQuery not to set contentType
						success: function (res) {
							console.log('upload successful');
						}
					});
				}
				window.location.reload();
			}
		});
	});


	$('#invite-btn').on('click', function(e){
        e.preventDefault();
        var formData = $('.invite-user form').serializeArray();
        var adjustedData = {
            'form':{
				'name': '',
				'firstname': '',
				'lastname': '',
				'user': '',
				'pass': '',
				'email': '',
                'projects': []
            }
        };
        var currentProjectInput = '';
        var formLength = formData.length;
        //push the form data into adjusted data and check for required fields
        for (var i = 0; i < formLength; i++) {
            var input = formData[i];

            if (input.name == 'fname') {
                if (input.value.trim() == '') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['firstname'] = input.value;
            }else if (input.name == 'lname') {
                if (input.value.trim() == '') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['lastname'] = input.value;
            }else if (input.name == 'uname') {
                if (input.value.trim() == '') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['user'] = input.value;
            }else if (input.name == 'email') {
                if (input.value.trim() == '') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['email'] = input.value;
            }else if (input.name == 'project') {
                currentProjectInput = input.value.toLowerCase();
                if (currentProjectInput.toLowerCase() == 'select a project') {
                    currentProjectInput = "";
                    alert('Please enter all required fields.');
                    return;
                }
                currentProjectInput = currentProjectInput.replace(' ', '_');
            }else if (input.name == 'role') {
                if (input.value.toLowerCase() == 'select a role') {
                    alert('Please enter all required fields.');
                    return;
                }
                adjustedData['form']['projects'].push({
                    'project': currentProjectInput,
                    'role': input.value
                });
            }
        };
		adjustedData['form']['name'] = adjustedData['form']['firstname']+' '+adjustedData['form']['lastname'];

		$.ajax({
			url: arcs.baseURL + 'api/users/invite',
			type: "POST",
			data: adjustedData,
			success: function (res) {
				window.location.reload();
			}
		});
    });


	// display dropped image
	$('#profileImageDrop').on('change', function () {
  		var f = URL.createObjectURL(this.files[0]);
		$(this).attr('style', 'background:  url("'+f+'");'+
					 		  'border-color: #f9f9f9;'+
					 		  'opacity: .5;' );
		$(this).parent().find('label').attr('style', 'display: none;');
	});

    $('.accept').on('click', function(){
        var project = $('#projectSelect option[selected="selected"]').text();
        var userID = ($(this).data('id'));
        $.ajax({
            url: arcs.baseURL + 'admin/accept/'+userID,
            type: "POST",
            data: {'project':project},
            success: function () {
              window.location.reload();
            }
        });
    });

    $('#users').on('click', '.accept-sel', function(e){
        var length = $('.bullet.selected').length;
        var i = 0;
        $('.bullet.selected').each(function(){
            var userID = $(this).parent().find('#confirm-btn').data('id')
            $.ajax({
                url: arcs.baseURL + 'admin/accept/'+userID,
                type: "POST",
                success: function () {
                    i += 1;
                    if(i >= length){
                        window.location.reload();
                    }
                }
            });
        })
    })

    $('#users').on('click', '#delete-btn', function(e){
        setTimeout(function(){
            $('#modal').css('height', '380px');
            $('.modal-body').find('*').not('.dontDelete').remove();
        }, 1);
    })

    $('#users').on('click', '.decline-sel', function(e) {
        var length = $('.bullet.selected').length;
        var i = 0;
        $('.bullet.selected').each(function(){
            var userID = $(this).parent().find('#confirm-btn').data('id');
            $.ajax({
                url: arcs.baseURL + 'api/users/delete',
                data: {'id':userID},
                type: "POST",
                success: function () {
                    i += 1;
                    if(i >= length){
                        window.location.reload();
                    }
                }
            });
        })
    })

	$('.admin-search.users').keyup(function(e){
        search(this.value, 'p.name');
	})


});

function usersWrapWidth() {
  if($('.all-users').is(':visible') && $(window).innerWidth() < 602) {
    $('.admin-rows-wrap').css('width', 'fit-content');
  } else if($('.pending-users').is(':visible') && $(window).outerWidth() < 944) {
    $('.admin-rows-wrap').css('width', 'fit-content');
  } else {
    $('#users .admin-rows-wrap').css('width', 'unset');
  }

}
