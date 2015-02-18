<?php


header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

define("DB_USER", "");
define("DB_PASS", "");
define("DB_NAME", "");
define("DB_SERVER", "localhost");


function dbconnect($query)
{

    $db_handle = mysql_connect(DB_SERVER, DB_USER, DB_PASS);
    $db_found = mysql_select_db(DB_NAME, $db_handle);

    if ($db_found) {


        $result = mysql_query($query);

        if (!$result) {
            die('Error: ' . mysql_error($db_handle));

        }
        mysql_close($db_handle);
        return $result;
    } else {
        mysql_close($db_handle);
        return "no";
    }

}

function checkUser($usr)
{

    $SQL = "SELECT username from users where username='" . $usr . "'";
    $var = dbconnect($SQL);
    while ($db_field = mysql_fetch_assoc($var)) {
        $found = $db_field['username'];


    }
    if ($found == $usr)
        return true;
    else
        return false;
}

function register($user, $pass, $group, $tda)
{
//check if user exists
    //if not create user
    if (!checkUser($user)) {
        $SQL = "INSERT INTO `users` (`username`, `password`, `group`, `tda`) VALUES ('" . $user . "','" . $pass . "','" . $group . "','" . $tda . "')";


        $val = dbconnect($SQL);
        return "true";
    }
    return "false";
}

function base64url_encode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'));
}

function base64url_decode($data)
{
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, STR_PAD_RIGHT));
}

function authenticate($user, $pass)
{


    $SQL = "SELECT `group`, `tda` FROM `users` WHERE username = '" . $user . "' and password='" . $pass . "'LIMIT 1";
    $result = dbconnect($SQL);


    if ($result != null) {
        while ($db_field = mysql_fetch_assoc($result)) {


            $grp = $db_field['group'];
            $tda = $db_field['tda'];


        }

    }

    if ($grp != null) {


        $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
        if (mysqli_connect_errno($db)) {

            exit("Failed to connect to MySQL: " . mysqli_connect_error());
        }
//LOG
        $token = md5(date("Y-m-d H:i:s") . rand(100, 100000));
        $sql = "INSERT INTO `auth_log` (`token`, `user`, `group`, `created`, `expire`)  VALUES ('" . $token . "', '" . $user . "','" . $grp . "',NOW(),ADDTIME(NOW(), '12:00:00'))";
        if (!mysqli_query($db, $sql)) {
            exit('Error: ' . mysqli_error($db));
        }
        mysqli_close($db);


        $ret = array("group" => $grp, "tda" => $tda, "result" => "PASS", "token" => $token);
        return $ret;
    } else {
        return array("group" => '', "tda" => '', "result" => "FAIL");
    }


}

function storeForm($form, $event, $owner)
{


    $db_handle = mysql_connect(DB_SERVER, DB_USER, DB_PASS);
    $db_found = mysql_select_db(DB_NAME, $db_handle);

    if ($db_found) {
        //return $event;
        $eventd = json_decode($event, true);
        $SQL = "INSERT INTO `events`(event_name, event_start, event_end, l_code, c_code, tda ) VALUES (
     '" . $eventd['event_name'] . "'
    ,'" . $eventd['event_start'] . "'
    ,'" . $eventd['event_end'] . "'
    ,'" . $eventd['event_loc'] . "'
    ,'" . $eventd['event_cc'] . "'
    ,'" . $eventd['tda'] . "')";
        //$val = $event;


        $result = mysql_query($SQL);

        $event_id = mysql_insert_id();
        $SQL = "INSERT INTO `forms` (template, event, owner, archive) VALUES ('" . $form . "','" . $event_id . "','" . $owner . "',0)";

        $result = mysql_query($SQL);
        mysql_close($db_handle);

        return "Form Created";

    } else {
        mysql_close($db_handle);
        return "ERROR";
    }
}

function archiveForm($formid)
{

    $SQL = "UPDATE forms SET archive = 1 WHERE id='" . $formid . "'";
    $val = dbconnect($SQL);
    return $val;


}

function liveForm($formid)
{

    $SQL = "UPDATE forms SET live = 1 WHERE id='" . $formid . "'";
    $val = dbconnect($SQL);
    return $val;


}

