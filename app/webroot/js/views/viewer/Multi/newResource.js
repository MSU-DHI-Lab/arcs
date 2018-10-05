var waitingId = 0;
var waits = [];
var _NewResource = {};
function GetNewResource(id) {
    image = document.getElementById('PageImage');
	if( $(image).hasClass('multiInfo') ){
		return;
	}
    if(id == null) {
        return;
    }
    else if(id.includes("default-page")) {
        // if there are no pages, and the id contains default-page then set image to default resource
        image.src = '/' + BASE_URL + 'img/DefaultResourceImage.svg';
        var resourceKid = id.replace('-default-page', '');
        $('#missingPictureIcon').attr('data-kid', resourceKid);
        $('#missingPictureIcon').css('display', 'block');
    }else {
        $('#missingPictureIcon').css('display', 'none');
        $(image).css('display', 'none');
        $('#PageImagePreloader').css('display', 'flex');
        waitingId++;
		
		console.log('new resource ajax call', id);

        var hideDrawer = true;

		for( var resind in RESOURCES ){
			for( var kid in RESOURCES[resind]['page'] ){
				if( kid == id ){
					var pagePid = getPidFromKid(kid);
                    var pageSid = getSidFromKid(kid);
					var res = RESOURCES[resind]['page'][kid];

                    // check if we have multiple pages
                    if (hideDrawer){
                        var numPages = Object.keys(RESOURCES[resind]['page']).length;
                        if (numPages > 1){
                            hideDrawer = false
                        }
                    }

                    ///FULL SCREEN IMAGE CHANGED HERE
                    if (typeof(res["Image_Upload"]) === 'undefined'){
                        res["Image_Upload"] =  {'localName': arcs.baseURL+'img/DefaultResourceImage.svg'};
                        $('#missingPictureIcon').css('display', 'block');
                        $(image).attr('src', res['Image_Upload']['localName']);
                        $('#PageImagePreloader').css('display', 'none');
                        $(image).css('display', 'block');

                        var fullImage = document.getElementById('fullscreenImage');
                        var imgUrl = res['Image_Upload']['localName'];
                        fullImage.src = imgUrl;
                    }
                    else{
                        $(image).attr('src', KORA_FILES_URI+"p"+pagePid+"/f"+pageSid+"/"+res['Image_Upload']['localName']);
                        $('#PageImagePreloader').css('display', 'none');

                        $(image).css('display', 'block');

                        var fullImage = document.getElementById('fullscreenImage');
                        var imgUrl = KORA_FILES_URI+"p"+pagePid+"/f"+pageSid+"/"+res['Image_Upload']['localName'];

                        fullImage.src = imgUrl;
                    }
				}
			}
		}
        // hide drawer if there are no multi-page resources
        if (hideDrawer){
            $('#resources-nav').hide();
        }else{
            $('#resources-nav').show();
        }
    }
}

_NewResource.DeselectCSS = function(element){
  $(element).find(".numberOverResources").css({background :"black"});
  $(element).find("img").css("borderWidth","0px");
  $(element).css({opacity: ".6"});
}

_NewResource.SelectCSS = function(element){
  $(element).find("img").css("borderWidth","5px");
  $(element).find(".numberOverResources").css({background :"#0094BC"});
  $(element).css({opacity: "1"});
}

function pageSelectBuild(firstid) {
  var $item = $('#other-resources a'),
      $pics = $('#other-resources a img'),
      index = 0, //Starting index
      current = 0,
      $selected = $('#other-resources a .numberOverResources'),
      keys = JSON_KEYS;

  for(var i=0; i <$pics.length; i++){
    if (i < firstid) {
      continue;
    }
    $pics[i].style.borderColor = "#0094BC";
    $pics[i].style.borderStyle = "solid";
    $item[i].onclick = createFunc(i);
  }

  if( typeof $pics[0] !== 'undefined' ) {
      $pics[0].style.borderWidth = "5px";
  }

  function createFunc(i){
    return function(event){
    event.preventDefault();
    var container = $(this).parent().parent().attr("class");
    var selected = $(this).find(".numberOverResources").html();
    if(container == "page-slider"){
      $(".other-page").find(".other-resources").each(function(){
        var page = $(this).find(".numberOverResources").html();
        if(page ==  selected){
          _NewResource.SelectCSS(this);
        }
        else {
          _NewResource.DeselectCSS(this);
        }
      });
    }
    else{
    $(".resource-container-level").find(".other-resources").each(function(){
        var resource = $(this).find(".numberOverResources").html();
          if(resource ==  selected){
            _NewResource.SelectCSS(this);
          }
          else {
            _NewResource.DeselectCSS(this);
          }
      });
    }

    current = i;
    var kid = keys[current];
    GetNewResource(kid);
    }

  }
}

