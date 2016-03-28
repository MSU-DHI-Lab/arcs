<div class="viewers-container">

<div class="modalBackground">
	<div class="flagWrap">
		<div id="flagModal">
			<div class="flagModalHeader">NEW FLAG <img src="../app/webroot/assets/img/Close.svg" class="modalClose"></img></div>
			<hr>
			<form id="flagForm" action="/">
				<p class="flagSuccess">Flag submitted successfully.</p>
				<p class="formError reasonError">Select a reason for this flag.</p>
				<select class="formInput" id="flagReason">
				  <option value="">SELECT REASON</option>
				  <option value="incorrect">Incorrect Attribute</option>
				  <option value="spam">Spam</option>
				  <option value="duplicate">Duplicate</option>
				  <option value="other">Other</option>
				</select>
				<p class="formError explanationError">Give an explanation for this flag.</p>
				<textarea class="formInput" id="flagExplanation" placeholder="EXPLAIN REASONING"></textarea>
				
				<button class="flagSubmit" type="submit">CREATE FLAG</button>
			</form>
		</div>
	</div>
</div>

<div id="viewer-left">
	<div id="viewer-tools">
		<div class="container1">
			<h3><?php echo $resource['Title']; ?></h3>
			
			<div class="tools">
				<a href="#">
					<span class="content">
						Annotate
					</span>
					<div class="icon-annotate"></div>
				</a>
				<a id="flag" href="#">
					<span class="content">
						Flag
					</span>
					<div class="icon-flag"></div>
				</a>
				
				<a href="#">
					<span class="content">
						Export
					</span>
					<div class="icon-export"></div>
				</a>
			</div>
		</div>
	</div>
	
	<div id="viewer-window">
		
		<img src="<?php echo $resource['thumb'] ?>" id="PageImage" >
		
	</div>
	
	<div id="resource-tools">
		<div class="resource-tools-container">
			<!-- TO DO: Add onClick events here for each icon -->
            

			<div id="prev-resource">
                <a href="#" >
				<img class="arrow-left-icon" src="../img/ArrowLeft.svg">
                </a>
			</div>
			<div class="annotate-fullscreen-div">
	  			<img class="resources-annotate-icon" src="../img/AnnotationsTooltip.svg">
				<img class="resources-fullscreen-icon" src="../img/Fullscreen.svg">
			</div>
			<div id="zoom-out" class="zoom-out-div">
                <a href="#">
				<img class="resources-zoom-out-icon" src="../img/zoomOut.svg">
                </a>
			</div>
			<div class="zoom-range-div">
	  			<input type="range" min="1" max="10" value="1" step="0.1" class="zoom-bar" id="zoom-range">
			</div>
			<div id="zoom-in" class="zoom-in-div">
                <a href="#">
				<img class="resources-zoom-in-icon" src="../img/ZoomIn.svg">
                </a>
			</div>
			<div class="rotate-div">
				<img class="resources-rotate-icon" src="../img/Rotate.svg">
			</div>
			<div id="next-resource">
                <a href="#" >
				<img class="arrow-right-icon" src="../img/ArrowRight.svg">
                </a>
			</div>
		</div>	
	</div>
</div>

