<?php

class DbHandlerNote {

    private $db;

    function __construct() {
        require_once 'DbConnect.php';
        $conn = new DbConnect();
        $this->db = $conn->connect();
    }

    private function verifyParentPresence($parentType, $parent_id) {
        switch ($parentType) {
            case 'subject':
                return TRUE;
            case 'topic':
                return $this->db->topic()
                                ->where('id', $parent_id)->fetch() ? TRUE : FALSE;
            case 'subtopic':
                return $this->db->subtopic()
                                ->where('id', $parent_id)->fetch() ? TRUE : FALSE;
            default :
                return FALSE;
        }
    }

    public function createNote($note, $subject_ref, $user_id) {
        $userPermission = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_ref, $user_id)->fetch();

        if (!$userPermission) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }

        $img_ref = $this->db->image_refs->where('id', $note['img_id'])->fetch() ? $note['img_id'] : NULL;

        if (!$this->verifyParentPresence($note['parent_type'], $note['parent_id'])) {
            return array('status' => 500, 'message' => 'The parent Id seems to be incorrect.');
        }

        $note = array('text' => $note['text'], 'parent_type' => $note['parent_type'],
            'parent_id' => $note['parent_id'], 'img_ref' => $img_ref);
        $result = $this->db->note->insert($note);
        if ($result) {
            return array('status' => 200, 'message' => $result);
        } else {
            return array('status' => 500, 'message' => 'Database error.');
        }
    }

    public function updateNote($note, $note_id, $subject_ref, $user_id) {


        if (!$this->db->subject()->where('id = ? AND user_ref = ?', $subject_ref, $user_id)->fetch()) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }

        $img_ref = $this->db->image_refs->where('id', $note['img_id'])->fetch() ? $note['img_id'] : NULL;

        if (!$this->verifyParentPresence($note['parent_type'], $note['parent_id'])) {
            return array('status' => 500, 'message' => 'The parent Id seems to be incorrect.');
        }

        $noteRow = $this->db->note()
                        ->where('id = ? AND parent_id = ? AND parent_type = ?', $note_id, $note['parent_id'], $note['parent_type'])->fetch();
        if ($noteRow) {
            $note = array('text' => $note['text'], 'parent_type' => $note['parent_type'],
                'parent_id' => $note['parent_id'], 'img_ref' => $img_ref);
            $noteRow->update($note);
            $editedRow = $this->db->note()->where('id', $note_id)->fetch();
            return array('status' => 200, 'message' => $editedRow);
        } else {
            return array('status' => 400, 'message' => "Note id: $note_id does not exist or else you may not have permission");
        }
    }

    public function deleteTopic($subject_ref, $parent_id, $note_id, $user_id) {
        $userPermission = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subject_ref, $user_id)->fetch();

        if (!$userPermission) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }

        $noteRow = $this->db->note()
                        ->where('id = ? AND parent_id = ?', $note_id, $parent_id)->fetch();
        if ($noteRow) {
            $noteRow->delete();
            return array('status' => 200, 'message' => 'Delete Success');
        } else {
            return array('status' => 400, 'message' => "Note id: $note_id does not exist or else you may not have permission");
        }
    }

}
