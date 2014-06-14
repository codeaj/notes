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

    public function getSubjects($user_id) {
        $subjects = $this->db->subject()
                ->select("id, name")
                ->where("user_ref", $user_id);
        $response = array();
        foreach ($subjects as $row) {
            array_push($response, $row);
        }
        if ($subjects) {
            return array('status' => 200, 'message' => $response);
        } else {
            return array('status' => 400, 'message' => 'Subjects not found for this user.');
        }
    }

    public function getNotes($subjectId, $user_id) {
        $userPermission = $this->db->subject()
                        ->where('id = ? AND user_ref = ?', $subjectId, $user_id)->fetch();

        if (!$userPermission) {
            return array('status' => 400, 'message' => 'You do not have permission for this subject.');
        }
        $response = array('notes' => array(), 'topics' => array());
        $response['notes'] = $this->getSubjectNoteArray($subjectId);
        $topicArray = array();
        $topics = $this->db->topic()->where('subject_ref', 15);
        foreach ($topics as $row) {
            $topic = $row;
            $imageDetail = $this->getImageName($topic['img_ref']);
            $topic['img_ref'] = $imageDetail['id'];
            $topic['img_name'] = $imageDetail['url'];
            $topictNoteArray = $this->getTopicNoteArray($topic);
            $subtopicArray = array();
            $subtopics = $this->db->subtopic()
                    ->where('topic_ref', $topic['id']);
            foreach ($subtopics as $row) {
                $subtopic = $row;
                $imageDetail = $this->getImageName($subtopic['img_ref']);
                $subtopic['img_ref'] = $imageDetail['id'];
                $subtopic['img_name'] = $imageDetail['url'];
                $subtopictNoteArray = $this->getsubtopictNoteArray($subtopic);
                array_push($subtopicArray, array('subtopic' => $subtopic,
                    'notes' => $subtopictNoteArray));
            }
            array_push($topicArray, array('topic' => $topic, 'notes' => $topictNoteArray,
                'subtopics' => $subtopicArray));
        }
        $response['topics'] = $topicArray;
        return array('status' => 200, 'message' => $response);
    }

    private function getImageName($img_ref) {
        $imageDetail = $this->db->image_refs()
                        ->where('id', $img_ref)->fetch();

        return $imageDetail ? $imageDetail : array('id' => FALSE, 'url' => FALSE);
    }

    private function getSubjectNoteArray($subject_id) {
        $subjectNotes = $this->db->note()
                ->where('parent_type = ? AND parent_id = ?', 'subject', $subject_id);
        $subjectNoteArray = array();
        foreach ($subjectNotes as $row) {
            $imageDetail = $this->getImageName($row['img_ref']);
            $row['img_ref'] = $imageDetail['id'];
            $row['img_name'] = $imageDetail['url'];
            array_push($subjectNoteArray, $row);
        }
        return $subjectNoteArray;
    }

    private function getTopicNoteArray($topic) {
        $topicNotes = $this->db->note()
                ->where('parent_type = ? AND parent_id = ?', 'topic', $topic['id']);
        $topictNoteArray = array();
        foreach ($topicNotes as $row) {
            $imageDetail = $this->getImageName($row['img_ref']);
            $row['img_ref'] = $imageDetail['id'];
            $row['img_name'] = $imageDetail['url'];
            array_push($topictNoteArray, $row);
        }
        return $topictNoteArray;
    }

    private function getsubtopictNoteArray($subtopic) {
        $subtopicNotes = $this->db->note()
                ->where('parent_type = ? AND parent_id = ?', 'subtopic', $subtopic['id']);
        $subtopictNoteArray = array();
        foreach ($subtopicNotes as $row) {
            $imageDetail = $this->getImageName($row['img_ref']);
            $row['img_ref'] = $imageDetail['id'];
            $row['img_name'] = $imageDetail['url'];
            array_push($subtopictNoteArray, $row);
        }
        return $subtopictNoteArray;
    }

}