function getFormsList($TDA, $admin, $archive)
{

    //rewrite to use single db connection then close at end

    if ($archive == "0") {
        if (!$admin)
            $SQL = "SELECT events.id, events.event_name, events.event_end, forms.id, events.tda FROM forms, events WHERE forms.event = events.id AND events.tda = '" . $TDA . "' AND forms.archive=0 ORDER BY events.event_name";
        else
            $SQL = "SELECT events.id, events.event_name, events.event_end, forms.id, events.tda FROM forms, events WHERE forms.event = events.id  AND forms.archive=0 ORDER BY events.event_name";
    } else {
        if (!$admin)
            $SQL = "SELECT events.id, events.event_name, events.event_end, forms.id , events.tda FROM forms, events WHERE forms.event = events.id AND events.tda = '" . $TDA . "' AND forms.archive='1' ORDER BY events.event_name";
        else
            $SQL = "SELECT events.id, events.event_name, events.event_end, forms.id, events.tda FROM forms, events WHERE forms.event = events.id  AND forms.archive='1' ORDER BY events.event_name";
    }

    $result = dbconnect($SQL);

    if ($result != null) {
        $i = 0;

        while ($db_field = mysql_fetch_array($result)) {
            $SQL = "SELECT count(*) from events, leads where events.id = leads.event AND events.id = '" . $db_field[0] . "'";
            $r2 = dbconnect($SQL);
            while ($db_s = mysql_fetch_array($r2)) {
                $ent = $db_s[0];
            }

            $SQL = "SELECT count(*) from events, leads where events.id = leads.event AND events.id = '" . $db_field[0] . "' AND leads.toyota_contact = 1";
            $r3 = dbconnect($SQL);
            while ($db_f = mysql_fetch_array($r3)) {
                $lead = $db_f[0];
            }
            $SQL = "SELECT count(*) from events, leads where events.id = leads.event AND events.id = '" . $db_field[0] . "' AND leads.toyota_contact = 0 AND leads.do_not_contact = 1 ";
            $r4 = dbconnect($SQL);
            while ($db_f = mysql_fetch_array($r4)) {
                $hr = $db_f[0];
            }

            $list[$i] = array("event_id" => $db_field[0],
                "event_name" => $db_field[1],
                "event_end" => $db_field[2],
                "form_id" => $db_field[3],
                "event_tda" => $db_field[4],
                "lead_count" => $lead,
                "hr_count" => $hr,
                "ent_count" => $ent);
            $i++;


        }

        return $list;

    }
    return $SQL;
}

function getForm($form_id)
{
    $SQL = "SELECT events.event_name, forms.template, forms.event FROM forms, events WHERE forms.event = events.id AND forms.id = '" . $form_id . "'";


    $result = dbconnect($SQL);
    if ($result != null) {
        while ($db_field = mysql_fetch_array($result)) {

            $template = array("event_name" => $db_field[0], "template" => json_decode($db_field[1]), "event_id" => $db_field[2]);


        }
        return $template;
    }
}

function submitForm($form)
{


    $list = "";
    $values = "";


    foreach ($form as $key => $val) {

if($key != "token"){
        if ($list == "")
            $list = $key;
        else
            $list .= "," . $key;

        if ($values == "")
            $values = "'" . $val . "'";
        else
            $values .= ",'" . $val . "'";
}

    }
    $SQL = "INSERT INTO leads (" . $list . ", entry_time) VALUES (" . $values . ", NOW())";

    $ret = dbconnect($SQL);
    return $ret;

}

function getUsers()
{

    $SQL = "SELECT `username`, `group`, `tda`, `id` FROM `users` WHERE 1 ORDER BY `group` DESC";
    $result = dbconnect($SQL);

    if ($result != null) {
        $i = 0;

        while ($db_field = mysql_fetch_array($result)) {

            $list[$i] = array(
                "user_name" => $db_field[0],
                "user_group" => $db_field[1],
                "user_tda" => $db_field[2],
                "user_id" => $db_field[3]);
            $i++;


        }

        return $list;

    }
}

function delUser($token)
{
    $SQL = "DELETE FROM users WHERE id='" . $token . "'";
    $val = dbconnect($SQL);
    return $val;
}

function delForm($form_id)
{
    $SQL = "DELETE FROM forms WHERE id='" . $form_id . "'";//what happens to leads after form has been deleted?
    $val = dbconnect($SQL);
    return $val;

}

function changePass($uid, $pass)
{

    $SQL = "UPDATE users SET password='" . $pass . "' WHERE id = '" . $uid . "'";
    $val = dbconnect($SQL);
    return $val;

}