<div id="viewer-right">
	
	<div id="tabs" class="metadata">
		
		<!-- TO DO: Add click events for highlighting the text on the tabs (in Arcs blue) -->
		<ul class="metadata-tabs">
			<li class="metadata-tab"><a href="#tabs-1">Info</a></li>
			<li class="metadata-tab"><a href="#tabs-2">Notations</a></li>
			<li class="metadata-tab"><a href="#tabs-3">Discussions</a></li>
			<li class="metadata-tab"><a href="#tabs-4">Instances</a></li>
		</ul>
		
		<div id="search">
			<span class="title">
				<p>Collection Title</p>
			</span>
			
			<input type="text" placeholder="SEARCH COLLECTION">
		</div>
		
		<div id="tabs-1" class="metadata-content">
			
			<div class="accordion metadata-accordion">
	
				<h3 class="level-tab">Project Level Metadata <div class="icon-edit"></div><span>Edit</span></h3>
				
				<div class="level-content">
					
					<table>
						<tr>
							<td>Name</td>
							<td><?php echo $project['Name'] ?></td>
						</tr>
						
						<tr>
							<td>Country</td>
							<td><?php echo $project['Country'] ?></td>
						</tr>
						
						<tr>
							<td>Region</td>
							<td><?php echo $project['Region'] ?></td>
						</tr>
						
						<tr>
							<td>Geolocation</td>
							<td><?php foreach($project['Geolocation'] as $geolocation) {echo $geolocation."<br>";} ?></td>
						</tr>
						
						<tr>
							<td>Modern Name</td>
							<td><?php echo $project['Modern Name'] ?></td>
						</tr>
						
						<tr>
							<td>Location Identifier</td>
							<td><?php echo $project['Location Identifier'] ?></td>
						</tr>
						
						<tr>
							<td>Location Identifier Scheme</td>
							<td><?php echo $project['Location Identifier Scheme'] ?></td>
						</tr>
						
						<tr>
							<td>Elevation</td>
							<td><?php echo $project['Elevation'] ?></td>
						</tr>
						
						<tr>
							<td>Earliest Date</td>
							<td><?php echo $project['Earliest Date'] ?></td>
						</tr>
						
						<tr>
							<td>Latest Date</td>
							<td><?php echo $project['Latest Date'] ?></td>
						</tr>
						
						<tr>
							<td>Records Archive</td>
							<td><?php echo $project['Records Archive'] ?></td>
						</tr>
						
						<tr>
							<td>Persistent Name</td>
							<td><?php echo $project['Persistent Name'] ?></td>
						</tr>
						
						<tr>
							<td>Complex Title</td>
							<td><?php echo $project['Complex Title'] ?></td>
						</tr>
						
						<tr>
							<td>Terminus Ante Quem</td>
							<td><?php echo $project['Terminus Ante Quem'] ?></td>
						</tr>
						
						<tr>
							<td>Terminus Post Quem</td>
							<td><?php echo $project['Terminus Post Quem'] ?></td>
						</tr>
						
						<tr>
							<td>Period</td>
							<td><?php echo $project['Period'] ?></td>
						</tr>
						
						<tr>
							<td>Archaeological Culture</td>
							<td><?php echo $project['Archaeological Culture'] ?></td>
						</tr>
						
						<tr>
							<td>Description</td>
							<td><?php echo $project['Description'] ?></td>
						</tr>
						
						<tr>
							<td>Brief Description</td>
							<td><?php echo $project['Brief Description'] ?></td>
						</tr>
						
						<tr>
							<td>Permitting Heritage Body</td>
							<td><?php echo $project['Permitting Heritage Body'] ?></td>
						</tr>
					</table>
					
				</div>
				
				<h3 class="level-tab">Season Level Metadata <div class="icon-edit"></div><span>Edit</span></h3>
				
				<div class="level-content">
						
					<?php if($season['Title'] != "") { ?>
									
						<table>
							<tr>
								<td>Title</td>
								<td><?php echo $season['Title'] ?></td>
							</tr>
											<tr>
												<td>Type</td>
												<td><?php echo $season['Type'] ?></td>
											</tr>
											<tr>
												<td>Director</td>
												<td><?php echo $season['Director'] ?></td>
											</tr>
											<tr>
												<td>Registrar</td>
												<td><?php echo $season['Registrar'] ?></td>
											</tr>
											<tr>
												<td>Sponsor</td>
												<td><?php echo $season['Sponsor'] ?></td>
											</tr>
											<tr>
												<td>Earliest Date</td>
												<td><?php if ($season['Earliest Date']['year']) {echo $season['Earliest Date']['year'] . "/" . $season['Earliest Date']['month'] . "/" . $season['Earliest Date']['day'];} ?></td>
											</tr>
											<tr>
												<td>Latest Date</td>
												<td><?php if ($season['Latest Date']['year']) {echo $season['Latest Date']['year'] . "/" . $season['Latest Date']['month'] . "/" . $season['Latest Date']['day'];} ?></td>
											</tr>
											<tr>
												<td>Terminus Ante Quem</td>
												<td><?php echo $season['Terminus Ante Quem'] ?></td>
											</tr>
											<tr>
												<td>Terminus Post Quem</td>
												<td><?php echo $season['Terminus Post Quem'] ?></td>
											</tr>
											<tr>
												<td>Description</td>
												<td><?php echo $season['Description'] ?></td>
											</tr>
											<tr>
												<td>Contributor</td>
												<td><?php echo $season['Contributor'] ?></td>
											</tr>
											<tr>
												<td>Contributor Role</td>
												<td><?php echo $season['Contributor Role'] ?></td>
											</tr>
											<tr>
												<td>Contributor</td>
												<td><?php echo $season['Contributor 2'] ?></td>
											</tr>
											<tr>
												<td>Contributor Role</td>
												<td><?php echo $season['Contributor Role 2'] ?></td>
											</tr>
											<tr>
												<td>Contributor</td>
												<td><?php echo $season['Contributor 3'] ?></td>
											</tr>
											<tr>
												<td>Contributor Role</td>
												<td><?php echo $season['Contributor Role 3'] ?></td>
											</tr>
											<tr>
												<td>Contributor</td>
												<td><?php echo $season['Contributor 4'] ?></td>
											</tr>
											<tr>
												<td>Contributor Role</td>
												<td><?php echo $season['Contributor Role 4'] ?></td>
											</tr>
											<tr>
												<td>Contributor</td>
												<td><?php echo $season['Contributor 5'] ?></td>
											</tr>
											<tr>
												<td>Contributor Role</td>
												<td><?php echo $season['Contributor Role 5'] ?></td>
											</tr>
											<tr>
												<td>Contributor</td>
												<td><?php echo $season['Contributor 6'] ?></td>
											</tr>
											<tr>
												<td>Contributor Role</td>
												<td><?php echo $season['Contributor Role 6'] ?></td>
											</tr>
											<tr>
												<td>Contributor</td>
												<td><?php echo $season['Contributor 7'] ?></td>
											</tr>
											<tr>
												<td>Contributor Role</td>
												<td><?php echo $season['Contributor Role 7'] ?></td>
											</tr>
											<tr>
												<td>Contributor</td>
												<td><?php echo $season['Contributor 8'] ?></td>
											</tr>
											<tr>
												<td>Contributor Role</td>
												<td><?php echo $season['Contributor Role 8'] ?></td>
											</tr>
										
									</table>
							
								<?php } else { ?> 
								<div class="no-data">
									This is a dig find, which doesn’t have associated season metadata.
								</div>				
							<?php } ?> 
				</div>
				
				<h3 class="level-tab">Excavation/Survey Level Metadata <div class="icon-edit"></div><span>Edit</span></h3>
				
				<div class="level-content">
				
					<div id="tabs-1" class="metadata-content">
					
						<div class="accordion metadata-accordion">
							
							<?php if(count($surveys) > 0) { ?>
									<?php $count=0; ?>
									<?php foreach($surveys as $survey) { $count++; ?>		
							
								<h3 class="level-tab smaller">Excavation/Survey Level Metadata Section <?php echo $count ?></h3>	
								
									<div class="level-content auto-height">
									
										<table>
											<tr>
												<td>Name</td>
												<td><?php echo $survey['Name'] ?></td>
											</tr>
											<tr>
												<td>Type</td>
												<td><?php echo $survey['Type'] ?></td>
											</tr>
											<tr>
												<td>Supervisor</td>
												<td><?php echo $survey['Supervisor'] ?></td>
											</tr>
											<tr>
												<td>Earliest Date</td>
												<td><?php if ($survey['Earliest Date']['year']) {echo $survey['Earliest Date']['year'] . "/" . $survey['Earliest Date']['month'] . "/" . $survey['Earliest Date']['day'];} ?></td>
											</tr>
											<tr>
												<td>Latest Date</td>
												<td><?php if ($survey['Latest Date']['year']) {echo $survey['Latest Date']['year'] . "/" . $survey['Latest Date']['month'] . "/" . $survey['Latest Date']['day'];} ?></td>
											</tr>
											<tr>
												<td>Terminus Ante Quem</td>
												<td><?php echo $survey['Terminus Ante Quem'] ?></td>
											</tr>
											<tr>
												<td>Terminus Post Quem</td>
												<td><?php echo $survey['Terminus Post Quem'] ?></td>
											</tr>
											<tr>
												<td>Excavation Stratigraphy</td>
												<td><?php echo $survey['Excavation Stratigraphy'] ?></td>
											</tr>
											<tr>
												<td>Survey Conditions</td>
												<td><?php echo $survey['Survey Conditions'] ?></td>
											</tr>
											<tr>
												<td>Post Dispositional Transformation</td>
												<td><?php echo $survey['Post Dispositional Transformation'] ?></td>
											</tr>
											<tr>
												<td>Legacy</td>
												<td><?php echo $survey['Legacy'] ?></td>
											</tr>
																					
											</table>
									</div>
											
							<?php } ?>
							<?php } else { ?> 
								<div class="no-data">
									This is a surface find, which doesn’t have associated excavation metadata.
								</div>				
							<?php } ?> 
						
						</div>
						
					</div>	
					
				</div>
				
				<h3 class="level-tab">Archival Object Level Metadata <div class="icon-edit"></div><span>Edit</span></h3>
				
				<div class="level-content">
					
					<table>
						<tr>
							<td>Resource Identifier</td>
							<td><?php echo $resource['Resource Identifier']; ?></td>
						</tr>
						
						<tr>
							<td>Type</td>
							<td><?php echo $resource['Type']; ?></td>
						</tr>
						
						<tr>
							<td>Tile</td>
							<td><?php echo $resource['Title']; ?></td>
						</tr>
						
						<?php if ($resource['Sub-title'] != null) {?>
						<tr>
							<td>Sub-Tile</td>
							<td><?php echo $resource['Sub-Tile']; ?></td>
						</tr>
						<?php } ?>
						
						<tr>
							<td>Creator</td>
							<td><?php foreach($resource['Creator'] as $creator) {echo $creator.'<br>'; } ?></td>
						</tr>
						
						<tr>
							<td>Role</td>
							<td><?php foreach($resource['Role'] as $role) {echo $role.'<br>'; } ?></td>
						</tr>
						
						<tr>
							<td>Earliest Date</td>
							<td><?php if ($resource['Earliest Date']['year']) {echo $resource['Earliest Date']['year'] . "/" . $resource['Earliest Date']['month'] . "/" . $resource['Earliest Date']['day'];} ?></td>
						</tr>
						
						<tr>
							<td>Date Range</td>
							<td><?php echo $resource['Date Range']; ?></td>
						</tr>
						
						<tr>
							<td>Description</td>
							<td><?php echo $resource['Description']; ?></td>
						</tr>
						
						<tr>
							<td>Pages</td>
							<td><?php echo $resource['Pages']; ?></td>
						</tr>
						
						<tr>
							<td>Condition</td>
							<td><?php echo $resource['Condition']; ?></td>
						</tr>
						
						<tr>
							<td>Access Level</td>
							<td><?php echo $resource['Access Level']; ?></td>
						</tr>
						
						<tr>
							<td>Accession Number</td>
							<td><?php echo $resource['Accession Number']; ?></td>
						</tr>
					</table>
					
				</div>
				
				
				
					<h3 class="level-tab">Subject of Observation<div class="icon-edit"></div><span>Edit</span></h3>
				
				<div class="level-content">
				
					<div id="tabs-1" class="metadata-content">
					
						<div class="accordion metadata-accordion">
							
							<?php if(count($subject) > 0) { ?>
									<?php $count=0; ?>
									<?php foreach($subject as $subjects) { $count++; ?>		
							
								<h3 class="level-tab smaller">Subject of Observation Section <?php echo $count ?></h3>	
								
									<div class="level-content auto-height">
									
										<table>
											<tr>
												<td>Pages Associator</td>
												<td><?php echo $subjects['Pages Associator'] ?></td>
											</tr>
											<tr>
												<td>Resource Identifier</td>
												<td><?php echo $subjects['Resource Identifier'] ?></td>
											</tr>
											<tr>
												<td>Subject of Observation Associator</td>
												<td><?php echo $subjects['Subject of Observation Associator'] ?></td>
											</tr>
											<tr>
												<td>Artifact - Structure Classification</td>
												<td><?php echo $subjects['Artifact - Structure Classification'] ?></td>
											</tr>
											<tr>
												<td>Artifact - Structure Type</td>
												<td><?php echo $subjects['Artifact - Structure Type'] ?></td>
											</tr>
											<tr>
												<td>Artifact - Structure Terminus Ante Quem</td>
												<td><?php echo $subjects['Artifact - Structure Terminus Ante Quem'] ?></td>
											</tr>
											<tr>
												<td>Artifact - Structure Terminus Post Quem</td>
												<td><?php echo $subjects['Artifact - Structure Terminus Post Quem'] ?></td>
											</tr>
											<tr>
												<td>Artifact - Structure Title</td>
												<td><?php echo $subjects['Artifact - Structure title'] ?></td>
											</tr>
											<tr>
												<td>Artifact - Structure Geolocation</td>
												<td><?php echo $subjects['Artifact - Structure Geolocation'] ?></td>
											</tr>
											<tr>
												<td>Artifact - Structure Excavation Unit</td>
												<td><?php echo $subjects['Artifact - Structure Excavation Unit'] ?></td>
											</tr>
											<tr>
												<td>Artifact - Structure Description</td>
												<td><?php echo $subjects['Artifact - Structure Description'] ?></td>
											</tr>
											<tr>
												<td>Artifact - Structure Location</td>
												<td><?php echo $subjects['Artifact - Structure Location'] ?></td>
											</tr>
																					
											</table>
									</div>
											
							<?php } ?>
							<?php } else { ?> 
								<div class="no-data">
									This resource doesn’t have associated SOO data.
								</div>				
							<?php } ?> 
						
						</div>
						
					</div>	
					
				</div>
				
				
				
				<!-- <h3 class="level-tab">Subject of Observation<div class="icon-edit"></div><span>Edit</span></h3>
				
				<div class="level-content">	
					<div class="no-data">
						<?php foreach($subject as $subjects) {echo $subjects['Resource Identifier'].'<br>'; } ?>
					</div>	
				</div> -->
				
			</div>
			
		</div>
		
		<div id="tabs-2" class="metadata-content">
			
			<p>Notations</p>
			
		</div>
		
		<div id="tabs-3" class="metadata-content">
			
			<p>Discussions</p>
			
		</div>
		
		<div id="tabs-4" class="metadata-content">
			
			<p>Instances</p>
			
		</div>
		
	</div>	
		