// other resources
$(document).ready(function () {
    var $item = $('#other-resources a'),
            $pics = $('#other-resources a img'),
            index = 0, //Starting index
            current = 0,
    $selected = $('#other-resources a .numberOverResources'),
            keys = JSON_KEYS,
    visible = 2.96969696969696, //worked better than 3
    shift = visible * 220,
    anim = {},
    value = "",
    oldzoom = 1,
    endIndex =
    LEN / visible -1;

    pageSelectBuild(0);

    // for(var i=0; i <$pics.length; i++){
    //     $pics[i].style.borderColor = "#0094BC";
    //     $pics[i].style.borderStyle = "solid";
    //     $item[i].onclick = createFunc(i);
    // }
    //
    // $pics[0].style.borderWidth = "5px";
    //
    // function createFunc(i){
    //     return function(event){
    //     event.preventDefault();
    //     var container = $(this).parent().parent().attr("class");
    //     var selected = $(this).find(".numberOverResources").html();
    //     if(container == "page-slider"){
    //       $(".other-page").find(".other-resources").each(function(){
    //         var page = $(this).find(".numberOverResources").html();
    //         if(page ==  selected){
    //           _NewResource.SelectCSS(this);
    //         }
    //         else {
    //           _NewResource.DeselectCSS(this);
    //         }
    //       });
    //     }
    //     else{
    //     $(".resource-container-level").find(".other-resources").each(function(){
    //         var resource = $(this).find(".numberOverResources").html();
    //           if(resource ==  selected){
    //             _NewResource.SelectCSS(this);
    //           }
    //           else {
    //             _NewResource.DeselectCSS(this);
    //           }
    //       });
    //     }
    //     current = i;
    //     var kid = keys[current];
    //     GetNewResource(kid);
    //   }
    // }

    $('#zoom-out').click(function(event){
        event.preventDefault();
        var zoomrange = document.getElementById("zoom-range");
        var image = document.getElementById("PageImage");
        var canvas = $('.canvas');
        var wrapper = document.getElementById("ImageWrapper");
        var zoom, ratio;
        if(zoomrange.value > 1){
            zoomrange.value -= 1;
            zoom = zoomrange.value;
            zoomratio = 10/(11-zoom);
            canvas.css("transform" , "scale(" + zoomratio + ")");
            image.style.transform = "scale(" + zoomratio + ")";
            image.style.left = "0px";
            image.style.top = "0px";
        }

    });

    $('#zoom-in').click(function(event){
        event.preventDefault();
        var zoomrange = document.getElementById("zoom-range");
        var canvas = document.getElementById("canvas");
        var image = document.getElementById("PageImage");
        var zoom;
        if(zoomrange.value < 10){
            zoom = zoomrange.value;
            zoom = Number(zoom) + Number(1);
            zoomrange.value = zoom;
            zoomratio = 10/(11-zoom);
            canvas.style.transform = "scale(" + zoomratio + ")";
            image.style.transform = "scale(" + zoomratio + ")";
        }

    });

    $('#zoom-range').on('change', function(event){
        event.preventDefault();
        var zoomrange = document.getElementById("zoom-range");
        var canvas = $('.canvas');
        var image = document.getElementById("PageImage");
        var zoom;

        zoom = zoomrange.value;

        if(oldzoom > zoom){
            image.style.left = "0px";
            image.style.top = "0px";
        }

        oldzoom = zoom;
        zoomratio = 10/(11-zoom);
        canvas.css("transform" , "scale(" + zoomratio + ")");
        image.style.transform = "scale(" + zoomratio + ")";

    });

    var jq = document.createElement('script');
    jq.src = "//code.jquery.com/ui/1.11.4/jquery-ui.js";
    document.querySelector('head').appendChild(jq);

    jq.onload = drag;

    function drag(){
        $("#ImageWrap").draggable();
    }
    _resource.selectResource(1);
});