function uploadFile($data) //File upload/process
{
    $file = explode(',', base64_decode($data["file"]));
    $file = base64url_decode($file[1]);//URL Decode?
    //$file = $data["file"];//URL Decode?
    $form_id = $data["form_id"];

    $srv_dir = "temp_data/";
    $ext = ".xls";

   /*
   switch ($data["ext"]) {

        case "xls":
            $ext = ".xls";
            break;
        case "csv":
            $ext = ".csv";
            break;
        default :
            break;

    }
   */


    $filename = 'sa_man_xls_' . date("Ymd_His");//generate file name
    file_put_contents($srv_dir . $filename . $ext, $file);

    //run file processor with meta data
    //check if file is being stored
   $response = shell_exec("java -jar java/LeadEngine.jar -p $filename -f $form_id ");
   exec("rm temp_data/$filename.$ext -f");


return $response;
}

function downloadFile($form_id) //generates template file for manual upload
{
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
    if (mysqli_connect_errno($db)) {

        exit("Failed to connect to MySQL: " . mysqli_connect_error());
    }
//LOG

    $sql = "SELECT `event` FROM `forms` WHERE id = $form_id LIMIT 1";
    $result = mysqli_query($db, $sql);
    if (!$result) {
        exit('Error: ' . mysqli_error($db));
    }

    mysqli_close($db);
    $data_db = mysqli_fetch_assoc($result);

    $filename = "sa_event_".$data_db["event"]."--" . date("Ymd_His");//generate file name

    $response = shell_exec("java -jar java/LeadEngine.jar -g $filename -f $form_id ");
    //echo $response;
    return json_encode(array("response" => $response));

}


function srvAuth($data)
{
    $possible_url = array("auth");
    if ($data["token"] != null) {
        $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
        if (mysqli_connect_errno($db)) {

            exit("Failed to connect to MySQL: " . mysqli_connect_error());
        }
//LOG

        $sql = "SELECT `group` FROM `auth_log` WHERE token ='" . $data["token"] . "' AND NOW() < `expire`";
        $result = mysqli_query($db, $sql);
        if (!$result) {
            exit('Error: ' . mysqli_error($db));
        }

        mysqli_close($db);
        $data_db = mysqli_fetch_assoc($result);

if($data_db != null){
        switch ($data_db["group"]) {
            case 1: //EVENT STAFF
                $possible_url = array_merge($possible_url, array("retrieveform", "submitform", "listforms"));
                break;
            case 2: //ACCOUNT
                $possible_url = array_merge($possible_url, array("retrieveform", "submitform", "listforms", "archive", "createform", "upload", "download"));
                break;
            case 3:
                //ADMIN
                $possible_url = array("auth", "register", "createform", "submitform", "listforms", "listusers", "deluser", "archive", "delform", "changepass", "retrieveform", "live", "upload", "download");
                break;
            default:
                exit(json_encode(array("result"=>"UNAUTHORIZED")));
                break;


        }
}
else
{
exit(json_encode(array("result"=>"UNAUTHORIZED")));
}
    }

    return $possible_url;

}



//insert auth token, then set allowed actions based on token
//check if there is an existing token

$data = json_decode(file_get_contents('php://input'), true);


$possible_url = srvAuth($data);


$value = "Error";



//POST ACTIONS and SANITIZE against SQLi

if ($_SERVER['REQUEST_METHOD'] == 'POST' && in_array($_GET["action"], $possible_url)) {

    switch ($_GET["action"]) {
        case "register":
            $value = register(strtolower($data["user"]), $data["pass"], $data["group"], $data["tda"]);
            break;

        case "retrieveform":
            $value = getForm($data["form_id"]);
            exit(json_encode($value));
            break;

        case "createform":
            $value = storeForm($data["form"], $data["event"], $data["owner"]);
            //exit($value);
            break;

        case "submitform":
            $value = submitForm($data);
            break;

        case "auth":
            $value = authenticate(strtolower($data["user"]), $data["pass"]);
            exit(json_encode($value));
            break;

        case "archive":
            $value = archiveForm($data["form_id"]);
            break;

        case "live":
            $value = liveForm($data["form_id"]);
            break;

        case "listforms":
            $value = getFormsList($data["tda"], $data["admin"], $data["archive"]);
            exit(json_encode($value));
            break;

        case "listusers":
            $value = getUsers();
            exit(json_encode($value));
            break;

        case "deluser":
            $value = delUser($data["uid"]);
            exit(json_encode($value));
            break;

        case "delform":
            $value = delForm($data["form_id"]);
            exit(json_encode($value));
            break;

        case "changepass":
            $value = changePass($data["id"], $data["pass"]);
            exit(json_encode($value));
            break;

        case "upload":
            $value = uploadFile($data);
            exit($value);
            break;

        case "download":
            $value = downloadFile($data["form_id"]);
            exit($value);
            break;

    }
}
//return JSON array
exit(json_encode(array("result" => $value)));
?>
