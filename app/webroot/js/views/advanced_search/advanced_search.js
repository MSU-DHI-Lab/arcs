// Generated by CoffeeScript 1.10.0
(function() {
  var base, display, selected, selectedCount, selectedMap, totalResults, waiting,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  selectedMap = {
    "unselected": [],
    "selected": []
  };

  selectedCount = 0;

  selected = [];

  display = [];

  totalResults = [];

  waiting = false;

  if ((base = arcs.views).advanced_search == null) {
    base.advanced_search = {};
  }

  arcs.views.advanced_search.AdvancedSearch = (function(superClass) {
    var adjustPage, advancedSearch, fillArray, noResults, pagination, showSelected;

    extend(AdvancedSearch, superClass);

    function AdvancedSearch() {
      return AdvancedSearch.__super__.constructor.apply(this, arguments);
    }

    AdvancedSearch.prototype.options = {
      sort: 'title',
      sortDir: 'asc',
      grid: true,
      url: arcs.baseURL + 'advanced_search/'
    };


    /* Initialize and define events */

    AdvancedSearch.prototype.initialize = function(options) {
      _.extend(this.options, _.pick(options, 'el'));
      this.setupSelect();
      this.setupSearch();
      Backbone.history.start({
        pushState: true,
        root: this.options.url
      });
      this.search.results.on('change remove', this.render, this);
      arcs.bus.on('selection', this.afterSelection, this);
      arcs.keys.map(this, {
        'ctrl+a': this.selectAll,
        '?': this.showHotkeys,
        t: this.scrollTop
      });
      return this.setupHelp();
    };

    AdvancedSearch.prototype.events = {
      'click #grid-btn': 'toggleView',
      'click #list-btn': 'toggleView',
      'click #top-btn': 'scrollTop',
      'click .dir-btn': 'setSortDir',
      'click .search-page-btn': 'setPage',
      'click .search-type': 'addFacet',
      'click .pageNumber': 'scrollTop',
      'click #leftArrowBox': 'scrollTop',
      'click #rightArrowBox': 'scrollTop',
      'click .sort-btn': 'scrollTop',
      'click .fDots': 'scrollTop',
      'click .dots': 'scrollTop'
    };


    /* More involved setups run by the initialize method */

    AdvancedSearch.prototype.setupSelect = function() {
      return this.$el.find('#search-results').selectable({
        distance: 20,
        filter: '.img-wrapper img',
        selecting: (function(_this) {
          return function(e, ui) {
            $(ui.selecting).parents('.result').addClass('selected');
            $(ui.selecting).parents('.result').children('.select-button').html('DE-SELECT');
            $(ui.selecting).parents('.result').children('.select-button').addClass('de-select');
            return _this.afterSelection();
          };
        })(this),
        selected: (function(_this) {
          return function(e, ui) {
            $(ui.selected).parents('.result').addClass('selected');
            $(ui.selected).parents('.result').children('.select-button').html('DE-SELECT');
            $(ui.selected).parents('.result').children('.select-button').addClass('de-select');
            return _this.afterSelection();
          };
        })(this),
        unselecting: (function(_this) {
          return function(e, ui) {
            $(ui.unselecting).parents('.result').removeClass('selected');
            $(ui.unselecting).parents('.result').children('.select-button').html('SELECT');
            $(ui.unselecting).parents('.result').children('.select-button').removeClass('de-select');
            return _this.afterSelection();
          };
        })(this),
        unselected: (function(_this) {
          return function(e, ui) {
            $(ui.unselected).parents('.result').removeClass('selected');
            $(ui.unselected).parents('.result').children('.select-button').html('SELECT');
            $(ui.unselected).parents('.result').children('.select-button').removeClass('de-select');
            return _this.afterSelection();
          };
        })(this)
      });
    };

    AdvancedSearch.prototype.setupSearch = function() {
      this.scrollReady = false;
      return this.search = new arcs.utils.Search({
        container: $('searchBox'),
        order: this.options.sort,
        run: false,
        loader: true,
        success: (function(_this) {
          return function() {
            console.log((encodeURIComponent(_this.search.query)) + "/p" + _this.search.page);
            _this.router.navigate((encodeURIComponent(_this.search.query)) + "/p" + _this.search.page);
            if (!_this.scrollReady) {
              _this.setupScroll() && (_this.scrollReady = true);
            }
            _this.setupHelp();
            return _this.render();
          };
        })(this)
      });
    };

    AdvancedSearch.prototype.setupScroll = function() {
      var $actions, $results, $window, pos, ref;
      ref = [this.$('#search-actions'), this.$('#search-results')], $actions = ref[0], $results = ref[1];
      $window = $(window);
      pos = $actions.offset().top - 10;
      return $window.resize(function() {
        if ($window.scrollTop() > pos) {
          return $actions.width($results.width() + 23);
        }
      });
    };

    AdvancedSearch.prototype.setupHelp = function() {
      if (!$('.search-help-btn').length) {
        $('.VS-search-inner').append(arcs.tmpl('search/help-toggle'));
        $('.search-help-btn').click(this.showHelp);
        return $('.search-help-close').click(this.closeHelp);
      }
    };

    AdvancedSearch.prototype.toggleView = function() {
      this.options.grid = !this.options.grid;
      this.$('#grid-btn').toggleClass('active');
      this.$('#list-btn').toggleClass('active');
      return this.render();
    };

    AdvancedSearch.prototype.scrollTop = function() {
      var time;
      time = ($(window).scrollTop() / $(document).height()) * 1000;
      return $('html, body').animate({
        scrollTop: 0
      }, time);
    };

    AdvancedSearch.prototype.setSort = function(e) {
      this.options.sort = e.target.id.match(/sort-(\w+)-btn/)[1];
      this.$('.sort-btn .icon-ok').remove();
      this.$(e.target).append(this.make('i', {
        "class": 'icon-ok'
      }));
      this.$('#sort-btn span#sort-by').html(this.options.sort);
      console.log("SEARCHING");
      return this.search.run(null, {
        order: this.options.sort,
        direction: this.options.sortDir
      });
    };

    AdvancedSearch.prototype.setSortDir = function(e) {
      this.options.sortDir = e.target.id.match(/dir-(\w+)-btn/)[1];
      this.$('.dir-btn .icon-ok').remove();
      this.$(e.target).append(this.make('i', {
        "class": 'icon-ok'
      }));
      return this.search.run(null, {
        order: this.options.sort,
        direction: this.options.sortDir
      });
    };

    AdvancedSearch.prototype.setPage = function(e) {
      e.preventDefault();
      this.$el = $(e.currentTarget);
      this.search.options.page = this.$el.data('pageNumber');
      return this.search.run();
    };

    AdvancedSearch.prototype.unselectAll = function(trigger) {
      if (trigger == null) {
        trigger = true;
      }
      console.log("unselectAll called");
      this.$('.result').removeClass('selected');
      this.$('.select-button').removeClass('de-select');
      this.$('.select-button, #toggle-select').html('SELECT');
      this.$('#deselect-all').attr({
        id: 'select-all'
      });
      if (trigger) {
        return arcs.bus.trigger('selection');
      }
    };

    AdvancedSearch.prototype.selectAll = function(trigger) {
      if (trigger == null) {
        trigger = true;
      }
      console.log("selectAll called");
      this.$('.result').addClass('selected');
      this.$('.select-button').addClass('de-select');
      this.$('.select-button, #toggle-select').html('DE-SELECT');
      this.$('#select-all').attr({
        id: 'deselect-all'
      });
      if (trigger) {
        return arcs.bus.trigger('selection');
      }
    };

    AdvancedSearch.prototype.toggle = function(e) {
      if (!(e.ctrlKey || e.shiftKey || e.metaKey)) {
        this.unselectAll(false);
      }
      $(e.currentTarget).parents('.result').toggleClass('selected');
      return arcs.bus.trigger('selection');
    };

    AdvancedSearch.prototype.maybeUnselectAll = function(e) {
      console.log("maybeunselectAll called");
      if (!(e instanceof jQuery.Event)) {
        return this.unselectAll();
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        return false;
      }
      if ($(e.target).attr('src')) {
        return false;
      }
      return this.unselectAll();
    };

    AdvancedSearch.prototype.showHotkeys = function() {
      if ($('.hotkeys-modal').length) {
        return $('.hotkeys-modal').remove();
      }
      return new arcs.views.Hotkeys({
        template: 'search/hotkeys'
      });
    };

    AdvancedSearch.prototype.showHelp = function() {
      return $('.search-help').show();
    };

    AdvancedSearch.prototype.closeHelp = function() {
      return $('.search-help').hide();
    };


    /* Render the search results */

    AdvancedSearch.prototype.afterSelection = function() {
      return _.defer((function(_this) {
        return function() {
          var num;
          selected = $('.result.selected').map(function() {
            return $(this).data('id');
          }).get();
          console.log("coffee selected");
          console.log(selected);
          arcs.selected = selected;
          console.log(arcs.selected);
          $('#selected-resource-ids').html(selected);
          num = $('.result.selected').length;
          $('#selected-count').html(num);
          if (num !== 0) {
            $('#selected-all').css({
              color: 'black'
            });
          } else {
            $('#selected-all').css({
              color: '#C1C1C1'
            });
          }
          if (selected.length) {
            _this.search.results.select(selected);
          }
          if (_this.search.results.anySelected()) {
            $('.btn.needs-resource').removeClass('disabled');
            return $('#search input').blur();
          } else {
            return $('.btn.needs-resource').addClass('disabled');
          }
        };
      })(this));
    };

    $('.dropdown-menu').change(function(event) {
      return console.log("Dropdown select");
    });

    AdvancedSearch.prototype.append = function() {
      var results;
      if (!(this.search.results.length > this.search.options.n)) {
        return;
      }
      results = new arcs.collections.ResultSet(this.search.getLast());
      return this._render({
        results: results.toJSON()
      }, true);
    };

    AdvancedSearch.prototype.addFacet = function(e) {
      e.preventDefault();
      return this.search.vs.searchBox.addFacet(e.target.text, '', 10);
    };

    fillArray = function(page, lastPage) {
      var i, results1;
      if (page < 3) {
        page = 3;
      }
      if (page === lastPage) {
        page = page - 2;
      }
      if (page === lastPage - 1) {
        page = page - 1;
      }
      i = -1;
      results1 = [];
      while (i < 4) {
        i++;
        if ((page + (i - 2)) <= lastPage) {
          results1.push(page + (i - 2));
        } else {
          results1.push(0);
        }
      }
      return results1;
    };

    pagination = function(pageArray, currentPage, lastPage) {
      var i, j, results1;
      console.log(pageArray);
      if (indexOf.call(pageArray, 1) >= 0) {
        $('#firstPage').css('display', 'none');
        $('.fDots').css('display', 'none');
      } else {
        $('#firstPage').css('display', 'block');
        $('.fDots').css('display', 'block');
      }
      if (1 === currentPage) {
        $('#rightArrow').css('display', 'none');
      } else {
        $('#rightArrow').css('display', 'block');
      }
      if (indexOf.call(pageArray, lastPage) >= 0) {
        $('#lastPage').css('display', 'none');
        $('.dots').css('display', 'none');
        $('#leftArrow').css('display', 'none');
      } else {
        $('#lastPage').css('display', 'block');
        $('.dots').css('display', 'block');
        $('#leftArrow').css('display', 'block');
      }
      if (currentPage === lastPage) {
        $('#lefttArrow').css('display', 'none');
      } else {
        $('#leftArrow').css('display', 'block');
      }
      if (2 === pageArray[0]) {
        $('.fDots').css('display', 'none');
      }
      if (lastPage - 1 === pageArray[4]) {
        $('.dots').css('display', 'none');
      }
      results1 = [];
      for (i = j = 1; j <= 5; i = ++j) {
        if (pageArray[i - 1] <= 0) {
          results1.push($('#' + i).css('display', 'none'));
        } else {
          $('#' + i).css('display', 'block');
          $('#' + i).html(pageArray[i - 1]);
          if (parseInt($('#' + i).html()) === currentPage) {
            $('#' + i).addClass('selected');
            results1.push($('#' + i).addClass('currentPage'));
          } else {
            results1.push(void 0);
          }
        }
      }
      return results1;
    };

    noResults = function() {
      var i, j, results1;
      $('#firstPage').css('display', 'none');
      $('.fDots').css('display', 'none');
      $('#lastPage').css('display', 'none');
      $('.dots').css('display', 'none');
      $('#leftArrow').css('display', 'none');
      $('#rightArrow').css('display', 'none');
      results1 = [];
      for (i = j = 1; j <= 5; i = ++j) {
        results1.push($('#' + i).css('display', 'none'));
      }
      return results1;
    };

    showSelected = function() {
      return $('.result').each(function() {
        var ref;
        if (ref = $(this).data('id'), indexOf.call(selectedMap['selected'], ref) >= 0) {
          $(this).addClass('selected');
          $(this).find('.select-button').addClass('de-select');
          return $(this).find('.select-button').html('DE-SELECT');
        }
      });
    };

    adjustPage = function(results, currentPage) {
      var lastPage, numberPerPage, pageNum, skip, temp;
      if (waiting) {
        return;
      }
      $('.pageNumber').removeClass('currentPage');
      $('.pageNumber').removeClass('selected');
      console.log("CALLED");
      console.log(results);
      pageNum = currentPage;
      console.log(pageNum);
      numberPerPage = parseInt($('#items-per-page-btn').html().substring(0, 2));
      console.log(numberPerPage);
      lastPage = Math.ceil(results.length / numberPerPage);
      console.log(lastPage);
      temp = fillArray(pageNum, lastPage);
      console.log(temp);
      pagination(temp, pageNum, lastPage);
      skip = (pageNum - 1) * numberPerPage;
      console.log("skip: " + skip + " (skip+numberPerPage: )" + (skip + numberPerPage));
      $('#lastPage').html(lastPage);
      console.log(totalResults.slice(skip, +(skip + numberPerPage) + 1 || 9e9));
      AdvancedSearch.prototype._render({
        results: totalResults.slice(skip, skip + numberPerPage)
      });
      if (selectedMap['selected'].length > 0) {
        return showSelected();
      }
    };

    advancedSearch = function(val) {
      var pageNum, perPage, resources;
      $('.flex-img').removeClass('selected');
      console.log(val);
      val = JSON.stringify(val);
      pageNum = $('.currentPage').html();
      perPage = $('#items-per-page-btn').html().substring(0, 2);
      $('.pageNumber').removeClass('currentPage');
      $('.pageNumber').removeClass('selected');
      resources = new Promise(function(resolve, reject) {
        var pageNumber, perPageUrl, req, resourcequery;
        resourcequery = encodeURIComponent("" + val);
        pageNumber = encodeURIComponent("" + pageNum);
        perPageUrl = encodeURIComponent("" + perPage);
        return req = $.getJSON(arcs.baseURL + 'advanced_search/' + resourcequery + "/" + pageNumber + "/" + perPageUrl, function(response) {
          var temp;
          console.log(response);
          $('#lastPage').html(response['pages']);
          temp = fillArray(parseInt(pageNum), parseInt(response['pages']));
          if (response['display'] !== 0) {
            pagination(temp, parseInt(pageNum), parseInt(response['pages']));
          } else {
            noResults();
          }
          $('#results-count').html(response['results']);
          return resolve(response['results']);
        });
      });
      totalResults = [];
      return Promise.all([resources]).then(function(values) {
        var key, ref, value;
        console.log(values[0]);
        ref = values[0];
        for (key in ref) {
          value = ref[key];
          totalResults.push(value);
        }
        $('#results-count').html(totalResults.length);
        adjustPage(totalResults, 1);
      });
    };

    $(function() {
      var active;
      if (!$.support.placeholder) {
        active = document.activeElement;
        $(':text').focus(function() {
          if ($(this).attr('placeholder') !== '' && $(this).val() === $(this).attr('placeholder')) {
            $(this).val('').removeClass('hasPlaceholder');
            $(this).val('');
          }
        }).blur(function() {
          if ($(this).attr('placeholder') !== '' && ($(this).val() === '' || $(this).val() === $(this).attr('placeholder'))) {
            $(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
            $(this).val('');
          }
        });
        $(':text').blur();
        $(active).focus();
        $(this).find('.searchBoxAdvanced').each(function() {
          $(this).val('');
          return;
        });
      }
    });

    $(function() {
      return $("#advanced_search_button").click(function(e) {
        var coverage, creator, date, date_modified, description, format, identifier, language, location, medium, subject, val, val2, x;
        console.log("Ran ad");
        $('.pageNumber').removeClass('selected');
        $('.pageNumber').removeClass('currentPage');
        $("#1").addClass('selected');
        $("#1").addClass('currentPage');
        $("#1").html(1);
        medium = $("#Medium").val();
        language = $("#Language").val();
        format = $("#Format").val();
        date_modified = $("#DateModified").val();
        creator = $("#Creator").val();
        subject = $("#Subject").val();
        location = $("#Location").val();
        identifier = $("#Identifier").val();
        description = $("#Description").val();
        date = $("#Date").val();
        coverage = $("#Coverage").val();
        val = [coverage, date, description, identifier, location, subject, creator, date_modified, format, language, medium];
        console.log(val.length);
        console.log(val);
        val2 = [];
        x = 0;
        while (x < val.length) {
          if (val[x] !== '') {
            val2.push(val[x]);
          }
          x++;
        }
        val = val2;
        e.preventDefault();
        $('.flex-container').empty();
        $('.flex-container').append('<img src=' + arcs.baseURL + "/img/arcs-preloader.gif>");
        $('#search-results-wrapper').css('visibility', 'visible');
        return advancedSearch(val);
      });
    });

    AdvancedSearch.prototype._render = function(results, append) {
      var $results, template;
      if (append == null) {
        append = false;
      }
      $results = $('.flex-container');
      template = this.options.grid ? 'search/grid' : 'search/list';
      results = results.results;
      $results[append ? 'append' : 'html'](arcs.tmpl(template, {
        results: results
      }));
      $(".pageNumber").unbind().click(function(e) {
        if ($(this).hasClass('selected')) {
          e.stopPropagation();
        } else {
          $('.pageNumber').removeClass('selected');
          $('.pageNumber').removeClass('currentPage');
          $(this).addClass('selected');
          $(this).addClass('currentPage');
          adjustPage(totalResults, parseInt($('.currentPage').html()));
        }
      });
      $('#leftArrowBox').unbind().click(function(e) {
        var temp;
        temp = $('.currentPage').html();
        $('.currentPage').html(parseInt(temp) + 1);
        return adjustPage(totalResults, parseInt($('.currentPage').html()));
      });
      $('#rightArrowBox').unbind().click(function(e) {
        var temp;
        temp = $('.currentPage').html();
        if (temp === '1') {

        } else {
          $('.currentPage').html(parseInt(temp) - 1);
          return adjustPage(totalResults, parseInt($('.currentPage').html()));
        }
      });
      $('#dots').unbind().click(function() {
        var temp;
        temp = parseInt($('.currentPage').html()) + 5;
        if (temp > parseInt($("#lastPage").html())) {
          temp = parseInt($("#lastPage").html());
        }
        $('.currentPage').html(temp);
        return adjustPage(totalResults, parseInt($('.currentPage').html()));
      });
      $('#fDots').unbind().click(function() {
        var temp;
        temp = parseInt($('.currentPage').html()) - 5;
        if (temp < 1) {
          temp = 1;
        }
        $('.currentPage').html(temp);
        return adjustPage(totalResults, parseInt($('.currentPage').html()));
      });
      $('div.result').hover((function() {
        $(this).find('.select-button').show();
        $(this).find('img').addClass('img-hover');
      }), function() {
        $(this).find('.select-button').hide();
        $(this).find('img').removeClass('img-hover');
      });
      $('.select-button').click(function() {
        var index;
        if ($(this).html() === 'SELECT') {
          $(this).html('DE-SELECT');
          $(this).addClass('de-select');
          $(this).parents('.result').addClass('selected');
          $('#selected-all').css({
            color: 'black'
          });
          selectedMap['selected'].push($(this).parents('.result').data("id"));
          $('#selected-resource-ids').html(selectedMap["selected"]);
          $('#selected-count').html(selectedMap["selected"].length);
          console.log(selectedMap);
          arcs.bus.trigger('selection');
        } else {
          $(this).html('SELECT');
          $(this).removeClass('de-select');
          $(this).parents('.result').removeClass('selected');
          index = selectedMap['selected'].indexOf($(this).parents('.result').data("id"));
          if (index > -1) {
            selectedMap['selected'].splice(index, 1);
          }
          if (selectedMap['selected'].length < 1) {
            $('#selected-all').css({
              color: '#C1C1C1'
            });
          }
          console.log(index);
          console.log(selectedMap);
          $('#selected-resource-ids').html(selectedMap["selected"]);
          $('#selected-count').html(selectedMap["selected"].length);
          arcs.bus.trigger('selection');
        }
      });
      $('.sort-btn').unbind().click(function() {
        $('#items-per-page-btn').html($(this).html() + "<span class='pointerDown sort-arrow pointerSearch'></span>");
        $('.pageNumber').removeClass('selected');
        $('.pageNumber').removeClass('currentPage');
        $("#1").addClass('selected');
        $("#1").addClass('currentPage');
        $("#1").html(1);
        return adjustPage(totalResults, parseInt($('.currentPage').html()));
      });
      $('#select-all, #deselect-all').unbind().click(function() {
        var i;
        if (this.id === 'select-all') {
          $('#selected-all').css({
            color: 'black'
          });
          selectedMap['selected'] = [];
          i = 0;
          for (i in totalResults) {
            selectedMap['selected'].push(totalResults[i]['kid']);
            ++i;
          }
          console.log(selected['unselected']);
          arcs.searchView.selectAll();
          $('#toggle-select').html('DE-SELECT');
          console.log(selectedMap['selected']);
          $('#selected-resource-ids').html(selectedMap["selected"]);
          return $('#selected-count').html(selectedMap["selected"].length);
        } else {
          $('#selected-all').css({
            color: '#C1C1C1'
          });
          console.log("in the else statement");
          selectedMap['selected'] = [];
          this.id = 'select-all';
          arcs.searchView.unselectAll();
          $('#selected-resource-ids').html(selectedMap["selected"]);
          return $('#selected-count').html(selectedMap["selected"].length);
        }
      });
      if (results.length === 0) {
        return $results.html("<div id='no-results'>No Results</div>");
      }
    };

    return AdvancedSearch;

  })(Backbone.View);

}).call(this);
