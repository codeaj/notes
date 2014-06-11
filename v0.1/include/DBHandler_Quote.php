<?php

class DbHandlerQuote {

    private $db;

    function __construct() {
        require_once 'DbConnect.php';
        $conn = new DbConnect();
        $this->db = $conn->connect();
    }

    public function likeQuote($id, $user_id) {
        if ($this->db->quotelikes()
                        ->where('user_id = ? AND quote_id = ?', $user_id, $id)->fetch()) {
            return array('status' => 400, 'message' => false, 'error' => 'already liked');
        } else {
            $updateRow = array('user_id' => $user_id, 'quote_id' => $id);
            $result = $this->db->quotelikes->insert($updateRow);
            if ($result) {
                return $this->updateLikeCount($id);
            } else {
                return array('status' => 500, 'message' => 'database error',
                    'error' => true);
            }
        }
    }

    private function updateLikeCount($id) {
        $countLikes = 0;
        $likeRows = $this->db->quotelikes->where('quote_id', $id);
        foreach ($likeRows as $row) {
            $countLikes++;
        }
        $updateCount = array('likes' => $countLikes);
        $result = $this->db->quotes->where('id', $id)->update($updateCount);
        if ($result) {
            return array('status' => 200, 'message' => array('count' => $countLikes),
                'error' => false);
        } else {
            return array('status' => 500, 'message' => 'database error',
                'error' => true);
        }
    }

    public function unlikeQuote($id, $user_id) {
        if (!$this->db->quotelikes()
                        ->where('user_id = ? AND quote_id = ?', $user_id, $id)->fetch()) {
            return array('status' => 400, 'message' => false,
                'error' => 'already unliked or never liked');
        } else {
            $likedRow = $this->db->quotelikes()
                    ->where('user_id = ? AND quote_id = ?', $user_id, $id);
            if ($likedRow) {
                $likedRow->delete();
            }
            $countLikes = 0;
            $likeRows = $this->db->quotelikes->where('id', $id);
            foreach ($likeRows as $row) {
                $countLikes++;
            }
            $categoryRow = $this->db->quotes->where('id', $id);
            $updateCount = array('likes' => $countLikes);
            if ($categoryRow) {
                $result = $categoryRow->update($updateCount);
            }
            if ($result) {
                return array('status' => 200, 'message' => array('count' => $countLikes),
                    'error' => false);
            } else {
                return array('status' => 500, 'message' => 'database error',
                    'error' => true);
            }
        }
    }

    public function createQuote($quoteText, $category, $user_id) {
        $quote = array('quote' => $quoteText, 'wrNctg_ref' => $category, 'user_ref' => $user_id);
        $result = $this->db->quotes->insert($quote);
        if ($result) {
            $newRow = array();
            $updatedRow = $this->db
                            ->quotes()->where('quote = ? AND wrNctg_ref = ?', $quoteText, $category);
            foreach ($updatedRow as $row) {
                $newRow = array('id' => $row['id'], 'text' => $row['quote'],
                    'wrNctg_ref' => $row['wrNctg_ref'], 'liked' => false,
                    'likes' => $row['likes'], 'editable' => true);
            }
            return array('status' => 200, 'message' => $newRow);
        } else {
            return array('status' => 500, 'message' => 'Database error.');
        }
    }

    public function updateQuote($idQuote, $quote, $user_id) {
        $quoteRow = $this->db->quotes()
                ->where('id = ? AND user_ref = ?', $idQuote, $user_id);
        if ($quoteRow->fetch()) {
            $quoteRow->update($quote);
            $updatedRow = array();
            $liked = false;
            if ($this->db->quotelikes()
                            ->where('user_id = ? AND quote_id = ?', $user_id, $idQuote)->fetch()) {
                $liked = true;
            }
            $newRow = $this->db->quotes()->where('id', $idQuote);
            foreach ($newRow as $row) {
                $updatedRow = array('id' => $row['id'], 'text' => $row['quote'],
                    'wrNctg_ref' => $row['wrNctg_ref'], 'liked' => $liked,
                    'likes' => $row['likes'], 'editable' => true);
            }
            return array('status' => 200, 'message' => $updatedRow, 'error' => false);
        } else {
            return array('status' => 400, 'message' => false,
                'error' => 'Quote id: $id does not exist or you have no permission');
        }
    }

