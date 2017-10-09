<?php
App::uses('MetaResourcesController', 'Controller');
//App::uses('ResourcesController', 'Controller');
/**
 * Annotations controller.
 *
 * @package    ARCS
 * @link       http://github.com/calmsu/arcs
 * @copyright  Copyright 2012, Michigan State University Board of Trustees
 * @license    BSD License (http://www.opensource.org/licenses/bsd-license.php)
 */
class AnnotationsController extends MetaResourcesController {
    public $name = 'Annotations';
    public $uses = array('Annotation', 'Mapping', 'User');//, 'Mapping');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow(
            'findByKid', 'findallbyuser'
        );
    }

    //Find all annotations associated with user id
	public function findAllByUser(){
		$model = $this->modelClass;
		$results = $this->$model->find('all', array(
            'order' => 'Annotation.created DESC',
			'conditions' => array('user_id' => $this->request->data['id'])
		));
		$this->json(200, $results);
	}

	//find all annotations and transcriptions along with related data based on a page_kid
    public function findByKid(){
        $model = $this->modelClass;
        App::import('Controller', 'Search'); // mention at top

        $return = array(
            'authenticated' => array(),
            'admin' => false,
            'resource_data' => array(),
            'annotationData' => array(
                'incoming' => array(),
                'outgoing' => array(),
                'url' => array(),
                'transcription' => array()
            )
        );
	    $user_id = $this->Auth->user('id');
        $results = $this->$model->find('all', array(
            'conditions' => array('page_kid' => $this->request->data['kid'])
        ));
        if( !empty($results) && $user_id != null ){
            $pName = parent::convertKIDtoProjectName($results[0]['page_kid']);
            $projectPid = parent::getPIDFromProjectName($pName);
            $mappings = $this->Mapping->find('all', array(
                'fields' => array('Mapping.pid'),
                'conditions' => array(
                    'AND' => array(
                        'Mapping.id_user' => $user_id,
                        'Mapping.status' => 'confirmed',
                        'Mapping.role' => 'Admin',
                        'Mapping.pid' => $projectPid
                    ),
                )
            ));
            if( !empty($mappings) ){
                $return['admin'] = true;
            }
        }
        $resourceCtrl = new SearchController;
        foreach( $results as $result ){
            if( $result['transcript']!=="" && $result['transcript']!==null ){
                array_push( $return['annotationData']['transcription'], $result );
            }elseif( $result['url']!=="" && $result['url']!==null ){
                array_push( $return['annotationData']['url'], $result );
            }elseif( $result['incoming'] === 'true' ){
                array_push( $return['annotationData']['incoming'], $result );
            }else{
                array_push( $return['annotationData']['outgoing'], $result );
            }
            if( $result['user_id'] == $user_id ){
                array_push( $return['authenticated'], $result['id']);
            }
            if( isset($result['relation_page_kid']) && $result['relation_page_kid'] != "" ) {
                $page = $result['relation_page_kid'];
                $tempData = array(
                    'q' => array(array('kid', '=', $page)),
                    'pid' => $page,
                    'sid' => 'page'
                );
                $resource = $resourceCtrl->advanced_resources($tempData);
                $return['resource_data'][$result['id']] = $resource;
            }
        }
	    echo json_encode($return);
	    die;
    }
}
