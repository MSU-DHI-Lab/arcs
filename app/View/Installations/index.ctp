<?=  $this->Html->script("views/installation/keyword.js")  ?>
<?php  echo $this->Html->script("views/installation/installation.js"); ?>
<script src="<?php echo Router::url('/', true); ?>js/vendor/chosen.jquery.js"></script>
<div class="index-body-content">
    <div class="install-welcome-text">
        <h1>Welcome to ARCS!</h1>
        <br>
        <h4>Let's get you set up.</h4>
    </div>
    <div class="start-btn-container">
        <button class="start-install-btn" type="button" name="button">
            <p>Start Installation Configuration</p>
        </button>
    </div>
</div>
