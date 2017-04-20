$( document ).ready(function() {

    //hide the resources slider if there is only one resource.
    if($('.resource-slider').find('.other-resources').length == 1){
        $('.resource-nav-level').css('display', 'none');
        $(window).trigger('resize');
    }
    /*
            Metadata edits
     ****************************************************/

    //addMetadataEdits();
    //console.log($session);
    function addMetadataEdits() {
        //console.log('add metadata');
        //console.log(meta_scheme_name);
        switch (meta_scheme_name) {
            case "project":
                meta_scheme_id = PROJECT_SID;
                //meta_resource_kid = "<?php  ?> ";
                break;
            case "Seasons":
                meta_scheme_id = SEASON_SID;
                //meta_resource_kid = "<?php  ?> ";
                break;
            case "excavations":
                meta_scheme_id = SURVEY_SID;
                //finds the kid somewhere else.
                break;
            case "archival objects":
                meta_scheme_id = RESOURCE_SID;
                //meta_resource_kid = resourceKid;
                break;
            case "subjects":
                meta_scheme_id = SUBJECT_SID;
                //finds the kid somewhere else
                break;
        }
        //console.log(meta_scheme_id);
        $.ajax({
            url: arcs.baseURL + "metadataedits/add",
            type: "post",
            data: {
                resource_kid: resource_kid,
                resource_name: resource_name,
                scheme_id: meta_scheme_id,
                //scheme_name: meta_scheme_name, //no longer used
                control_type: meta_control_type,
                field_name: meta_field_name,
                user_id: "idk",   //this is set somewhere else
                value_before: meta_value_before,
                new_value: meta_new_value,
                approved: 0,
                rejected: 0,
                reason_rejected: "",
                metadata_kid: meta_resource_kid
            },
            success: function (data) {
                //console.log("MetadataEditsHere");
                //console.log(data);
                window.location.reload();
            }
        })
    }

    var metadataIsSelected = 0;     //0 or 1 to know if there is one selected
    var editBtnClick = 0;           //0 or 1
    var meta_field_name = '';       //data sent to arcs kora plugin---
    var meta_control_type = '';
    var meta_options = '';
    var meta_value_before = '';
    var meta_new_value = '';
    var meta_scheme_name = '';
    var meta_resource_kid = '';
    var meta_scheme_id = 0;
    var resource_kid = '';
    var resource_name = '';

    var associator_full_array = new Array();  //used for associator modal
    var associator_selected = new Array();

    $(".metadataEdit").click(function () {
        //console.log("metadataEdit click");
        $(this).each(
            function () {
                // if the td elements contain any input tag
                if ($(this).find('textarea').length || $(this).find('select').length || editBtnClick == 0) {
                    // do nothing.
                } else {
                    if (metadataIsSelected == 1) {
                        var id = $("#meta_textarea").parent().children("div").eq(0).text();
                        var text = $("#meta_textarea").text();
                        if (meta_options == '') {
                            if (meta_value_before != '' && (meta_control_type == 'multi_input' || meta_control_type == 'multi_select' )) {
                                meta_value_before = meta_value_before.replace(/\n+/g, '<br />');
                            }
                            var fill = '<div id="' + meta_field_name + '" data-control="' + meta_control_type + '">' + meta_value_before + "</div>";
                        } else {
                            meta_options = meta_options.replace(/["]+/g, '&quot;');
                            //console.log(meta_options);
                            if (meta_value_before != '' && (meta_control_type == 'multi_input' || meta_control_type == 'multi_select' )) {
                                meta_value_before = meta_value_before.replace(/\n+/g, '<br />');
                            }
                            var fill = '<div id="' + meta_field_name + '" data-control="' + meta_control_type + '" data-options="' + meta_options + '">' + meta_value_before + "</div>";
                        }
                        $("#meta_textarea").parent().replaceWith(fill);
                        metadataIsSelected = 0;
                    }
                    // removes the text, appends an input and sets the value to the text-value
                    meta_field_name = $(this).children('div').eq(1).attr('id');
                    meta_control_type = $(this).children('div').eq(1).attr('data-control');
                    meta_options = '';
                    //console.log('meta control');
                    //console.log(meta_control_type);
                    meta_scheme_name = $(this).parent().parent().parent().attr('data-scheme');
                    meta_resource_kid = $(this).parent().parent().parent().attr('data-kid');
                    resource_kid = $('.resource-container-level').find('.selectedResource').prev().attr('id');
                    resource_kid = resource_kid.replace('identifier-', '');
                    resource_name = $('table[data-kid="'+resource_kid+'"]').find("[id='Resource Identifier']").html();
                    var temp_element = $(this).children('div').eq(1).clone();
                    temp_element.find('br').replaceWith('\n');
                    meta_value_before = temp_element.text();
                    //console.log('meta_value before:');
                    //console.log(meta_value_before);

                    //give different control edits based on the kora control type
                    var html = '';
                    if (meta_control_type == 'text') {
                        html = $('<textarea />', {
                            'value': meta_value_before,
                            'id': 'meta_textarea'
                        }).val(meta_value_before);
                        $(this).children('div').eq(1).html(html);

                    } else if (meta_control_type == 'date') {
                        html = '<div class="kora_control" id="meta_textarea">' +
                            '<select class="kcdc_month" id="month_select">' +
                            '<option value="">&nbsp;</option><option value="1">January</option><option value="2">February</option><option value="3">March</option><option value="4">April</option><option value="5">May</option><option value="6">June</option><option value="7">July</option><option value="8">August</option><option value="9">September</option><option value="10">October</option><option value="11">November</option><option value="12">December</option>' +
                            '</select>' +
                            '<select class="kcdc_day" id="day_select">' +
                            '<option value="">&nbsp;</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option>' +
                            '</select>' +
                            '<select class="kcdc_year"  id="year_select">' +
                            '<option value="">&nbsp;</option><option value="1930">1930</option><option value="1931">1931</option><option value="1932">1932</option><option value="1933">1933</option><option value="1934">1934</option><option value="1935">1935</option><option value="1936">1936</option><option value="1937">1937</option><option value="1938">1938</option><option value="1939">1939</option><option value="1940">1940</option><option value="1941">1941</option><option value="1942">1942</option><option value="1943">1943</option><option value="1944">1944</option><option value="1945">1945</option><option value="1946">1946</option><option value="1947">1947</option><option value="1948">1948</option><option value="1949">1949</option><option value="1950">1950</option><option value="1951">1951</option><option value="1952">1952</option><option value="1953">1953</option><option value="1954">1954</option><option value="1955">1955</option><option value="1956">1956</option><option value="1957">1957</option><option value="1958">1958</option><option value="1959">1959</option><option value="1960">1960</option><option value="1961">1961</option><option value="1962">1962</option><option value="1963">1963</option><option value="1964">1964</option><option value="1965">1965</option><option value="1966">1966</option><option value="1967">1967</option><option value="1968">1968</option><option value="1969">1969</option><option value="1970">1970</option><option value="1971">1971</option><option value="1972">1972</option><option value="1973">1973</option><option value="1974">1974</option><option value="1975">1975</option><option value="1976">1976</option><option value="1977">1977</option><option value="1978">1978</option><option value="1979">1979</option><option value="1980">1980</option><option value="1981">1981</option><option value="1982">1982</option><option value="1983">1983</option><option value="1984">1984</option><option value="1985">1985</option><option value="1986">1986</option><option value="1987">1987</option><option value="1988">1988</option><option value="1989">1989</option><option value="1990">1990</option><option value="1991">1991</option><option value="1992">1992</option><option value="1993">1993</option><option value="1994">1994</option><option value="1995">1995</option><option value="1996">1996</option><option value="1997">1997</option><option value="1998">1998</option><option value="1999">1999</option><option value="2000">2000</option><option value="2001">2001</option><option value="2002">2002</option><option value="2003">2003</option><option value="2004">2004</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option><option value="2017">2017</option><option value="2018">2018</option><option value="2019">2019</option><option value="2020">2020</option>' +
                            '</select>' +
                            '<input type="hidden" class="kcdc_era" id="era" value="CE">' +
                            '<div class="ajaxerror"></div>' +
                            '</div>';
                        $(this).children('div').eq(1).html(html);

                        var month = '';
                        var day = '';
                        var year = '';

                        if (meta_value_before != '') {
                            var valueArray = meta_value_before.split(" ");
                            var dateString = valueArray[0];
                            var dateArray = dateString.split("/");
                            month = dateArray[0];
                            day = dateArray[1];
                            year = dateArray[2];
                            //console.log('year:');
                            //console.log(year);
                            $('#month_select option[value="' + month + '"]').prop('selected', true);
                            $('#day_select option[value="' + day + '"]').prop('selected', true);
                            $('#year_select option[value="' + year + '"]').prop('selected', true);
                        }

                    } else if (meta_control_type == 'terminus') {
                        html = '<div class="kora_control" id="meta_textarea">' +
                            '<select class="kcdc_month" id="month_select">' +
                            '<option value="">&nbsp;</option><option value="1">January</option><option value="2">February</option><option value="3">March</option><option value="4">April</option><option value="5">May</option><option value="6">June</option><option value="7">July</option><option value="8">August</option><option value="9">September</option><option value="10">October</option><option value="11">November</option><option value="12">December</option>' +
                            '</select>' +
                            '<select class="kcdc_day" id="day_select">' +
                            '<option value="">&nbsp;</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option>' +
                            '</select>' +
                            '<select class="kcdc_year" id="year_select"><option value="">&nbsp;</option>';
                        for (i = 1; i < 10000; i++) {
                            html += '<option value="' + i + '">' + i + '</option>';
                        }
                        html += '</select>' +
                            '<select class="kcdc_era" id="era_select"><option value="" selected="selected">' +
                            '</option><option value="CE">CE</option><option value="BCE">BCE</option>' +
                            '</select><br />Prefix: ' +
                            '<select class="kcdc_prefix"  id="prefix_select">' +
                            '<option></option><option value="ca">ca</option>' +
                            '</select>' +
                            '<div class="ajaxerror"></div>' +
                            '</div>';
                        $(this).children('div').eq(1).html(html);

                        var month = '';
                        var day = '';
                        var year = '';
                        var prefix = '';
                        var era = '';

                        /////change text date to date array----
                        if (meta_value_before != '') {
                            var valueArray = meta_value_before.split(" ");
                            var dateString = '';
                            if (valueArray[0].indexOf('/') == -1) {     // '/' does not exist in array, it is the prefix
                                prefix = valueArray[0];
                                dateString = valueArray[1];
                                if (typeof valueArray[2] !== 'undefined') { //does exist
                                    era = valueArray[2];
                                }

                            } else {      // '/' does exit it is the date
                                dateString = valueArray[0];
                                if (typeof valueArray[1] !== 'undefined') { //does exist
                                    era = valueArray[1];
                                }
                            }
                            var dateArray = dateString.split("/");
                            month = dateArray[0];
                            day = dateArray[1];
                            year = dateArray[2];
                            $('#month_select option[value="' + month + '"]').prop('selected', true);
                            $('#day_select option[value="' + day + '"]').prop('selected', true);
                            $('#year_select option[value="' + year + '"]').prop('selected', true);
                            if (prefix != '') {
                                $('#prefix_select option[value="' + prefix + '"]').prop('selected', true);
                            }
                            if (era != '') {
                                $('#era_select option[value="' + era + '"]').prop('selected', true);
                            }
                        }

                    } else if (meta_control_type == 'multi_input') {
                        html = '<div class="kora_control" id="meta_textarea">' +
                            '<table>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td><input type="text" class="kcmtc_additem" name="Input135" id="Input135" value=""></td>' +
                            '<td><input type="button" class="kcmtc_additem" id="multi_input_add" value="Add"></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td rowspan="3">' +
                            '<select id="p123c135" class="kcmtc_curritems fullsizemultitext" name="p123c135[]" multiple="multiple" size="5">';
                        if (meta_value_before != '') {
                            var valueArray = meta_value_before.split("\n");
                            valueArray.pop(); //remove the trailing ''
                            valueArray.forEach(function (tempdata) {
                                html += '<option class="multi_input_option" value="' + tempdata + '" selected>' + tempdata + '</option>';
                            });
                        }
                        html += '</select>' +
                            '</td>' +
                            '<td><input type="button" class="kcmtc_removeitem" id="multi_input_remove" value="Remove"></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><input type="button" class="kcmtc_moveitemup" id="multi_input_up" value="Up"></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><input type="button" class="kcmtc_moveitemdown" id="multi_input_down" value="Down"></td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<div class="ajaxerror"></div>' +
                            '</div>';
                        $(this).children('div').eq(1).html(html);
                        $('#multi_input_add').click(function (e) {
                            var textBar = $('#Input135');
                            var text = textBar.val();
                            html = '<option class="multi_input_option" value="' + text + '" selected>' + text + '</option>';
                            $('#p123c135').append(html);
                            textBar.val('');
                        });
                        $('#multi_input_remove').click(function (e) {
                            var $option = $("#meta_textarea option:selected");
                            if ($option.length == 1) {
                                $option.remove();
                            }
                        });
                        $('#multi_input_up').click(function (e) {
                            var $option = $("#meta_textarea option:selected");
                            if ($option.length == 1 && $option.prev().hasClass('multi_input_option')) {
                                $option.insertBefore($option.prev());
                            }
                        });
                        $('#multi_input_down').click(function (e) {
                            var $option = $("#meta_textarea option:selected");
                            if ($option.length == 1 && $option.next().hasClass('multi_input_option')) {
                                $option.insertAfter($option.next());
                            }
                        });

                    } else if (meta_control_type == 'multi_select') {
                        meta_options = $(this).children('div').eq(1).attr('data-options');
                        html = '<div class="kora_control" id="meta_textarea">' +
                            '<select id="p123c25" class="kcmlc_curritems" name="p123c25[]" multiple="multiple" size="5">' +
                            meta_options +
                            '</select>' +
                            '<div class="ajaxerror"></div>' +
                            '</div>';
                        $(this).children('div').eq(1).html(html);
                        if (meta_value_before != '') {
                            var valueArray = meta_value_before.split("\n");
                            valueArray.pop(); //remove the trailing ''
                            valueArray.forEach(function (tempdata) {
                                $('#meta_textarea option[value="' + tempdata + '"]').prop('selected', true);
                            });
                        }

                    } else if (meta_control_type == 'list') {
                        meta_options = $(this).children('div').eq(1).attr('data-options');
                        html = '<div class="kora_control" id="meta_textarea">' +
                            '<select name="p123c15">' +
                            '<option value="">&nbsp;</option>' +
                            meta_options +
                            '</select></div>';
                        $(this).children('div').eq(1).html(html);
                        if (meta_value_before != '') {
                            $('#meta_textarea option[value="' + meta_value_before + '"]').prop('selected', true);
                        }
                    } else if (meta_control_type == 'associator') {
                        $('#associatorTitle').html('Edit ' + meta_field_name + ' Metadata');
                        $('.associatorModalBackground').show();
                        //add the preloader gif
                        var html = '<img alt="preloader gif" src="' + arcs.baseURL + 'img/arcs-preloader.gif" style="display:block;margin:20px auto 0 auto;" />';
                        $('#associatorSearchObjects').append(html);
                        associator_modal = $('.associatorModalBackground')[0].outerHTML;

                        $.ajax({
                            url: arcs.baseURL + "metadataedits/getAllKidsByScheme",
                            type: "POST",
                            data: {
                                scheme_name: meta_field_name
                            },
                            success: function (data) {
                                associator_full_array = new Array();
                                for (var key in data) {
                                    if (data.hasOwnProperty(key)) {

                                        var obj = data[key];
                                        obj.kid = key;
                                        associator_full_array.push(obj);
                                    }
                                }
                                //console.log(associator_full_array);
                                populateAssociatorCheckboxes();
                            }
                        });

                    }
                    metadataIsSelected = 1;
                }
            })
    });
    $('.associatorSearchSubmit').on('click', function (evt) {
        evt.stopImmediatePropagation();
        //console.log('associator submit clicked');
        meta_new_value = '';
        $('#associatorSearchObjects input:checked').each(function () {
            meta_new_value += $(this).val() + "\n";
        });
        if (meta_new_value != '') {
            meta_new_value = meta_new_value.substring(0, meta_new_value.length - 1);
        }
        addMetadataEdits();

    });

    $('#associatorSearchObjects').on('click', 'label', function (evt) {
        //console.log('clicked label');
        if (meta_field_name == 'Project Associator' || meta_field_name == 'Season Associator') {
            $('#associatorSearchObjects input:checked').each(function () {
                $(this).attr('checked', false);
            });
        }
    });
    $('.modalCloseAssociator').click(function () {
        if (associator_full_array.length > 1000) {
            //needs to reload the page or else it can suffer severe ui lags
            location.reload();
        } else {
            $('#associatorSearchObjects').html('');
            $(".associatorModalBackground").hide();
            $(".save-btn").removeClass("save-btn").text("EDIT").addClass("edit-btn").css("color", '');
            metadataIsSelected = 0;
            editBtnClick = 0;
        }
    });

    function populateAssociatorCheckboxes() {
        //console.log('start associator populate');

        var populateCheckboxes = "<hr>";
        for (i = 0; i < associator_full_array.length; i++) {
            var obj = associator_full_array[i];
            var kid = '';
            var text = '';
            for (var field in obj) {
                if (obj.hasOwnProperty(field) && field != 'pid' && field != 'schemeID' && field != 'linkers') {
                    if (field == 'kid') {
                        kid = obj[field];
                    } else if (field == 'Image Upload') {
                        text += 'Original Name: ' + obj[field]['originalName'] + '<br />';
                    } else {
                        text += field + ': ' + obj[field] + '<br />';
                    }
                }
            }
            populateCheckboxes += "<input type='checkbox' class='checkedboxes' name='associator-item-" + i + "' id='associator-item-" + i + "' value='" + kid + "' />"
                + "<label for='associator-item-" + i + "'><div style='float:left'>" + kid + " </div><div style='float:right'>" + text + "</div></label><br />";

        }
        $('#associatorSearchObjects').html(populateCheckboxes);
        if (meta_value_before != '') {
            var valueArray = meta_value_before.split("\n");
            valueArray.pop(); //remove the trailing ''
            valueArray.forEach(function (tempdata) {
                var label_for = $('#associatorSearchObjects input[value="' + tempdata + '"]').attr('name');
                $("#associatorSearchObjects label[for=" + label_for + "]").trigger('click');
            });
        }
    }

    function associatorSearch() {
        var query = $(".associatorSearchBar").val();
        if (query == '') {
            return;
        }
        for (i = 0; i < associator_full_array.length; i++) {
            var obj = associator_full_array[i];
            if (obj.hasOwnProperty('kid') && obj.kid == query) {
                $('label[for="associator-item-' + i + '"]')[0].scrollIntoView();
            }
        }


    }

    $(document).on("click", ".edit-btn", function () {
        //console.log("edit-btn clicked");
        $('.metadataEdit').css('cursor', 'default');
        if (editBtnClick != 1) {
            $(this).text("SAVE");
            $(this).css({'color': '#0093be'});
            $(this).addClass("save-btn").removeClass("edit-btn");
        }
        editBtnClick = 1;
        $(this).parent().next().find('.metadataEdit').css('cursor', 'pointer');
    });


    $(".level-tab span .save-btn").click(function () {
        //console.log("level tab save btn click");
    });

    $(".soo-click").click(function () {
        //console.log("sso click change");
        $(".save-btn").removeClass("save-btn").text("EDIT").addClass("edit-btn").css("color", '');
        var id = $("#meta_textarea").parent().children("div").eq(0).text();
        var text = $("#meta_textarea").text();
        if (meta_options == '') {
            if (meta_value_before != '' && (meta_control_type == 'multi_input' || meta_control_type == 'multi_select' )) {
                meta_value_before = meta_value_before.replace(/\n+/g, '<br />');
            }
            var fill = '<div id="' + meta_field_name + '" data-control="' + meta_control_type + '">' + meta_value_before + "</div>";
        } else {
            meta_options = meta_options.replace(/["]+/g, '&quot;');
            //console.log(meta_options);
            if (meta_value_before != '' && (meta_control_type == 'multi_input' || meta_control_type == 'multi_select' )) {
                meta_value_before = meta_value_before.replace(/\n+/g, '<br />');
            }
            var fill = '<div id="' + meta_field_name + '" data-control="' + meta_control_type + '" data-options="' + meta_options + '">' + meta_value_before + "</div>";
        }
        $("#meta_textarea").parent().replaceWith(fill);
        metadataIsSelected = 0;
        editBtnClick = 0;
    });

    $(".level-tab").click(function (e) {
        //console.log("clicked thingy");
        //console.log(e);
        $('.metadataEdit').css('cursor', 'default');
        if (e.target.getAttribute("class") == 'save-btn') {
            //console.log("level tab save btn click");
            e.stopPropagation();
            if (metadataIsSelected == 1) {
                $(".save-btn").removeClass("save-btn");
                meta_new_value = '';
                if (meta_control_type == 'text') {
                    meta_new_value = $("#meta_textarea").val();

                } else if (meta_control_type == 'list') {
                    meta_new_value = $("#meta_textarea option:selected").text();

                } else if (meta_control_type == 'date') {
                    var month = '', day = '', year = '';
                    month = $('#month_select option:selected').text();
                    day = $('#day_select option:selected').text();
                    year = $('#year_select option:selected').text();

                    meta_new_value = month + '/' + day + '/' + year + ' CE';

                } else if (meta_control_type == 'terminus') {
                    var month = '', day = '', year = '', prefix = '', era = '';
                    month = $('#month_select option:selected').text();
                    day = $('#day_select option:selected').text();
                    year = $('#year_select option:selected').text();
                    prefix = $('#prefix_select option:selected').text();
                    era = $('#era_select option:selected').text();

                    if (prefix != '') {
                        meta_new_value = prefix + ' ';
                    }
                    meta_new_value += month + '/' + day + '/' + year;

                    if (era != '') {
                        meta_new_value += ' ' + era;
                    }

                } else if (meta_control_type == 'multi_input') {
                    $("#meta_textarea option").each(function () {
                        meta_new_value += $(this).text() + "\n";
                    });
                    if (meta_new_value != '') {
                        meta_new_value = meta_new_value.substring(0, meta_new_value.length - 1);
                    }

                } else if (meta_control_type == 'multi_select') {
                    $("#meta_textarea option:selected").each(function () {
                        meta_new_value += $(this).text() + "\n";
                    });
                    if (meta_new_value != '') {
                        meta_new_value = meta_new_value.substring(0, meta_new_value.length - 1);
                    }

                }
                addMetadataEdits();
            }
            return;
        }
        if (e.target.getAttribute("aria-expanded") == 'true') {
            //console.log("already expanded");
            return;
        }
        $(".save-btn").removeClass("save-btn").text("EDIT").addClass("edit-btn").css("color", '');
        var id = $("#meta_textarea").parent().children("div").eq(0).text();
        var text = $("#meta_textarea").text();
        if (meta_options == '') {
            if (meta_value_before != '' && (meta_control_type == 'multi_input' || meta_control_type == 'multi_select' )) {
                meta_value_before = meta_value_before.replace(/\n+/g, '<br />');
            }
            var fill = '<div id="' + meta_field_name + '" data-control="' + meta_control_type + '">' + meta_value_before + "</div>";
        } else {
            meta_options = meta_options.replace(/["]+/g, '&quot;');
            //console.log(meta_options);
            if (meta_value_before != '' && (meta_control_type == 'multi_input' || meta_control_type == 'multi_select' )) {
                meta_value_before = meta_value_before.replace(/\n+/g, '<br />');
            }
            var fill = '<div id="' + meta_field_name + '" data-control="' + meta_control_type + '" data-options="' + meta_options + '">' + meta_value_before + "</div>";
        }
        $("#meta_textarea").parent().replaceWith(fill);
        metadataIsSelected = 0;
        editBtnClick = 0;
        if ($(this).hasClass("transcriptionTab") && !$(".editTranscriptions").is(":visible") && !$(".editOptions").is(":visible")) $(".editTranscriptions").show();
        if (!$(this).hasClass("transcriptionTab")) {
            $(".editTranscriptions").hide();
            $(".editOptions").hide();
            $(".newTranscriptionForm").hide();
        }
    });

    /*
          Left and right resource buttons right under main picture.
     ****************************************************/

    //left prev resource button
    var prev_view_tested = 0; //test inView only once.
    $('#prev-resource').click(function(){
        //already being animated. just ignore click.
        if( $("#other-resources-container").is(':animated') ){
            return;
        }
        //find the current page
        var currentPage = $('.other-page').find('img').filter(function () { //by border
            return Math.ceil(parseFloat($(this).css('border-width')) ) === 5;
        });
        if( currentPage.length == 0 ){ //if not border, then first page
            currentPage = $('.other-page').find('a:visible').first().find('img');
        }
        currentPage = $(currentPage).parent();
        var inView = isElementInViewport($(currentPage)); //test page is shown
        if( !inView && prev_view_tested == 0 ){ //not shown and not already tested
            prev_view_tested = 1;  //tested
            var slider = $("#other-resources-container");
            var offset = $(slider).scrollLeft()+$(currentPage).position().left-
                ( parseInt($(currentPage).find('img').width())/4
                );
            //animate the current resource into view.
            $(slider).animate({scrollLeft: offset }, 1, function(){
                $('#prev-resource')[0].click(); //continue bottom code later
            });
            return; //wait until animate is finished to continue
        }
        prev_view_tested = 0;  //not tested
        //find the previous page
        var previous = $(currentPage).prev();
        if( previous.length > 0 ){
            var isAnimate = 0; //0 mean normal animate, 1 is resouce change
            if( $(currentPage).attr('id') != $(previous).attr('id') ){ //its a new resource
                var id = '#identifier-'+$(previous).attr('id');
                $(id)[0].click(); // click the new resource
                isAnimate = 1;
                setTimeout(function () { //wait for the pages to update
                    var offset = $(previous).position().left; //update pages bar
                    var slider = $("#other-resources-container");
                    $(slider).animate({scrollLeft: offset }, 1);
                    slider = $(".resource-container-level"); //update resource bar
                    offset = $(slider).scrollLeft() -
                        ( parseInt($(previous).find('img').width()) +
                            parseInt($(previous).find('img').css('margin-left'))*2
                        );
                    $(slider).animate({scrollLeft: offset }, 400, function(){
                        //trigger a resize so the drawer arrows get checked.
                        $(window).trigger('resize');
                    });

                }, 100);
            }
            previous.find('img').click(); //click the new page
            if( isAnimate == 0 ){ //do a normal page animate if its the same resource
                var slider = $("#other-resources-container");
                var offset = $(slider).scrollLeft() -
                    ( parseInt($(previous).find('img').width()) +
                      parseInt($(previous).find('img').css('margin-left'))*2 +
                      parseInt($(previous).find('img').css('border-width'))*2
                    );
                $(slider).animate({scrollLeft: offset }, 200, function(){
                    //trigger a resize so the drawer arrows get checked.
                    $(window).trigger('resize');
                });
            }
        }
    });
    //right next resource button.
    var next_view_tested = 0; //test inView only once.
    $('#next-resource').click(function(){
        if( $("#other-resources-container").is(':animated') ){
            return;
        }
        var currentPage = $('.other-page').find('img').filter(function () {
            return Math.ceil(parseFloat($(this).css('border-width')) ) === 5;
        });
        if( currentPage.length == 0 ){
            currentPage = $('.other-page').find('a:visible').first().find('img');
        }
        currentPage = $(currentPage).parent();
        var inView = isElementInViewport($(currentPage)); //test page is shown
        if( !inView && next_view_tested == 0 ){ //not shown and not already tested
            next_view_tested = 1;  //tested
            var slider = $("#other-resources-container");
            var offset = $(slider).scrollLeft()+$(currentPage).position().left-
                ( parseInt($(currentPage).find('img').width())/4
                );
            //animate the current resource into view.
            $(slider).animate({scrollLeft: offset }, 1, function(){
                $('#next-resource')[0].click(); //continue bottom code later
            });
            return; //wait until animate is finished to continue
        }
        next_view_tested = 0;  //not tested
        var next = $(currentPage).next();
        if( next.length > 0 ){
            var isAnimate = 0;
            if( $(currentPage).attr('id') != $(next).attr('id') ){ //its a new resource
                var id = '#identifier-'+$(next).attr('id');
                $(id)[0].click();
                isAnimate = 1;
                setTimeout(function () {
                    var slider = $("#other-resources-container");
                    $(slider).animate({scrollLeft: 0 }, 1);
                    slider = $(".resource-container-level");
                    var offset = $(slider).scrollLeft() +
                        ( parseInt($(next).find('img').width()) +
                            parseInt($(next).find('img').css('margin-left'))*2
                        );
                    $(slider).animate({scrollLeft: offset }, 400, function(){
                        //trigger a resize so the drawer arrows get checked.
                        $(window).trigger('resize');
                    });

                }, 100);
            }
            next.find('img').click();
            if( isAnimate == 0 ){
                var slider = $("#other-resources-container");
                var offset = $(slider).scrollLeft() +
                    ( parseInt($(next).find('img').width()) +
                      parseInt($(next).find('img').css('margin-left'))*2 +
                      parseInt($(next).find('img').css('border-width'))*2
                    );
                $(slider).animate({scrollLeft: offset }, 200, function(){
                    //trigger a resize so the drawer arrows get checked.
                    $(window).trigger('resize');
                });
            }
        }
    });
    $(".fullscreen-next").click(function () {
       $('#next-resource').trigger("click");
    });
    $(".fullscreen-prev").click(function () {
       $('#prev-resource').trigger("click");
    });
    function isElementInViewport (el) {

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }

    /*
          Multi-resource dynamic accordion. based on new page and resource clicks.
     *********************************************************************************/

    //new page click show/hide the correct metadata
    $('.other-page').find('img').click(function(){  //page click
        //subject of observation stuffs.
        $('.subjects-table').each(function(){  //hide all tables
            $(this).css('display','none');
        });
        $('.soo-li').each(function(){   //hide all radio buttons
            $(this).css('display','none');
        });
        var pageKid = $(this).attr('id');
        var clickedFirst = 0;
        $(".soo-li").each(function(){  //show the matching radio buttons
            if( $(this).attr('data-pageKid').indexOf(pageKid) != -1 ){
                $(this).css('display','list-item');
                if( clickedFirst == 0 ){ //click the page's first soo radio button
                    $(this)[0].click();
                    clickedFirst = 1;
                }
            }
        })
    })
    //soo radio button clicked. change css and show the correct soo table.
    $('.soo-li').click(function () { //soo radio button click
        $('.soo-li').each(function(){  //unclick all radio button css
            $(this).css('background-color','#f9f9f9');
            $(this).css('color','#555555');
        })
        $(this).css('background-color','#0093be'); //click this one button css
        $(this).css('color','#f9f9f9');
        $('.subjects-table').each(function(){  //hide all tables
            $(this).css('display','none');
        });
        var sooKid = $(this).attr('data-sooKid');
        $('.subjects-table[data-kid="'+sooKid+'"]').css('display','table'); //show the correct table
    })
    //new resource clicked. show/hide metadata based on the resource.
    $('.resource-slider').find('a.other-resources').click(function(){
        //display correct project
        var projectKid = $(this).attr('data-projectKid');
        $('.project-table').css('display', 'none');
        $('.project-table[data-kid="'+projectKid+'"]').css('display', 'table');
        //display correct resource
        var resourceKid = $(this).find('img').attr('id');
        resourceKid = resourceKid.split('-');
        resourceKid = resourceKid[1]+'-'+resourceKid[2]+'-'+resourceKid[3];
        $('.archival.objects-table').css('display', 'none');
        $('.archival.objects-table[data-kid="'+resourceKid+'"]').css('display', 'table');
        //find the excavations
        var stringExcavationKids = $('.archival.objects-table[data-kid="'+resourceKid+'"]')
            .find("[id='Excavation - Survey Associator']").html();
        var excavationKids = stringExcavationKids.split('<br>'); //turn into array
        excavationKids.pop(); //remove an empty index
        excavationKids.sort();
        var excavationSeasonAssociators = [];
        setTimeout(function () {//wasn't hiding all if not in this..
            $('.excavation-tab-head').css('display', 'none'); //hide all
            $('.excavation-tab-content').css('display', 'none');
            var firstDrawer = 0;
            var firstDrawer2 = 0;
            for(var i=0;i<excavationKids.length;i++){ //show each excavation
                var excavationHead = $('.excavation-tab-head[data-kid="'+excavationKids[i]+'"]');
                $(excavationHead).css('display', 'block');
                //click the first drawer
                if( firstDrawer == 0 ){
                    firstDrawer =1;
                    if($(excavationHead).attr('aria-selected') == 'false') {
                        $(excavationHead).click();
                    }
                }
                //rename the drawer.
                var text = 'EXCAVATIONS LEVEL '+ (i+1);
                if($('.excavation-tab-head[data-kid="'+excavationKids[i]+'"]').length>0){
                    $('.excavation-tab-head[data-kid="'+excavationKids[i]+'"]')[0].innerText = text;
                }
                //only show the first excavation drawer.
                if($('.excavation-tab-content[data-kid="'+excavationKids[i]+'"]').length>0 ){
                    if( firstDrawer2==0 ) {
                        $('.excavation-tab-content[data-kid="' + excavationKids[i] + '"]').eq(0).css('display', 'block');
                        firstDrawer2 = 1;
                    }
                    var ex = $('.excavation-tab-content[data-kid="'+excavationKids[i]+'"]')
                        .find("[id='Season Associator']").html();
                    ex = ex.replace('<br>', '');
                    //console.log(ex);
                    excavationSeasonAssociators.push(ex);
                }
            }
            //find the season
            var stringSeasonKids = $('.archival.objects-table[data-kid="'+resourceKid+'"]')
                .find("[id='Season Associator']").html();
            var seasonKids = stringSeasonKids.split('<br>'); //turn into array
            seasonKids.pop(); //remove an empty index
            //todo- improve this to hide/show correct seasons**associated through excavation
            $('.Seasons-table').css('display', 'none');
            $('.season-tab-head').css('display', 'none');
            $('.season-tab-content').css('display', 'none');
            var index =1;
            var firstDrawerS = 0;
            $('.Seasons-table').each(function(){
                var season = $(this);
                var sKid = season.attr('data-kid');
                seasonKids.every(function(e){
                    if( e == sKid ){
                        season.css('display', 'table');
                        season.parent().css('display', 'block');
                        season.parent().prev().html('Season Level '+index);
                        season.parent().prev().css('display', 'block');
                        index++;
                        if( firstDrawerS==0 ) {
                            season.parent().prev().click();
                            firstDrawerS = 1;
                        }
                        return false;
                    }
                    return true;
                });
                if( excavationSeasonAssociators.indexOf(sKid) != -1 ){
                    season.css('display', 'table');
                    season.parent().css('display', 'block');
                    season.parent().prev().html('Season Level '+index);
                    season.parent().prev().css('display', 'block');
                    index++;
                    if( firstDrawerS==0 ) {
                        season.parent().prev().click();
                        firstDrawerS = 1;
                    }
                }
            });
        }, 1);

    })

    //javascript to fix the mulit-resource accordion frontend
    accordionCss(); //document ready.
    function accordionCss() {
        $('.excavation-div').height('0px');
        $(window).resize(function () {
            $('.excavation-div').height('0px');
        });
        $('.details').click(function () {
            $('#tabs-1').css('display', 'block');
            $('.metadata-accordion').eq(0).css('display', 'none');
        });
        $('.discussion').click(function () {
            $('#tabs-1').css('display', 'block');
            $('.metadata-accordion').eq(0).css('display', 'none');
        });
        $('.metadata-tab').eq(0).click(function () {
            $('.metadata-accordion').eq(0).css('display', 'block');
        });
    }
});