<?php

class DbHandlerSubtopic {

    private $db;

    function __construct() {
        require_once 'DbConnect.php';
        $conn = new DbConnect();
        $this->db = $conn->connect();
    }

    public function createSubtopic($subtopicText, $subject_ref, $topic_ref, $user_id, $img_ref) {
        $userPermission = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_ref, $user_id)->fetch();

        if (!$userPermission) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }
        if (!$this->db->image_refs->where('id', $img_ref)->fetch()) {
            $img_ref = NULL;
        };

        $subtopic = array('text' => $subtopicText, 'topic_ref' => $topic_ref, 'img_ref' => $img_ref);
        $result = $this->db->subtopic->insert($subtopic);
        if ($result) {
            return array('status' => 200, 'message' => $result);
        } else {
            return array('status' => 500, 'message' => 'Database error.');
        }
    }

    public function updateSubtopic($subtopicText, $subject_ref, $topic_ref, $subtopic_id, $user_id, $img_ref) {

        $userPermission = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_ref, $user_id)->fetch();

        if (!$userPermission) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }
        if (!$this->db->image_refs->where('id', $img_ref)->fetch()) {
            $img_ref = NULL;
        };

        $subtopicRow = $this->db->subtopic()
                        ->where('id = ? AND topic_ref = ?', $subtopic_id, $topic_ref)->fetch();
        if ($subtopicRow) {
            $subtopic = array('text' => $subtopicText, 'topic_ref' => $topic_ref, 'img_ref' => $img_ref);
            $subtopicRow->update($subtopic);
            $editedRow = $this->db->subtopic()->where('id', $subtopic_id)->fetch();
            return array('status' => 200, 'message' => $editedRow);
        } else {
            return array('status' => 400, 'message' => "Subtopic id: $subtopic_id does not exist or else you may not have permission");
        }
    }

    public function deleteTopic($subject_ref, $topic_ref, $subtopic_id, $user_id) {
        $userPermission = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_ref, $user_id)->fetch();

        if (!$userPermission) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }

        $subtopicRow = $this->db->subtopic()
                        ->where('id = ? AND topic_ref = ?', $subtopic_id, $topic_ref)->fetch();
        if ($subtopicRow) {
            $subtopicRow->delete();
            return array('status' => 200, 'message' => 'Delete Success');
        } else {
            return array('status' => 400, 'message' => "Subtopic id: $subtopic_id does not exist or else you may not have permission");
        }
    }

}