</div>
</div>

<div id="resources-nav">
    <div id="button-left">
        <a href="#" id="left-button">
            <img src="/~wyatt.roehler/arcs/img/Arrow-White.svg" height="220px" width="50px"/>
        </a>
    </div>
    <div id="other-resources-container">
    <div id="other-resources" style="min-width: <?php $length = 220*count($pages); echo "$length";?>px">
        <?php foreach($pages as $r): ?>
            <a href="#" onclick="GetNewResource(<?php echo "'".$r['kid']."'"?>)">
            <img class="other-resource"
                 src="<?php echo $r['thumb'] ?>" height="200px" width="200px"/>
            </a>
        <?php endforeach ?>
    </div>
    </div>
    <div id="button-right">
        <a href="#" id="right-button">
            <img src="/~wyatt.roehler/arcs/img/Arrow-White.svg" height="220px" width="50px"/>
        </a>
    </div>
</div>

<script>
    $(document).ready(function() {
        var $item = $('#other-resources a'),
            index = 0, //Starting index
            current = 0,
            keys = <?php echo json_encode(array_keys($pages)); ?>,
            visible = 3,
            shift = visible * 220,
            anim = {},
            value = "",
            endIndex = <?php $length = count($pages); echo "$length";?> / visible -1;
        
        $('#button-right').click(function(){
            event.preventDefault();
            if(index < endIndex ){
                if(index == 0){
                    $('#button-left').css('display', 'block');
                    $('#other-resources-container').css('width', '90%');
                }
                index++;
                visible = 3;
                shift = visible * 220;
                value = "-=" + shift + "px";
                anim['left'] = value;
                $item.animate(anim, "fast");
            }
        });
        
        $('#button-left').click(function(){
            event.preventDefault();
            if(index > 0){
                index--; 
                if(index == 0){
                    $('#button-left').css('display', 'none');
                    $('#other-resources-container').css('width', '95%');
                }
                visible = 3;
                shift = (visible) * 220;
                value = "+=" + shift + "px";
                anim['left'] = value;
                $item.animate(anim, "fast");
            }
        });
        
        $('#prev-resource').click(function(){
            event.preventDefault();
            if(current > 0){
                current--; 
                var kid = keys[current];
                GetNewResource(kid);
            }
        });
        
        $('#next-resource').click(function(){
            event.preventDefault();
            if(current < keys.length-1){
                current++; 
                var kid = keys[current];
                GetNewResource(kid);
            }
        });
        
        $('#zoom-out').click(function(){
            event.preventDefault();
            var zoomrange = document.getElementById("zoom-range");
            var image = document.getElementById("PageImage");
            var zoom, ratio;
            if(zoomrange.value > 1){
                zoomrange.value -= 1;
                zoom = zoomrange.value;
                zoomratio = 10/(11-zoom);
                image.style.transform = "scale(" + zoomratio + ")";
            }
            
            console.log(zoomrange.value);
        });
        
        $('#zoom-in').click(function(){
            event.preventDefault();
            var zoomrange = document.getElementById("zoom-range");
            var image = document.getElementById("PageImage");
            var zoom;
            if(zoomrange.value < 10){
                zoom = zoomrange.value;
                zoom = Number(zoom) + Number(1); 
                zoomrange.value = zoom;
                zoomratio = 10/(11-zoom);
                image.style.transform = "scale(" + zoomratio + ")";
            }
            
            console.log(zoomrange.value);
        });
    });
