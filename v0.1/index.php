<?php

require_once 'include/DBHandler_Subject.php';
require_once 'include/DBHandler_Topic.php';
require_once 'include/DBHandler_Subtopic.php';
require_once 'include/DBHandler_Note.php';
require_once 'include/Utils.php';
require 'include/libs/Slim/Slim.php';

\Slim\Slim::registerAutoloader();
$db_subject = new DbHandlerSubject();
$db_topic = new DbHandlerTopic();
$db_subtopic = new DbHandlerSubtopic();
$db_note = new DbHandlerNote();
$util = new UtilHandler();
$app = new \Slim\Slim();
$user_id = NULL;
$app->response()->header('Content-Type', 'application/json');
$app->response()->header('Access-Control-Allow-Origin', '*');

//Routes
$app->get('/subject', 'authenticate', function() use ($app) {
    global $user_id;
    echoRespnse('200', array('user_id' => $user_id));
});
$app->post('/subject', 'authenticate', function() use ($app, $db_subject, $util) {
    global $user_id;
    createSubject($app, $db_subject, $user_id, $util);
});
$app->put('/subject/:subject_id', 'authenticate', function($subject_id) use ($app, $db_subject, $util) {
    global $user_id;
    updateSubject($app, $db_subject, $subject_id, $user_id, $util);
});
$app->delete('/subject/:subject_id', 'authenticate', function($subject_id) use ($db_subject) {
    global $user_id;
    deleteSubject($db_subject, $subject_id, $user_id);
});
$app->post('/topic/:subject_id', 'authenticate', function($subject_id) use ($app, $db_topic, $util) {
    global $user_id;
    createTopic($app, $db_topic, $subject_id, $user_id, $util);
});
$app->put('/topic/:subject_id/:topic_id', 'authenticate', function($subject_id, $topic_id) use ($app, $db_topic, $util) {
    global $user_id;
    updateTopic($app, $db_topic, $subject_id, $topic_id, $user_id, $util);
});
$app->delete('/topic/:subject_id/:topic_id', 'authenticate', function($subject_id, $topic_id) use ($db_topic) {
    global $user_id;
    deleteTopic($db_topic, $subject_id, $topic_id, $user_id);
});
$app->post('/subtopic/:subject_id/:topic_id', 'authenticate', function($subject_id, $topic_id) use ($app, $db_subtopic, $util) {
    global $user_id;
    createSubtopic($app, $db_subtopic, $util, $subject_id, $topic_id, $user_id);
});
$app->put('/subtopic/:subject_id/:topic_id/:subtopic_id', 'authenticate', function($subject_id, $topic_id, $subtopic_id) use ($app, $db_subtopic, $util) {
    global $user_id;
    updateSubtopic($app, $db_subtopic, $util, $subject_id, $topic_id, $subtopic_id, $user_id);
});
$app->delete('/subtopic/:subject_id/:topic_id/:subtopic_id', 'authenticate', function($subject_id, $topic_id, $subtopic_id) use ($db_subtopic) {
    global $user_id;
    deleteSubtopic($db_subtopic, $subject_id, $topic_id, $subtopic_id, $user_id);
});
$app->post('/note/:subject_id', 'authenticate', function($subject_id) use ($app, $db_note, $util) {
    global $user_id;
    createNote($app, $db_note, $util, $subject_id, $user_id);
});
$app->put('/note/:subject_id/:note_id', 'authenticate', function($subject_id, $note_id) use ($app, $db_note, $util) {
    global $user_id;
    updateNote($app, $db_note, $util, $subject_id, $note_id, $user_id);
});
$app->delete('/note/:subject_id/:parent_id/:note_id', 'authenticate', function($subject_id, $parent_id, $note_id) use ($db_note) {
    global $user_id;
    deleteNote($db_note, $subject_id, $parent_id, $note_id, $user_id);
});
$app->post('/uploadFile', 'authenticate', function() use ($db_note) {
    global $user_id;
    addImage($db_note, $user_id);
});
$app->put('/uploadFile/:subject_id/:image_id', 'authenticate', function($subject_id, $image_id) use ($db_note) {
    global $user_id;
    updateImage($db_note, $subject_id, $user_id, $image_id);
});
$app->run();

function createSubject($app, $db_subject, $user_id, $util) {
    $subject = json_decode($app->request()->getBody(), TRUE);
    $util->verifyRequiredParams(array('name'), $subject);
    $util->validateStringLength($subject['name'], 'subject name', 4, 40);
    $res = $db_subject->createSubject($subject['name'], $user_id);
    echoRespnse($res['status'], $res);
}

function updateSubject($app, $db_subject, $subject_id, $user_id, $util) {
    $subject = json_decode($app->request()->getBody(), TRUE);
    $util->verifyRequiredParams(array('name'), $subject);
    $util->validateStringLength($subject['name'], 'subject name', 4, 40);
    $res = $db_subject->updateSubject($subject_id, $subject['name'], $user_id);
    echoRespnse($res['status'], $res);
}

