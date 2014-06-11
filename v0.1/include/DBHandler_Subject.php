<?php

class DbHandlerSubject {

    private $db;

    function __construct() {
        require_once 'DbConnect.php';
        $conn = new DbConnect();
        $this->db = $conn->connect();
    }

    public function createSubject($subject_name, $user_id) {
        $existsAlready = $this->db->subject()
                        ->where('name = ? AND user_ref = ?', $subject_name, $user_id)->fetch();

        if ($existsAlready) {
            return array('status' => 400, 'message' => 'Subject is already created.');
        }

        $subject = array('name' => $subject_name, 'user_ref' => $user_id);
        $result = $this->db->subject->insert($subject);
        if ($result) {
            return array('status' => 200, 'message' => $result);
        } else {
            return array('status' => 500, 'message' => 'Database error.');
        }
    }

    public function updateSubject($subject_id, $subject_name, $user_id) {

        $existsAlready = $this->db->subject()
                        ->where('name = ? AND user_ref = ?', $subject_name, $user_id)->fetch();

        if ($existsAlready) {
            return array('status' => 400, 'message' => 'Subject is already created.');
        }

        $subjectRow = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_id, $user_id)->fetch();
        if ($subjectRow) {
            $subjectRow->update(array('name' => $subject_name));
            $editedRow = $this->db->subject()->where('id', $subject_id)->fetch();
            return array('status' => 200, 'message' => $editedRow);
        } else {
            return array('status' => 400, 'message' => "Subject id: $subject_id does not exist or else you may not have permission");
        }
    }

    public function deleteSubject($subject_id, $user_id) {
        $subjectRow = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_id, $user_id)->fetch();
        if ($subjectRow) {
            $subjectRow->delete();
            return array('status' => 200, 'message' => 'Delete Success');
        } else {
            return array('status' => 400, 'message' => "Subject id: $subject_id does not exist or else you may not have permission");
        }
    }

}