</script>

<script>
	var kid = "<?php echo $kid; ?>";
	function GetNewResource(id) {
	  	image = document.getElementById('PageImage')
	  	image.src = '../img/arcs-preloader.gif';
	  	image.style.height = '100%';
	  	image.style.width = '100%';
	  	setTimeout(function(){
		    console.log("See the loader? I'm waiting.");
		}, 10000);
		return $.ajax({
		  url: "<?php echo Router::url('/', true); ?>resources/loadNewResource/"+id,
		  type: 'GET',
		  success: function(res) {
			//document.getElementById('PageImage').src = res;
			res = JSON.parse(res);
			kid = res['kid'];
			//console.log(res['kid']);
			document.getElementById('PageImage').src = "<?php echo $kora_url; ?>"+res['Image Upload']['localName'];
		  }
		});
	}
</script>

<!-- Give the resource array to the client-side code -->
<script>
	$(function() {
		$( "#tabs" ).tabs();
	});
	
	$(function() {
		$( ".accordion" ).accordion({
			heightStyle: "fill"
		});
	});
		
	$( '.metadata-accordion' ).height( $( '#viewer-window' ).height() );
	
	$( window ).resize(function() {
		( '.metadata-accordion' ).height( $( '#viewer-window' ).height() );
	});
		
	$(function() {
		$( "#flag" ).click(function(){
			$( ".modalBackground" ).show();
		});
		
		$( ".modalClose" ).click(function(){
			$( ".modalBackground" ).hide();
		});
		
		$( "#flagForm" ).submit(function( event ) {
 
			// Stop form from submitting normally
			event.preventDefault();
			
			$(".flagSuccess").hide();
			
			if ($("#flagReason").val() == '') {
				$(".reasonError").show();
			} else {
				$(".reasonError").hide();
			}
			
			if ($("#flagExplanation").val() == '') {
				$(".explanationError").show();
			} else {
				$(".explanationError").hide();
			}
			
			if ($("#flagReason").val() != '' && $("#flagExplanation").val() != '') {
				var formdata = {
					kid: kid,
					resource_kid: "<?php echo $resource['kid']; ?>",
					resource_name: "<?php echo $resource['Resource Identifier']; ?>",
					reason: $("#flagReason").val(),
					explanation: $("#flagExplanation").val(),
					status: "pending"				
				}
								
				$.ajax({
					url: "<?php echo Router::url('/', true); ?>resources/flags/add",
					type: "POST",
					data: formdata,
					statusCode: {
						201: function() {
							$("#flagReason").val('');
							$("#flagExplanation").val('');
							$(".flagSuccess").show();
						}
					}
					
				});
			}
		});
	});
</script>
