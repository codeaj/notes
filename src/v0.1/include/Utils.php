<?php

class UtilHandler {

    function __construct() {
        
    }

    /**
     * Validating string length
     */
    public function validateStringLength($str, $strKey, $minLength, $maxLength) {
        $app = \Slim\Slim::getInstance();
        if (strlen($str) < $minLength || strlen($str) > $maxLength) {
            $response['status'] = 400;
            $response['message'] = "$strKey Should be between $minLength - $maxLength characters.";
            echoRespnse(400, $response);
            $app->stop();
        }
    }

    /**
     * Validating Valid Parent for note
     */
    public function validParentType($parentType) {
        $app = \Slim\Slim::getInstance();
        $validParentArray = array('subject', 'topic', 'subtopic');
        if (!in_array($parentType, $validParentArray)) {
            echoRespnse(400, array('message' => 'Incorrect parent type'));
            $app->stop();
        }
    }

    /**
     * Verifying required params posted or not
     */
    public function verifyRequiredParams($required_fields, $request_params) {
        $error = false;
        $error_fields = '';
        foreach ($required_fields as $field) {
            if (!isset($request_params[$field]) || strlen(trim($request_params[$field])) <= 0) {
                $error = true;
                $error_fields .= $field . ', ';
            }
        }
        if ($error) {
            // Required field(s) are missing or empty
            // echo error json and stop the app
            $response = array();
            $app = \Slim\Slim::getInstance();
            echoRespnse(400, array('message' => "Required field(s) " . substr($error_fields, 0, -2) . " is missing or empty"));
            $app->stop();
        }
    }

    public function storeFile() {
        if (isset($_FILES['imagefile'])) {
            $allowedExts = array('gif', 'jpeg', 'jpg', 'png');
            $temp = explode('.', $_FILES['imagefile']['name']);
            $extension = end($temp);
            $correctImgType = ($_FILES['imagefile']['type'] == 'image/gif') || ($_FILES['imagefile']['type'] == 'image/jpeg') || ($_FILES['imagefile']['type'] == 'image/jpg') || ($_FILES['imagefile']['type'] == 'image/pjpeg') || ($_FILES['imagefile']['type'] == 'image/x-png') || ($_FILES['imagefile']['type'] == 'image/png');
            $correctImgSize = ($_FILES['imagefile']['size'] / 1024 < 1024);
            $correctExtension = in_array($extension, $allowedExts);
            if ($correctImgType && $correctImgSize && $correctExtension) {
                $uploaddir = 'uploads/' . $_FILES['imagefile']['name'];
                $imageURL = 'http://' . $_SERVER['HTTP_HOST'] . '/QuotesAppService/v1/uploads/' . $_FILES['imagefile']['name'];
                if ($_FILES['imagefile']['error'] > 0) {
                    // echo 'Return Code: ' . $_FILES['imagefile']['error'] . '<br>';
                    return FALSE;
                } else {
                    if (file_exists('upload/' . $_FILES['imagefile']['name'])) {
                        unlink($_FILES['imagefile']['name']);
                        move_uploaded_file($_FILES['imagefile']['tmp_name'], $uploaddir);
                        return $imageURL;
                    } else {
                        move_uploaded_file($_FILES['imagefile']['tmp_name'], $uploaddir);
                        return $imageURL;
                    }
                }
            } else {
                return FALSE;
            }
        } else {
            return FALSE;
        }
    }

}