    public function deleteQuote($idQuote, $user_id) {
        $quoteRow = $this->db->quotes()->where('id = ? AND user_ref = ?', $idQuote, $user_id);
        if ($quoteRow->fetch()) {
            $result = $quoteRow->delete();
            return array('status' => 200, 'message' => true, 'error' => false);
        } else {
            return array('status' => false, 'message' => 'Quote id: ' . $idQuote . ' Quote does not exist or you do not have valid permission');
        }
    }

    public function getQuotes($idWriterOrCtg, $user_id) {
        $quotesFromDb = $this->db->quotes()->where('wrNctg_ref', $idWriterOrCtg);
        $quoteList = array();
        foreach ($quotesFromDb as $row) {
            $quoteId = $row['id'];
            $liked = false;
            $editable = false;
            if ($this->db->quotelikes()
                            ->where('user_id = ? AND quote_id = ?', $user_id, $quoteId)->fetch()) {
                $liked = true;
            }
            if ($row['user_ref'] == $user_id) {
                $editable = true;
            }
            array_push($quoteList, array('id' => $row['id'],
                'text' => $row['quote'], 'likes' => $row['likes'], 'wrNctg_ref' => $row['wrNctg_ref'],
                'liked' => $liked, 'editable' => $editable));
        }
        if ($quoteList) {
            return array('status' => 200, 'message' => $quoteList);
        } else {
            return array('status' => 400, 'message' => false);
        }
    }

    function getReadCtgs() {
        $writersNCtgsList = array();
        foreach ($this->db->writersNCtgs() as $row) {
            $writersNCtgsList[] = array('id' => $row['id'], 'name' => $row['name'],
                'description' => $row['description']);
        }
        if (sizeof($writersNCtgsList) > 0) {

            return array('status' => 200, 'message' => $writersNCtgsList);
        } else {
            return array('status' => 400, 'message' => false);
        }
    }

    function getReadQuotes($ctgId) {
        $quotesFromDb = $this->db->quotes()->where('wrNctg_ref', $ctgId);
        $quoteList = array();
        foreach ($quotesFromDb as $row) {
            array_push($quoteList, array('id' => $row['id'],
                'text' => $row['quote']));
        }
        if ($quoteList) {
            return array('status' => 200, 'message' => $quoteList);
        } else {
            return array('status' => 400, 'message' => false);
        }
    }

    public function getAllQuotesData() {
        $writersNCtgsList = array();
        foreach ($this->db->writersNCtgs() as $row) {
            $writersNCtgsList[] = array('id' => $row['id'], 'name' => $row['name'], 'imageURL' => $row['imageURL'], 'description' => $row['description']);
            $cnt = count($writersNCtgsList);
            for ($i = 0; $i < $cnt; $i++) {
                $idWriterOrCtg = $writersNCtgsList[$i]['id'];
                $quotesFromDb = $this->db->quotes()->where('wrNctg_ref', $idWriterOrCtg);
                $quoteList = $this->getQuoteRowArray($quotesFromDb);
                $writersNCtgsList[$i]['quotes'] = $quoteList;
            }
        }
        return $writersNCtgsList;
    }

    private function getQuoteRowArray($quotesFromDb) {
        $quoteList = array();
        foreach ($quotesFromDb as $row) {
            $quoteList = array('id' => $row['id'], 'quote' => $row['quote'], 'wrNctg_ref' => $row['wrNctg_ref']);
        }
        return $quoteList;
    }

}
