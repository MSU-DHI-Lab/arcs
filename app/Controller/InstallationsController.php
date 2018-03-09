<?php
/**
 * Installation Controller
 *
 * @package    ARCS
 * @link       http://github.com/calmsu/arcs
 * @copyright  Copyright 2012, Michigan State University Board of Trustees
 * @license    BSD License (http://www.opensource.org/licenses/bsd-license.php)
 */
class InstallationsController extends AppController {
	public $name = 'Installations';

	public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('display');
    }


	public function register() {
	        echo 'got to display';
	          $this->set(array(
	            'title_for_layout' => 'index'
	        ));
	        $this->set("test", 'hi noah');
	        $this->render("register");
	    }


    /**
     * Displays the installation page
     *
     *
     * @return void
     */
	public function display() {
	  	$this->set(array(
	    	'title_for_layout' => 'index'
	    ));
		$this->render("index");
	}

}
