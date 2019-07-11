<?php
//NOTE: This version is used if you wish to copy this file onto a different server than your Kora 3 Installation.
//      You will need to configure the SITE VARIABLES to use!
//THIS TOOL IS PRIMARILY (see first class for exception) THE CONVERTER FUNCTION FOR USING OLD KORA 2 KORA_Search AND KORA_Clause FUNCTIONS
//THIS WORKS IF YOU HAVE USED EITHER Exodus OR THE K2 Importer TOOLS TO MIGRATE YOUR KORA 2 DATA
//Step 1
////Change your php includes of koraSearch.php from K2 to point at this file
////(Because this remote file is independent, we can ignore this step) In your file, use the namespace tag "namespace App\FieldHelpers"
//Step 2
////Replace your token, pid, and sid with a new search token, a k3 pid, and fid
//Step 3
////You do not need to update field names, unless you manually changed the nickname in Kora 3 or you want KID clause to search for the "legacy_kid"
////Leave the original control names in your koraSearch, but the k3 nickname should be {K2 control name with underscores not spaces}_{pid}_{fid}_
//Step 4
////If you are pointing to a K3 installation that needs http auth, as the 9th variable of KORA_Search, place an
////array in the format ["user"=>"{your_username}", "pass"=>"{your_password}"]
//This class has a bunch of functions that can help build the json required for a form to search with the API. NOTE: This
//can be used separately from it's use in the koraSearch conversion.
/**
 * SITE VARIABLES - Fill these out to use remotely
 * @var string - Kora 3 API URL
 */
