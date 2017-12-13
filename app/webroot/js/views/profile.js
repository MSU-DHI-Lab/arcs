// Generated by CoffeeScript 1.10.0
(function () {
    var extend = function (child, parent) {
        for (var key in parent) {
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    },
    hasProp = {}.hasOwnProperty;

    arcs.views.Profile = (function (superClass) {
        extend(Profile, superClass);

        function Profile() {
            return Profile.__super__.constructor.apply(this, arguments);
        }

        Profile.prototype.initialize = function (options) {
            _.extend(this.options, _.pick(options, 'model', 'collection', 'el'));
            this.search = new arcs.utils.Search({
                container: $('.search-wrapper'),
                run: false,
                onSearch: (function (_this) {
                    return function () {
                        return location.href = arcs.url('search', _this.search.query);
                    };
                })(this)
            });
            return this.$('details.open').each((function (_this) {
                return function (i, el) {
                    return _this.renderDetails($(el));
                };
            })(this));
        };

        Profile.prototype.events = {
            'click #edit-profile': 'editAccount',
            'click summary': 'onClick',
            'click details.closed': 'onClick',
            'click #delete-btn': 'deleteCollection',
            'click .btn-show-all': 'onClick',
            'change #newProfImg': 'fileSelect'
        };

        Profile.prototype.editAccount = function () {
            // return new arcs.views.Modal({
            var profileModal = new arcs.views.Modal({
                title: 'Edit Your Account',
                subtitle: "If you'd like your password to stay the same, leave the " + "password field blank.",
                inputs: {
                    name: {
                        value: this.model.get('name')
                    },
                    username: {
                        value: this.model.get('username')
                    },
                    email: {
                        value: this.model.get('email')
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
                                if (vals.password === '') {
                                    delete vals.password;
                                }
                                arcs.loader.show();

                                _this.model.save(vals, {
                                    success: function (model, response, options) {
                                        arcs.loader.hide();
                                        // window.location = arcs.baseURL + 'user/' + vals['username'];
                                    },
                                    error: function (model, response, options) {
                                        arcs.loader.hide();
                                        //location.reload();
                                    }
                                });

                                if ($('#newProfImg')[0].files[0] != undefined) {
                                    var imgFile = $('#newProfImg')[0].files[0];
                                    var data = new FormData();
                                    data.append('user_image', $('#newProfImg')[0].files[0]);
                                    $.ajax({
                                        url: arcs.baseURL + 'users/uploadProfileImage',
                                        type: "POST",
                                        data: data,
                                        cache: false,
                                        processData: false,  // tell jQuery not to process the data
                                        contentType: false,  // tell jQuery not to set contentType
                                        success: function (data) {
                                            console.log(data);
                                        }
                                    });
                                }
                            };
                        })(this)
                    },
                    cancel: function () {
                    }
                }
            });
            //Adding the Choose file button and label
            profileModal.$el.find('.modal-body').append(
                '<p style="display:inline-block;max-width:100%;margin-bottom:5px;font-weight: bold;">Profile Picture</p>'
            );
            profileModal.$el.find('.modal-footer').append(
                '<label for="files" class="btn" name="user_image" id="uploadProfImgLabel">Choose File</label>'
            );
            profileModal.$el.find('.modal-body').append(
                '<form method="post" enctype="multipart/form-data" id="profImgForm">' +
                '<input type="file" name="user_image" id="newProfImg" value="Upload Profile Image" style="display:none"/>' +
                '<input type="button" id="profImgUpload" style="display:none" >' +
                '</form>'
            );


            $(function () {//Connecting the label to the upload file button
                profileModal.$el.find("#uploadProfImgLabel").click(function () {
                    $("#newProfImg").trigger('click');
                });
            })
            $('#newProfImg').change(function () {//Making the filename appear on the label
                var i = $(this).prev('label').clone();
                var file = $('#newProfImg')[0].files[0].name;
                profileModal.$el.find("#uploadProfImgLabel").text(file);
                profileModal.$el.find("#uploadProfImgLabel").css("width:auto");
            });

            return profileModal;
        };

        Profile.prototype.onClick = function (e) {
            //this file gets run before edit-collections.js..
            // so we need to make sure this isn't a .edit-btn click.
            if ($(e.target).hasClass('edit-btn')) {
                return true;
            }
            var $el, limit, ref, src;
            if (e.currentTarget.tagName === 'DETAILS') {
                $el = $(e.currentTarget);
                $el.toggleClass('closed').toggleClass('open');
                limit = 1;
                $el.toggleAttr('open');
            } else if (e.currentTarget.className === 'btn-show-all') {
                $el = $(e.currentTarget).parent().parent().parent().parent();
                $(e.currentTarget).removeClass('btn-show-all');
                $(e.currentTarget).addClass('show-all-loading-icon');
                $(e.currentTarget).find("img:first").replaceWith(ARCS_LOADER_HTML);
                limit = 0;
            } else {
                if ($(e.currentTarget).children().last().hasClass('save-btn')) {
                    e.preventDefault();
                    return;
                }
                $el = $(e.currentTarget).parent();
                $el.toggleClass('closed').toggleClass('open');
                limit = 1;
                $el.toggleAttr('open');
                if ($(e.currentTarget).nextAll('.results:first').children().eq(0).prop("tagName") !== 'IMG') {
                    var loaderHtml = $(ARCS_LOADER_HTML);
                    $(loaderHtml).css({'margin-top': '5px', 'margin-bottom': '5px'});
                    $(e.currentTarget).nextAll('.results:first').prepend(loaderHtml);
                }
            }
            if ($el[0].hasAttribute("open")) {
                this.renderDetails($el, limit);
                $el.find('.edit-btn').html('EDIT COLLECTION');
            } else {
                $el.children('div').html('');
                $el.find('.edit-btn').html('OPEN COLLECTION');
            }
            if ((e.srcElement != null)) {
                if (((ref = e.srcElement.tagName) !== 'SPAN' && ref !== 'BUTTON' && ref !== 'I' && ref !== 'A')) {
                    e.preventDefault();
                    return false;
                }
            }
        };

        Profile.prototype.deleteCollection = function (e) {
            var $parent, id, model;
            e.preventDefault();
            $parent = $(e.currentTarget).parents('details');
            id = $parent.data('id');
            model = this.collection.get(id);
            return arcs.confirm("Are you sure you want to delete this collection?", ("<p>Collection <b>" + (model.get('title')) + "</b> will be ") + "deleted. <p><b>N.B.</b> Resources within the collection will not be " + "deleted. They may still be accessed from other collections to which they " + "belong.", (function (_this) {
                return function () {
                };
            })(this), arcs.loader.show(), $.ajax({
                url: arcs.url('collections', 'delete', model.id),
                type: 'DELETE',
                success: (function (_this) {
                    return function () {
                        _this.collection.remove(model, {
                            silent: true
                        });
                        _this.render();
                        return arcs.loader.hide();
                    };
                })(this)
            }));
        };

        Profile.prototype.renderDetails = function ($el, limit) {
            var id, query, query2;
            id = $el.attr('data-id');
            query = encodeURIComponent('collection_id:"' + id + '"');
            query2 = arcs.baseURL + "resources/search?";
            if (limit === 1) {
                query2 += "n=-2&";
            }
            return $.getJSON(query2 + ("q=" + query), function (response) {
                if (typeof response.results[0] == "object") {
                    $el.children('.results').html(arcs.tmpl('home/details', {
                        resources: response.results,
                        noShowAll: 1,
                        searchURL: arcs.baseURL + ("collection/" + id)
                    }));
                    //readjust the resource permissions css
                    $('.resource-thumb').each(function () {
                        var atag = $(this).children().eq(0);
                        var darkBackground = $(atag).children().eq(0);
                        var resourcePicture = $(atag).children().eq(2);
                        $(resourcePicture).load(function () { //wait for each picture to finish loading
                            var pictureWidth = resourcePicture[0].getBoundingClientRect().width;
                            darkBackground.width(pictureWidth); //background same as picture width
                        });
                    });
                } else {
                    //collection show all goes to search
                    //window.location.href = "../../search/collection/" + id;
                }
            });
        };

        Profile.prototype.fileSelect = function (e) {
            var val = $('#newProfImg').val();
        }

        return Profile;

    })(Backbone.View);

}).call(this);
