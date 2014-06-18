<?php

class DbHandlerTopic {

    private $db;

    function __construct() {
        require_once 'DbConnect.php';
        $conn = new DbConnect();
        $this->db = $conn->connect();
    }

    private function getImageName($img_id) {
        $row = $this->db->image_refs->where('id', $img_id)->fetch();
        if ($row) {
            return $row['url'];
        } else {
            return FALSE;
        }
    }

    public function createTopic($topicText, $subject_ref, $user_id, $img_ref) {
        $userPermission = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_ref, $user_id)->fetch();

        if (!$userPermission) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }
        if (!$this->db->image_refs->where('id', $img_ref)->fetch()) {
            $img_ref = NULL;
        };
        $topic = array('text' => $topicText, 'subject_ref' => $subject_ref, 'img_ref' => $img_ref);
        $result = $this->db->topic->insert($topic);
        if ($result) {
            $result['img_name'] = $this->getImageName($result['img_ref']);
            return array('status' => 200, 'message' => $result);
        } else {
            return array('status' => 500, 'message' => 'Database error.');
        }
    }

    public function updateTopic($topicText, $subject_ref, $topic_id, $user_id, $img_ref) {

        $userPermission = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_ref, $user_id)->fetch();

        if (!$userPermission) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }
        if (!$this->db->image_refs->where('id', $img_ref)->fetch()) {
            $img_ref = NULL;
        };

        $topicRow = $this->db->topic()
                        ->where('id = ? AND subject_ref = ?', $topic_id, $subject_ref)->fetch();
        if ($topicRow) {
            $topic = array('text' => $topicText, 'subject_ref' => $subject_ref, 'img_ref' => $img_ref);
            $topicRow->update($topic);
            $editedRow = $this->db->topic()->where('id', $topic_id)->fetch();
            $editedRow['img_name'] = $this->getImageName($editedRow['img_ref']);
            return array('status' => 200, 'message' => $editedRow);
        } else {
            return array('status' => 400, 'message' => "Topic id: $topic_id does not exist or else you may not have permission");
        }
    }

    public function deleteTopic($subject_ref, $topic_id, $user_id) {
        $userPermission = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_ref, $user_id)->fetch();

        if (!$userPermission) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }

        $topicRow = $this->db->topic()
                        ->where('id = ? AND subject_ref = ?', $topic_id, $subject_ref)->fetch();
        if ($topicRow) {
            $topicRow->delete();
            return array('status' => 200, 'message' => 'Delete Success');
        } else {
            return array('status' => 400, 'message' => "Topic id: $topic_id does not exist or else you may not have permission");
        }
    }

}
