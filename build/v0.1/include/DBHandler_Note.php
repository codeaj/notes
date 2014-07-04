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

    private function getImageName($img_id) {
        $row = $this->db->image_refs->where('id', $img_id)->fetch();
        if ($row) {
            return $row['url'];
        } else {
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
            $result['img_name'] = $this->getImageName($result['img_ref']);
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
            $editedRow['img_name'] = $this->getImageName($editedRow['img_ref']);
            return array('status' => 200, 'message' => $editedRow);
        } else {
            return array('status' => 400, 'message' => "Note id: $note_id does not exist or else you may not have permission");
        }
    }

    public function deleteNote($subject_ref, $parent_id, $note_id, $user_id) {
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

    public function addImage($user_id) {
        if (!file_exists('data/' . $user_id . '/images')) {
            mkdir('data/' . $user_id . '/images', 0777, true);
        }
        if (isset($_FILES['myFile']) && !($_FILES['myFile']['error'] > 0)) {
            $imageInfo = $this->storeImage($user_id, FALSE);
            if ($imageInfo) {
                return array('status' => 200, 'message' => $imageInfo);
            } else {
                return array('status' => 400, 'message' => 'Error in upload');
            }
        } else {
            return array('status' => 400, 'message' => 'Error in upload');
        }
    }

    private function storeImage($user_id, $image_id) {
        $allowedExts = array('gif', 'jpeg', 'jpg', 'png', 'GIF', 'JPEG', 'JPG', "PNG");
        $temp = explode('.', $_FILES['myFile']['name']);
        $extension = end($temp);
        $fileType = $_FILES['myFile']['type'];
        $correctImgType = ($fileType == 'image/gif') || ($fileType == 'image/jpeg') ||
                ($fileType == 'image/jpg') || ($fileType == 'image/png');
        $correctImgSize = ($_FILES['myFile']['size'] / 1024 < 1024);
        $correctExtension = in_array($extension, $allowedExts);
        if ($correctImgType && $correctImgSize && $correctExtension) {
            if (!$image_id) {
                return $this->storeImageLinkDB($user_id);
            } else {
                return $this->updateImageLinkDB($user_id, $image_id);
            }
        } else {
            return FALSE;
        }
    }

    private function storeImageLinkDB($user_id) {
        $lastIndex = $this->db->image_refs->max('id');
        $lastIndex++;
        $fileName = $lastIndex . '_' . $_FILES['myFile']['name'];
        $image_entry = array('url' => 'data/' . $user_id . '/images/' . $fileName);
        $result = $this->db->image_refs->insert($image_entry);
        $uploaddir = 'data/' . $user_id . '/images/' . $fileName;
        if (file_exists($uploaddir)) {
            unlink($uploaddir);
            move_uploaded_file($_FILES['myFile']['tmp_name'], $uploaddir);
        } else {
            move_uploaded_file($_FILES['myFile']['tmp_name'], $uploaddir);
        }
        return $result ? array('id' => $result['id'], 'url' => $result['url']) : FALSE;
    }

}