function deleteSubject($db_subject, $subject_id, $user_id) {
    $res = $db_subject->deleteSubject($subject_id, $user_id);
    echoRespnse($res['status'], $res);
}

function createTopic($app, $db_topic, $subject_ref, $user_id, $util) {
    $topic = json_decode($app->request()->getBody(), TRUE);
    $util->verifyRequiredParams(array('text', 'img_id'), $topic);
    $util->validateStringLength($topic['text'], 'topic name', 5, 100);
    $res = $db_topic->createTopic($topic['text'], $subject_ref, $user_id, $topic['img_id']);
    echoRespnse($res['status'], $res);
}

function updateTopic($app, $db_topic, $subject_ref, $topic_id, $user_id, $util) {
    $topic = json_decode($app->request()->getBody(), TRUE);
    $util->verifyRequiredParams(array('text', 'img_id'), $topic);
    $util->validateStringLength($topic['text'], 'topic name', 5, 100);
    $res = $db_topic->updateTopic($topic['text'], $subject_ref, $topic_id, $user_id, $topic['img_id']);
    echoRespnse($res['status'], $res);
}

function deleteTopic($db_topic, $subject_ref, $topic_id, $user_id) {
    $res = $db_topic->deleteTopic($subject_ref, $topic_id, $user_id);
    echoRespnse($res['status'], $res);
}

function createSubtopic($app, $db_subtopic, $util, $subject_ref, $topic_ref, $user_id) {
    $subtopic = json_decode($app->request()->getBody(), TRUE);
    $util->verifyRequiredParams(array('text', 'img_id'), $subtopic);
    $util->validateStringLength($subtopic['text'], 'subtopic name', 5, 100);
    $res = $db_subtopic->createSubtopic($subtopic['text'], $subject_ref, $topic_ref, $user_id, $subtopic['img_id']);
    echoRespnse($res['status'], $res);
}

function updateSubtopic($app, $db_subtopic, $util, $subject_ref, $topic_ref, $subtopic_id, $user_id) {
    $subtopic = json_decode($app->request()->getBody(), TRUE);
    $util->verifyRequiredParams(array('text', 'img_id'), $subtopic);
    $util->validateStringLength($subtopic['text'], 'subtopic name', 5, 100);
    $res = $db_subtopic->updateSubtopic($subtopic['text'], $subject_ref, $topic_ref, $subtopic_id, $user_id, $subtopic['img_id']);
    echoRespnse($res['status'], $res);
}

function deleteSubtopic($db_subtopic, $subject_ref, $topic_ref, $subtopic_id, $user_id) {
    $res = $db_subtopic->deleteTopic($subject_ref, $topic_ref, $subtopic_id, $user_id);
    echoRespnse($res['status'], $res);
}

function createNote($app, $db_note, $util, $subject_ref, $user_id) {
    $note = json_decode($app->request()->getBody(), TRUE);
    $util->verifyRequiredParams(array('text', 'parent_type', 'parent_id', 'img_id'), $note);
    $util->validateStringLength($note['text'], 'note text', 10, 500);
    $util->validParentType($note['parent_type']);
    $res = $db_note->createNote($note, $subject_ref, $user_id);
    echoRespnse($res['status'], $res);
}

function updateNote($app, $db_note, $util, $subject_ref, $note_id, $user_id) {
    $note = json_decode($app->request()->getBody(), TRUE);
    $util->verifyRequiredParams(array('text', 'parent_type', 'parent_id', 'img_id'), $note);
    $util->validateStringLength($note['text'], 'note text', 10, 500);
    $util->validParentType($note['parent_type']);
    $res = $db_note->updateNote($note, $note_id, $subject_ref, $user_id);
    echoRespnse($res['status'], $res);
}

function deleteNote($db_note, $subject_ref, $parent_id, $note_id, $user_id) {
    $res = $db_note->deleteTopic($subject_ref, $parent_id, $note_id, $user_id);
    echoRespnse($res['status'], $res);
}

function addImage($db_note, $user_id) {
    $res = $db_note->addImage($user_id);
    echoRespnse($res['status'], $res);
}

function updateImage($db_note, $subject_id, $user_id, $image_id) {
    $res = $db_note->updateImage($subject_id, $user_id, $image_id);
    echoRespnse($res['status'], $res);
}

function echoRespnse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);
    $app->contentType('application/json');
    echo json_encode($response);
}

/**
 * Adding Middle Layer to authenticate every request
 * Checking if the request has valid api key in the 'Authorization' header
 */
function authenticate() {
    $app = \Slim\Slim::getInstance();
    $headers = $app->request->headers();
    if (isset($headers['Authorization'])) {
//        $db = new DbHandler_Register();
//        $api_key = $headers['Authorization'];
//        $getKey = $db->isValidApiKey($api_key);
//        if (!$getKey['found']) {
//            echoRespnse(401, array('message' => 'Access Denied. Invalid Api key'));
//            $app->stop();
//        } else {
        global $user_id;
        $user_id = 1;
//        }
    } else {
        echoRespnse(404, array('message' => 'Api key is missing'));
        $app->stop();
    }
}
