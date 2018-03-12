<div class="kora-body-content">
    <div class="install-progress-bar">
        <ul>
            <li class="current-step">Kora Configuration</li>
            <li class="right-arrow"><img class="arrow-right-icon" src="/<?php echo BASE_URL; ?>img/ArrowRight.svg"></li>
            <li>Field Configuration</li>
            <li class="right-arrow"><img class="arrow-right-icon" src="/<?php echo BASE_URL; ?>img/ArrowRight.svg"></li>
            <li>Create Project</li>
            <li class="right-arrow"><img class="arrow-right-icon" src="/<?php echo BASE_URL; ?>img/ArrowRight.svg"></li>
            <li>ARCS Configuration</li>
        </ul>
    </div>
    <div class="form-container">
        <div class="form-prompt-wrapper">
            <p>
                Enter information about your Kora 3 Installation below. The following information can be found within the Kora 3 .env file. The .env file is located in the root directory of the Kora 3 installation.
            </p>
        </div>
        <div class="form-wrapper">
            <form>
                <div class="row">
                    <div class="input-left">
                        <p>Kora Database Host</p>
                        <input type="text" placeholder="Enter the kora database host url here"/>
                    </div>
                    <div class="input-right">
                        <p>Kora Database Name</p>
                        <input type="text" placeholder="Enter the kora database name here"/>
                    </div>
                </div>
                <div class="row">
                    <div class="input-left">
                        <p>Kora Database Username</p>
                        <input type="text" placeholder="Enter the kora database username here"/>
                    </div>
                    <div class="input-right">
                        <p>Kora Database Password</p>
                        <input type="text" placeholder="Enter the kora database Password here"/>
                    </div>
                </div>
                <div class="row">
                    <div class="input-left">
                        <p>Kora Base URL</p>
                        <input type="text" placeholder="Enter the kora base URL here"/>
                    </div>
                    <div class="input-right">
                        <p>Kora Base Path</p>
                        <input type="text" placeholder="Enter the kora base path here"/>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="cont-btn-container">
        <button onclick="window.location.href= window.location.href.replace('kora', 'field')" class="cont-install-btn" type="button" name="button">
            <p>Continue to Field Configuration</p>
        </button>
    </div>
</div>