//define("kora3ApiURL","FILL_THIS"); //"http://www.myKora3Install.com/api/search"
class kora3ApiExternalTool {
    /*
    |--------------------------------------------------------------------------
    | Kora 3 Api External Tool
    |--------------------------------------------------------------------------
    |
    | This class helps generate the query string for the forms variable in the
    | RESTful API for Kora3
    |
    */
    /**
     * Builds the query string for a keyword search.
     *
     * @param  string $keyString - Keywords for the search
     * @param  string $method - Defines if search is AND, OR, or EXACT
     * @param  bool $not - Get the negative results of the search
     * @param  array $flids - Specific fields to search in
     * @return array - The query array
     */
    static function keywordQueryBuilder($keyString,$method,$not=false,$flids=array()) {
        $qkey = array();
        $qkey["search"] = "keyword";
        $qkey["keys"] = $keyString;
        $qkey["method"] = $method;
        if($not)
            $qkey["not"] = $not;
        if(!empty($flids))
            $qkey["fields"] = $flids;
        return $qkey;
    }
    /**
     * Builds the query string for a KID search.
     *
     * @param  array $kids - KIDs we are searching for
     * @param  bool $not - Get the negative results of the search
     * @param  bool $legacy - Search for legacy kid instead
     * @return array - The query array
     */
    static function kidQueryBuilder($kids,$not=false,$legacy=false) {
        $qkid = array();
        if(!$legacy)
            $qkid["search"] = "kid";
        else
            $qkid["search"] = "legacy_kid";
        $qkid["kids"] = $kids;
        if($not)
            $qkid["not"] = $not;
        return $qkid;
    }
    /**
     * Builds the query string for an advanced search.
     *
     * @param  array $advData - Array with search parameters for advanced search (SEE BELOW)
     * @param  bool $not - Get the negative results of the search
     * @return array - The query array
     */
    static function advancedQueryBuilder($advData,$not=false) {
        $qadv = array();
        $qadv["search"] = "advanced";
        $qadv["fields"] = $advData;
        //Lets talk about the structure of $advData
        //First off we have the index of the array values
        //Each field is represented in the index
        //The index will be a field's slug of flid
        //$advData[FIELD_SLUG] = SEARCH_DATA_ARRAY
        //So what about that SEARCH_DATA_ARRAY
        //That is going to be an array of info which is different per field type
        //Foreach field type, I will list out the index and the expected value of that index
        //SEARCH_DATA_ARRAY[PARAMETER_NAME] = PARAMETER_VALUE
        //Text | Rich Text
        //SDA[input] = string of text to search
        //Number
        //SDA[left] = number of left bound to search (blank for -infinite)
        //SDA[right] = number of right bound to search (blank for infinite)
        //SDA[invert] = bitwise where 1 will search outside of bound
        //List
        //SDA[input] = string option to search
        //Multi-Select List | Generated List
        //SDA[input] = array of string options to search
        //Date | Schedule
        //SDA[begin_month] = number representation of month to search
        //SDA[begin_day] = number representation of day to search
        //SDA[begin_year] = number representation of year to search
        //SDA[end_month] = number representation of month to search
        //SDA[end_day] = number representation of day to search
        //SDA[end_year] = number representation of year to search
        //Documents | Gallery | Playlist | Video | 3-D Model
        //SDA[input] = string of filename to search
        //Geolocator
        //SDA[type] = string of location type to search (LatLon, UTM, or Address)
        //Only if LatLon
        ////SDA[lat] = number of latitude to search
        ////SDA[lon] = number of longitude to search
        //Only if UTM
        ////SDA[zone] = string of UTM zone to search
        ////SDA[east] = number of easting to search
        ////SDA[north] = number of northing to search
        //Only if Address
        ////SDA[address] = string of text to search
        ////SDA[range] = number of radius from location center to search
        //Associator
        //SDA[input] = array of RIDs to search
        if($not)
            $qadv["not"] = $not;
        return $qadv;
    }
    /**
     * Builds simple array with two queries and a comparison operator.
     *
     * @param  array $queryObj1 - Index of query object in your query array, or another logic array
     * @param  string $operator - Comparison operator
     * @param  array $queryObj2 - Index of 2nd query object in your query array, or another logic array
     * @return array - Logic array
     */
    static function queryLogicBuilder($queryObj1,$operator,$queryObj2) {
        return array($queryObj1,$operator,$queryObj2);
    }
    /**
     * Takes queries and other information to build the full forms string value in an array.
     *
     * @param  string $fid - Form ID
     * @param  string $token - Token to authenticate search
     * @param  array $flags - Array of flags that customize the search further
     * @param  array $fields - For each record, the fields that should actually be returned
     * @param  array $sort - Defines what fields we are sorting by
     * @param  array $queries - The collection of query arrays in the search
     * @param  array $qLogic - Logic array for the search
     * @param  int $index - In final result set, what record should we start at
     * @param  int $count - Determines, starting from $index, how many records to return
     * @param  int $filterCount - Determines what the minimum threshold us for a filter to appear
     * @param  array $fitlerFlids - Determines what the minimum threshold us for a filter to appear
     * @return array - Array representation of the form search for the API
     */
    static function formSearchBuilder($fid,$token,$flags,$fields,$sort,$queries,$qLogic,$index=null,$count=null,$filterCount=null,$fitlerFlids=null) {
        $form = array();
        $form["form"] = $fid;
        $form["token"] = $token;
        $form["data"] = in_array("data",$flags) ? in_array("data",$flags) : false;
        $form["meta"] = in_array("meta",$flags) ? in_array("meta",$flags) : false;
        $form["size"] = in_array("size",$flags) ? in_array("size",$flags) : false;
        $form["assoc"] = in_array("assoc",$flags) ? in_array("assoc",$flags) : false;
        $form["filters"] = in_array("filters",$flags) ? in_array("filters",$flags) : false;
        $form["realnames"] = in_array("realnames",$flags) ? in_array("realnames",$flags) : false;
        $form["under"] = in_array("under",$flags) ? in_array("under",$flags) : false;
        if(!is_null($index))
            $form["index"] = $index;
        if(!is_null($count))
            $form["count"] = $count;
        if(!is_null($filterCount))
            $form["filterCount"] = $filterCount;
        if(is_array($fitlerFlids) && empty($fitlerFlids))
            $form["filterFlids"] = "ALL";
        else
            $form["filterFlids"] = $fitlerFlids;
        if(is_array($fields) && empty($fields))
            $form["fields"] = "ALL";
        else
            $form["fields"] = $fields;
        if(!empty($sort))
            $form["sort"] = $sort;
        $form["query"] = $queries;
        if(!is_null($qLogic))
            $form["logic"] = $qLogic;
        return $form;
    }
}
class KORA_Clause {
    /*
    |--------------------------------------------------------------------------
    | Kora Clause
    |--------------------------------------------------------------------------
    |
    | Replication class of KORA_Clause from Kora 2
    |
    */
    /**
     * @var array - Queries involved in the clause
     */
    var $queries = array();
    /**
     * @var array - Logic for the clause
     */
    var $logic = null;
    /**
     * Constructs the Kora Clause.
     *
     * @param  mixed $arg1 - Main argument for the clause
     * @param  string $op - Operator to compare arguments
     * @param  mixed $arg2 - Compared argument for the clause
     */
    function __construct($arg1, $op, $arg2) {
        $op = strtoupper($op);
        if($op == "AND" | $op == "OR") {
            if(!$arg1 instanceof self) {
                die("The first query clause you provided must be an object of class KORA_Clause");
            }
            if(!$arg2 instanceof self) {
                die("The second query clause you provided must be an object of class KORA_Clause");
            }
            $argQue1 = $arg1->getQueries();
            $argQue2 = $arg2->getQueries();
            $this->queries = array_merge($argQue1,$argQue2);
            //Logic stuff
            $argLogic1 = $arg1->getLogic();
            $argLogic2 = $arg2->getLogic();
            $newLogic = array();
            //first argument
            if(is_null($argLogic1)) {
                //first argument is a single query, so lets set it as index 0 in the logic
                array_push($newLogic,0);
                $size = 1;
            } else {
                //first argument already has a complex query logic, so store that and record size of queries
                array_push($newLogic,$argLogic1);
                $size = sizeof($argQue1);
            }
            //store the operation
            array_push($newLogic,$op);
            //second argument
            if(is_null($argLogic2)) {
                //second argument is a single query, so lets set it's index as the size of query 1
                array_push($newLogic,$size);
            } else {
                //second argument has complex query logic. We need to loop through and build new array where every index
                //is increased by the size of query 1
                $tmp = $this->recursizeLogicIndex($argLogic2,$size);
                //$tmp = $this->recursizeLogicIndex($argQue2,$size);
                array_push($newLogic,$tmp);
            }
            $this->logic = $newLogic;
        }
        else {
            $tool = new kora3ApiExternalTool();
            if(strtoupper($arg1)=="KID") {
                if($arg2 == "")
                    $arg2 = array();
                else if(!is_array($arg2))
                    $arg2 = array($arg2);
                if($op=="="|$op=="=="|$op=="IN")
                    $not = false;
                else if($op=="NOT IN"|$op=="!="|$op=="!==")
                    $not = true;
                else
                    die("Illegal KID operator provided: ".$op);
                $query = $tool::kidQueryBuilder($arg2, $not);
                array_push($this->queries,$query);
            } else if($arg1=="legacy_kid") {
                if($arg2 == "")
                    $arg2 = array();
                else if(!is_array($arg2))
                    $arg2 = array($arg2);
                if($op=="="|$op=="=="|$op=="IN")
                    $not = false;
                else if($op=="NOT IN"|$op=="!="|$op=="!==")
                    $not = true;
                else
                    die("Illegal KID operator provided: ".$op);
                $query = $tool::kidQueryBuilder($arg2, $not, true);
                array_push($this->queries,$query);
            } else {
                if($op=="="|$op=="==") {
                    $not = false;
                    $method = "EXACT";
                } else if($op=="!="|$op=="!==") {
                    $not = true;
                    $method = "EXACT";
                } else if($op=="LIKE") {
                    $not = false;
                    $method = "OR";
                } else if($op=="NOT LIKE") {
                    $not = true;
                    $method = "OR";
                } else if($op=="IN") {
                    $not = false;
                    $method = "OR";
                    $arg2 = implode(' ',$arg2);
                } else if($op=="NOT IN") {
                    $not = true;
                    $method = "OR";
                    $arg2 = implode(' ',$arg2);
                } else
                    die("Illegal keyword operator provided: ".$op);
                //Strip away %
                $arg2 = str_replace("%","",$arg2);
                $arg2 = $this->dateCleaner($arg2);
                $query = $tool::keywordQueryBuilder($arg2, $method, $not, array($arg1));
                array_push($this->queries,$query);
            }
        }
    }
    /**
     * Cleans up the way dates used to be searched.
     *
     * @param  string $keyword - The keyword to filter
     * @return string - The filtered date keyword
     */
    private function dateCleaner($keyword) {
        $hasDate = false;
        $dateArray = ['month'=>01,'day'=>01,'year'=>0001];
        if(strpos($keyword,'<month>') !== false) {
            $hasDate = true;
            $p1 = explode('<month>',$keyword)[1];
            $dateArray['month'] = explode('</month>',$p1)[0];
        }
        if(strpos($keyword,'<day>') !== false) {
            $hasDate = true;
            $p1 = explode('<day>',$keyword)[1];
            $dateArray['day'] = explode('</day>',$p1)[0];
        }
        if(strpos($keyword,'<year>') !== false) {
            $hasDate = true;
            $p1 = explode('<year>',$keyword)[1];
            $dateArray['year'] = explode('</year>',$p1)[0];
        }
        if($hasDate)
            return $dateArray['year'].'-'.$dateArray['month'].'-'.$dateArray['day'];
        else
            return $keyword;
    }
    /**
     * Recursively reindexes the logic query to match any new queries added to the array.
     *
     * @param  array $queryArray - The queries to reindex by
     * @param  int $size - Size of array at top level of recursion
     * @return array - The newly indexed logic array
     */
    private function recursizeLogicIndex($queryArray,$size) {
        $returnArray = array();
        //part1
        if( is_array($queryArray[0]) ){
            //echo 'is array';die;
            $tmp = $this->recursizeLogicIndex($queryArray[0],$size);
            $returnArray[0] = $tmp;
        } else {
            $returnArray[0] = $queryArray[0]+$size;
        }
        //operation
        $returnArray[1] = $queryArray[1];
        //part2
        if(is_array($queryArray[2])) {
            $tmp = $this->recursizeLogicIndex($queryArray[2],$size);
            $returnArray[2] = $tmp;
        } else {
            $returnArray[2] = $queryArray[2]+$size;
        }
        return $returnArray;
    }
    /**
     * Getter function for query variable.
     *
     * @return array - Query variable
     */
    public function getQueries() {
        return $this->queries;
    }
    /**
     * Getter function for logic variable.
     *
     * @return array - Logic varible
     */
    public function getLogic() {
        return $this->logic;
    }
}
/**
 * Converts an old KORA_Search from Kora 2 into a Kora3 search, provided steps at top of page were completed properly.
 *
 * @param  string $token - Kora3 token to authenticate the search
 * @param  int $pid - Kora3 project ID
 * @param  int $sid - Kora3 form ID relative to old scheme ID
 * @param  KORA_Clause $koraClause - The new represented Kora Clause
 * @param  array $fields - Array of new flids relative to their old control names
 * @param  array $order - Old Kora 2 sort array that will be converted by this function
 * @param  int $start - In final result set, what record should we start at
 * @param  int $number - Determines, starting from $index, how many records to return
 * @param  array $userInfo - Server authentication for connecting to private servers
 * @param  bool $underScores - Determines if a search should return the field names with underscores or spaces
 * @return array - The records to return from the search
 */
