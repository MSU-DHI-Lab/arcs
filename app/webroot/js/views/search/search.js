// Generated by CoffeeScript 1.10.0
(function() {
  var base, display, filteredFilters, filters, filtersApplied, selected, selectedCount, selectedMap, sortDirection, totalResults, unfilteredResults, waiting,
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

  filters = [];

  filteredFilters = [];

  filtersApplied = {
    'Excavation Name': '',
    'Season Name': '',
    'Type': '',
    'Excavation Type': '',
    'Creator': ''
  };

  unfilteredResults = [];

  if ((base = arcs.views).search == null) {
    base.search = {};
  }

  sortDirection = false;

  arcs.views.search.Search = (function(superClass) {
    var adjustPage, createAllFilter, fillArray, noResults, pagination, search, setCreators, setExcavations, setFilters, setResources, setSeasons, setSites, showSelected, sortBy;

    extend(Search, superClass);

    function Search() {
      return Search.__super__.constructor.apply(this, arguments);
    }

    Search.selected = [];

    Search.prototype.options = {
      sort: 'title',
      sortDir: 'asc',
      grid: true,
      url: arcs.baseURL + 'search/'
    };


    /* Initialize and define events */

    Search.prototype.initialize = function(options) {
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

    Search.prototype.events = {
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
      'click .dots': 'scrollTop',
      'click #open-colview-form': 'openCollection'
    };


    /* More involved setups run by the initialize method */

    Search.prototype.setupSelect = function() {

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

    Search.prototype.setupSearch = function() {
      this.scrollReady = false;
      return this.search = new arcs.utils.Search({
        container: $('searchBox'),
        order: this.options.sort,
        run: false,
        loader: true,
        success: (function(_this) {
          return function() {
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

    Search.prototype.setupScroll = function() {
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

    Search.prototype.setupHelp = function() {
      if (!$('.search-help-btn').length) {
        $('.VS-search-inner').append(arcs.tmpl('search/help-toggle'));
        $('.search-help-btn').click(this.showHelp);
        return $('.search-help-close').click(this.closeHelp);
      }
    };

    Search.prototype.toggleView = function() {
      this.options.grid = !this.options.grid;
      this.$('#grid-btn').toggleClass('active');
      this.$('#list-btn').toggleClass('active');
      return adjustPage(totalResults, 1);
    };

    Search.prototype.scrollTop = function() {
      var time;
      time = ($(window).scrollTop() / $(document).height()) * 1000;
      return $('html, body').animate({
        scrollTop: 0
      }, time);
    };

    Search.prototype.openCollection = function(e) {
      var form = $(e.target).parent();
      form.find("input").attr({value: JSON.stringify(Search.selected) });
      form.attr({action: arcs.baseURL + "view/"});
      form.submit();

    };

    Search.prototype.setSort = function(e) {
      this.options.sort = e.target.id.match(/sort-(\w+)-btn/)[1];
      this.$('.sort-btn .icon-ok').remove();
      this.$(e.target).append(this.make('i', {
        "class": 'icon-ok'
      }));
      this.$('#sort-btn span#sort-by').html(this.options.sort);
      return this.search.run(null, {
        order: this.options.sort,
        direction: this.options.sortDir
      });
    };

    Search.prototype.setPage = function(e) {
      e.preventDefault();
      this.$el = $(e.currentTarget);
      this.search.options.page = this.$el.data('pageNumber');
      return this.search.run();
    };

    Search.prototype.unselectAll = function(trigger) {
      if (trigger == null) {
        trigger = true;
      }
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

    Search.prototype.selectAll = function(trigger) {
      if (trigger == null) {
        trigger = true;
      }
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

    Search.prototype.toggle = function(e) {
      if (!(e.ctrlKey || e.shiftKey || e.metaKey)) {
        this.unselectAll(false);
      }
      $(e.currentTarget).parents('.result').toggleClass('selected');
      return arcs.bus.trigger('selection');
    };

    Search.prototype.maybeUnselectAll = function(e) {
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

    Search.prototype.showHotkeys = function() {
      if ($('.hotkeys-modal').length) {
        return $('.hotkeys-modal').remove();
      }
      return new arcs.views.Hotkeys({
        template: 'search/hotkeys'
      });
    };

    Search.prototype.showHelp = function() {
      return $('.search-help').show();
    };

    Search.prototype.closeHelp = function() {
      return $('.search-help').hide();
    };


    /* Render the search results */

    $('.dropdown-menu').change(function(event) {});

    Search.prototype.append = function() {
      var results;
      if (!(this.search.results.length > this.search.options.n)) {
        return;
      }
      results = new arcs.collections.ResultSet(this.search.getLast());
      return this._render({
        results: results.toJSON()
      }, true);
    };

    Search.prototype.addFacet = function(e) {
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
      totalResults.sort(function(a, b) {
        return sortBy('Title', a, b, sortDirection);
      });
      $('.pageNumber').removeClass('currentPage');
      $('.pageNumber').removeClass('selected');
      pageNum = currentPage;
      numberPerPage = parseInt($('#items-per-page-btn').html().substring(0, 2));
      lastPage = Math.ceil(results.length / numberPerPage);
      temp = fillArray(pageNum, lastPage);
      pagination(temp, pageNum, lastPage);
      skip = (pageNum - 1) * numberPerPage;
      $('#lastPage').html(lastPage);
      Search.prototype._render({
        results: totalResults.slice(skip, skip + numberPerPage)
      });
      if (selectedMap['selected'].length > 0) {
        return showSelected();
      }
    };

    setCreators = function() {
      var a, key, li, ref, results1, val;
      $('.creatorMenu').empty();
      $('.creatorMenu').append(createAllFilter());
      ref = filters['creators'];
      results1 = [];
      for (key in ref) {
        val = ref[key];
        li = document.createElement('li');
        a = document.createElement('a');
        $(a).addClass('sort-btn filter');
        $(a).html(val);
        li.appendChild(a);
        results1.push($('.creatorMenu').append(li));
      }
      return results1;
    };

    setExcavations = function() {
      var a, key, li, ref, results1, val;
      $('.excavationMenu').empty();
      $('.excavationMenu').append(createAllFilter());
      ref = filters['excavations'];
      results1 = [];
      for (key in ref) {
        val = ref[key];
        li = document.createElement('li');
        a = document.createElement('a');
        $(a).addClass('sort-btn filter');
        $(a).html(val);
        li.appendChild(a);
        results1.push($('.excavationMenu').append(li));
      }
      return results1;
    };

    setResources = function() {
      var a, key, li, ref, results1, val;
      $('.resourcesMenu').empty();
      $('.resourcesMenu').append(createAllFilter());
      ref = filters['types'];
      results1 = [];
      for (key in ref) {
        val = ref[key];
        li = document.createElement('li');
        a = document.createElement('a');
        $(a).addClass('sort-btn filter');
        $(a).html(val);
        li.appendChild(a);
        results1.push($('.resourcesMenu').append(li));
      }
      return results1;
    };

    setSeasons = function() {
      var a, key, li, ref, results1, val;
      $('.seasonsMenu').empty();
      $('.seasonsMenu').append(createAllFilter());
      ref = filters['seasons'];
      results1 = [];
      for (key in ref) {
        val = ref[key];
        li = document.createElement('li');
        a = document.createElement('a');
        $(a).addClass('sort-btn filter');
        $(a).html(val);
        li.appendChild(a);
        results1.push($('.seasonsMenu').append(li));
      }
      return results1;
    };

    setSites = function() {
      var a, key, li, ref, results1, val;
      $('.sitesMenu').empty();
      $('.sitesMenu').append(createAllFilter());
      ref = filters['sites'];
      results1 = [];
      for (key in ref) {
        val = ref[key];
        li = document.createElement('li');
        a = document.createElement('a');
        $(a).addClass('sort-btn filter');
        $(a).html(val);
        li.appendChild(a);
        results1.push($('.sitesMenu').append(li));
      }
      return results1;
    };

    createAllFilter = function() {
      var a, li;
      li = document.createElement('li');
      a = document.createElement('a');
      $(a).addClass('sort-btn filter active');
      $(a).html("all");
      li.appendChild(a);
      return li;
    };

    setFilters = function() {
      setCreators();
      setExcavations();
      setResources();
      setSeasons();
      return setSites();
    };

    sortBy = function(key, a, b, r) {
      r = r ? 1 : -1;
      if (a[key] > b[key]) {
        return -1 * r;
      }
      if (a[key] < b[key]) {
        return +1 * r;
      }
      return 0;
    };

    search = function() {
      var pageNum, pageNumber, perPage, perPageUrl, resourcequery, val, wiating;
      wiating = true;
      val = $(".searchBoxInput").val();
      pageNum = $('.currentPage').html();
      perPage = $('#items-per-page-btn').html().substring(0, 2);
      val = val.replace(/[^A-Za-z0-9-]/g, '');
      if (val === "") {
        noResults();
        totalResults = [];
        Search.prototype._render({
          results: totalResults
        });
        return;
      }
      resourcequery = encodeURIComponent("" + val);
      pageNumber = encodeURIComponent("" + pageNum);
      perPageUrl = encodeURIComponent("" + perPage);
      $('.pageNumber').removeClass('currentPage');
      $('.pageNumber').removeClass('selected');
      totalResults = [];
      return $.ajax({
        'dataType': 'json',
        'url': arcs.baseURL + 'simple_search/' + resourcequery + "/" + pageNumber + "/" + perPageUrl,
        'success': function(data) {
          var key, ref, value;
          if (data['total'] === 0) {
            adjustPage([], 0);
            return noResults();
          } else {
            $('#results-count').html(data['total']);
            filters = data['filters'];
            filteredFilters = filters;
            ref = data['results'];
            for (key in ref) {
              value = ref[key];
              if (value['Title'] === '') {
                value['Title'] = "No title given";
              }
              totalResults.push(value);
              unfilteredResults.push(value);
              selectedMap['unselected'].push(value['kid']);
            }
            selectedMap['unselected'] = totalResults;
            waiting = false;
            setFilters();
            return adjustPage(totalResults, 1);
          }
        }
      });
    };

    $(function() {

      return $(".searchBoxInput").keyup(function(e) {
        if (e.keyCode === 13) {
          selectedMap = {
            "unselected": [],
            "selected": []
          };
          $('.pageNumber').removeClass('selected');
          $('.pageNumber').removeClass('currentPage');
          $("#1").addClass('selected');
          $("#1").addClass('currentPage');
          $("#1").html(1);
          e.preventDefault();
          $('.flex-container').empty();
          $('.flex-container').append('<img src=' +arcs.baseURL+'img/arcs-preloader.gif>');
          $('#search-results-wrapper').css('visibility', 'visible');
          return search();
        }
      });
    });

    Search.prototype._render = function(results, append) {
      var $results, filterResults, getCnt, template;
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
      $('.result').hover((function() {
        $(this).find('.select-button').show();
        $(this).find('img').addClass('img-hover');
        $(this).find('.select-button').css('visibility', 'visible');
      }), function() {
        $(this).find('.select-button').hide();
        $(this).find('img').removeClass('img-hover');
        $(this).find('.select-button').css('visibility', 'hidden');
      });
      $('.select-button').click(function() {
        var index;
        var data_id = $(this).parent().attr("data-id");



        if ($(this).html() === 'SELECT') {
          if(data_id != ""){
            if(Search.selected.indexOf(data_id) == -1)
              Search.selected.push(data_id);
          }
          $(this).html('DE-SELECT');
          $(this).addClass('de-select');
          $(this).parents('.result').addClass('selected');
          $('#selected-all').css({
            color: 'black'
          });
          selectedMap['selected'].push($(this).parents('.result').data("id"));
          $('#selected-resource-ids').html(selectedMap["selected"]);
          $('#selected-count').html(selectedMap["selected"].length);
          arcs.bus.trigger('selection');
        } else {
          if(data_id != ""){
            index = Search.selected.indexOf(data_id);
            if(index != -1)
              Search.selected.splice(index, 1);
          }
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
          $('#selected-resource-ids').html(selectedMap["selected"]);
          $('#selected-count').html(selectedMap["selected"].length);
          arcs.bus.trigger('selection');
        }
        console.log(Search.selected);
      });
      $('.perpage-btn').unbind().click(function() {
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
          arcs.searchView.selectAll();
          $('#toggle-select').html('DE-SELECT');
          $('#selected-resource-ids').html(selectedMap["selected"]);
          return $('#selected-count').html(selectedMap["selected"].length);
        } else {
          $('#selected-all').css({
            color: '#C1C1C1'
          });
          selectedMap['selected'] = [];
          this.id = 'select-all';
          arcs.searchView.unselectAll();
          $('#selected-resource-ids').html(selectedMap["selected"]);
          return $('#selected-count').html(selectedMap["selected"].length);
        }
      });
      getCnt = function() {
        var cnt, key, val;
        cnt = 0;
        for (key in filtersApplied) {
          val = filtersApplied[key];
          if (val) {
            cnt++;
          }
        }
        return cnt;
      };
      filterResults = function() {
        var count, creator, excavationType, key, seasonName, sites, type, val;
        totalResults = [];
        filters = {
          'creators': [],
          'excavations': [],
          'seasons': [],
          'sites': [],
          'types': []
        };
        sites = filtersApplied['Excavation Name'];
        seasonName = filtersApplied['Season Name'];
        type = filtersApplied['Type'];
        excavationType = filtersApplied['Excavation Type'];
        creator = filtersApplied['Creator'];
        count = 0;
        for (key in unfilteredResults) {
          val = unfilteredResults[key];
          if (sites !== '') {
            if (val['Excavation Name'] !== sites) {
              continue;
            }
          }
          if (seasonName !== '') {
            if (val['Season Name'] !== seasonName) {
              continue;
            }
          }
          if (type !== '') {
            if (val['Type'] !== type) {
              continue;
            }
          }
          if (excavationType !== '') {
            if (val['Excavation Type'] !== excavationType) {
              continue;
            }
          }
          if (creator !== '') {
            if (indexOf.call(val['Creator'], creator) < 0) {
              continue;
            }
          }
          totalResults.push(val);
          count++;
        }
        $('#results-count').html(count);
        adjustPage(totalResults, 1);
      };
      $('.filter').unbind().on("click", function() {
        var currentFilter, filterCnt, filterKey, parentUl;
        if ($(this).hasClass('active')) {

        } else {
          parentUl = $(this).parent().parent();
          filterKey = parentUl.data('id');
          currentFilter = $(this).html();
          if (currentFilter === 'all') {
            currentFilter = '';
          }
          parentUl.find($('.active')).removeClass('active');
          $(this).addClass('active');
          filtersApplied[filterKey] = currentFilter;
          filterCnt = getCnt();
          if (filterCnt) {
            filterResults();
          } else {
            totalResults = unfilteredResults;
            $('#results-count').html(totalResults.length);
            adjustPage(totalResults, 1);
          }
        }
      });
      $('.dir-btn').unbind().click(function() {
        var id;
        if ($(this).hasClass('active')) {

        } else {
          $('.dir-btn').removeClass('active');
          $(this).addClass('active');
          id = $(this).attr('id');
          if (id === 'dir-asc-btn') {
            sortDirection = false;
          } else {
            sortDirection = true;
          }
          return adjustPage(totalResults, 1);
        }
      });
      if (results.length === 0) {
        return $results.html("<div id='no-results'>No Results</div>");
      }
    };

    return Search;

  })(Backbone.View);

}).call(this);