function KORA_Search($token,$pid,$sid,$koraClause,$fields,$order=array(),$start=0,$number=0,$userInfo = array(),$underScores=false,$kidsNoData) {

    if(!$koraClause instanceof KORA_Clause) {
        die("The query clause you provided must be an object of class KORA_Clause");
    }
    //Format sort array and map controls to fields
    $newOrder = array();
    foreach($order as $o) {
        if($o["field"]=="systimestamp")
            array_push($newOrder,"kora_meta_updated");
        else
            array_push($newOrder,fieldMapper($o["field"],$pid,$sid));
        $dir = $o["direction"];
        if($dir==SORT_DESC)
            $newDir = "DESC";
        else
            $newDir = "ASC";
        array_push($newOrder,$newDir);
    }
    //Map return controls to fields if not ALL or KID
    //KID is a k3 custom for the legacy koraSearch that gets you a list of records
	if( is_array($fields) && in_array("systimestamp", $fields) ){
		$fields = array_diff($fields, array("systimestamp"));
	}
	if( is_array($fields) && in_array("recordowner", $fields) ){
		$fields = array_diff($fields, array("recordowner"));
	}
    if( is_array($fields) && in_array("KID", $fields) ){
		$fields = array_diff($fields, array("KID"));
	}
    if( is_array($fields) && in_array("kid", $fields) ){
		$fields = array_diff($fields, array("kid"));
	}
	// var_dump($fields);
    $mapNames = false;
    if(is_array($fields)) {
        if(empty($fields) || $fields[0]=="ALL") {
            $fields = "ALL";
        } else {
            $fieldsMapped = array();
            foreach ($fields as $field) {
                $f = fieldMapper($field, $pid, $sid);
                array_push($fieldsMapped, $f);
            }
            $fields = $fieldsMapped;
        }
    }
    //Map controls to fields in keyword searches
    $queries = array();
    foreach($koraClause->getQueries() as $q) {
        if($q['search']=='keyword') {
            $mapped = array();
            foreach($q["fields"] as $f) {
                array_push($mapped, fieldMapper($f, $pid, $sid));
            }
            $q["fields"] = $mapped;
        }
        array_push($queries, $q);
    }
    //Format the start/number for legacy.
    if($start==0)
        $start=null;
    if($number==0)
        $number=null;
    //Filters
    if($underScores)
        $filters = array("data","meta","under");
    else
        $filters = array("data","meta");

    if($kidsNoData){
        $filters = array();
    }

    //if(true) {
    $output = array();
    $tool = new kora3ApiExternalTool();
    $fsArray = $tool->formSearchBuilder(
        $sid,
        $token,
        $filters,
        $fields,
        $newOrder,
        $queries,
        $koraClause->getLogic(),
        $start,
        $number
    );
    array_push($output, $fsArray);
    $data = array();
    $data["forms"] = json_encode($output);
    $data["format"] = "KORA_OLD";
    if( $kidsNoData ){
        unset($data['format']);
    }
    if( $fields == "ALL" ){
        $hyphenedFields = array(
            "Excavation_-_Survey_Associator",
            "Excavation_-_Survey_Name",
            "Artifact_-_Structure_Classification",
            "Artifact_-_Structure_Type",
            "Artifact_-_Structure_Type_Qualifier",
            "Artifact_-_Structure_Material",
            "Artifact_-_Structure_Technique",
            "Artifact_-_Structure_Archaeological_Culture",
            "Artifact_-_Structure_Period",
            "Artifact_-_Structure_Terminus_Ante_Quem",
            "Artifact_-_Structure_Terminus_Post_Quem",
            "Artifact_-_Structure_Title",
            "Artifact_-_Structure_Current_Location",
            "Artifact_-_Structure_Repository",
            "Artifact_-_Structure_Repository_Accession_Number",
            "Artifact_-_Structure_Creator",
            "Artifact_-_Structure_Creator_Role",
            "Artifact_-_Structure_Dimensions",
            "Artifact_-_Structure_Geolocation",
            "Artifact_-_Structure_Excavation_Unit",
            "Artifact_-_Structure_Location",
            "Artifact_-_Structure_Description",
            "Artifact_-_Structure_Condition",
            "Artifact_-_Structure_Inscription",
            "Artifact_-_Structure_Munsell_Number",
            "Artifact_-_Structure_Date",
            "Artifact_-_Structure_Subject",
            "Artifact_-_Structure_Origin",
            "Artifact_-_Structure_Comparanda",
            "Artifact_-_Structure_Archaeological_Context",
            "Artifact_-_Structure_Shelving_Location"
        );
        $formattedMerge = array();
        foreach( $hyphenedFields as $hyphenedField ){
            $formattedMerge[$hyphenedField] = array(str_replace("-_","",$hyphenedField)."_".$pid."_".$sid."_");
            //$formattedMerge[$name] = array($name."_11_33_");
        }
        $data["merge"] = json_encode($formattedMerge);
    }
	// if( $queries[0]['search'] == 'kid' && $queries[0]['kids'][0] == '11-33-2096' ){
		// var_dump($queries);
		// echo 'yaya';
		// var_export($data);
		// echo 'donnneee';
	// }
	 // echo 'in korasearch';
     // var_export($data);
	//echo $data;
    $curl = curl_init();
        // echo 'data: ';
        // var_export($data);
    curl_setopt($curl, CURLOPT_URL, KORA_RESTFUL_URL . "search");
    if (!empty($userInfo)) {
        curl_setopt($curl, CURLOPT_USERPWD, $userInfo["user"] . ":" . $userInfo["pass"]);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    }
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

    $time_start = microtime(true);
    if (!$result = curl_exec($curl)){
		echo 'curl error';
		var_export($data);
		var_dump($result);
        return curl_error($curl);
	}
    curl_close($curl);
    // $time_end = microtime(true);
    // $execution_time = ($time_end - $time_start);
    // echo 'seconds: ' . $execution_time;
    $result = json_decode($result, true);

	// if( $queries[0]['search'] == 'kid' && $queries[0]['kids'][0] == '11-33-2096' ){
		// echo "<br><br>result:";
		// var_export($result);
		// echo "after result";
	// }
	// echo "<br><br>result:<br>";
	// var_export($result);
	// echo "after result";
//    }else{
//        $fields = array('Title','Type','Excavation_-_Survey_Associator','Season_Associator','Permissions','Special_User','Resource_Identifier','linkers');
//        $pid = parent::getPIDFromProjectName($projectName);
//        $sid = parent::getResourceSIDFromProjectName($projectName);
//        $tempFields = array();
//        $fieldExt = '_'.$pid.'_'.$sid.'_';
//        foreach( $fields as $index => $field ) {
//            $tempFields[$index] = $fields[$index] . $fieldExt;
//        }
//        $query = array(
//            'forms'=>json_encode(array(
//                array(
//                    'form'=>parent::getResourceSIDFromProjectName($projectName),
//                    'token'=>parent::getTokenFromProjectName($projectName),
//                    'fields'=>$tempFields,
//                    //'format'=>'KORA_OLD',
//                    'query'=>array(
//                        array(
//                            'search'=>'kid',
//                            'kids'=>$array,
//                        )
//                    )
//                )
//            ))
//        );
//
//        $url = KORA_RESTFUL_URL.'search';
//        $ch = curl_init();
//        curl_setopt($ch,CURLOPT_URL, $url);
//        curl_setopt($ch, CURLOPT_POST, 1);
//        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//        $resource = curl_exec($ch);
//        curl_close($ch);
//
//        $this->formulatedResult = array();
//        foreach( json_decode($resource, true)['records'][0] as $kid => $value ){
//            $template = array(
//                'Title' => '',
//                'Type' => '',
//                'Excavation_-_Survey_Associator' => '',
//                'Season_Associator' => '',
//                'Permissions' => '',
//                'Special_User' => '',
//                'Resource_Identifier' => ''
//            );
//            foreach( $fields as $field ){
//                if( isset($value[$field.$fieldExt]) ){
//                    $template[$field] = $value[$field.$fieldExt]['value'];
//                }else{
//                    unset($template[$field]);
//                }
//            }
//            $template['kid'] = $kid;
//            $this->formulatedResult[$kid] = $template;
//        }
//        unset($resource);
//    }



//    $time_end = microtime(true);
//    $execution_time = ($time_end - $time_start);
//    echo 'seconds: '. $execution_time;
//    echo 'results:';
//    var_dump($result);
//    die;
    if( isset($result['records']) && isset($result['records'][0]) ){
        return $result['records'][0];
    }else if( isset($result['records']) ){
        return $result['records'];
    }else{
        return $result;
    }
}
function fieldMapper($name, $pid, $fid) {
    return str_replace(' ','_',$name).'_'.$pid.'_'.$fid.'_';
}
?>
