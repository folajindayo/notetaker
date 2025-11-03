// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title NoteBoard
 * @dev An advanced on-chain message board with likes, replies, editing, and more
 */
contract NoteBoard {
    struct Note {
        address author;
        string message;
        uint256 timestamp;
        uint256 likes;
        uint256 replyCount;
        bool isEdited;
        bool isDeleted;
    }

    struct Reply {
        address author;
        string message;
        uint256 timestamp;
        uint256 noteId;
    }

    struct UserProfile {
        string username;
        uint256 totalNotes;
        uint256 totalLikes;
        bool exists;
    }

    Note[] private notes;
    Reply[] private replies;
    
    mapping(uint256 => mapping(address => bool)) public noteLikes;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256[]) private userNotes;
    mapping(uint256 => uint256[]) private noteReplies;
    
    uint256 public constant MAX_MESSAGE_LENGTH = 280;
    uint256 public constant MAX_USERNAME_LENGTH = 30;
    uint256 public totalUsers;

    event NotePosted(
        uint256 indexed noteId,
        address indexed author,
        string message,
        uint256 timestamp
    );

    event NoteLiked(
        uint256 indexed noteId,
        address indexed liker,
        uint256 totalLikes
    );

    event NoteUnliked(
        uint256 indexed noteId,
        address indexed unliker,
        uint256 totalLikes
    );

    event NoteEdited(
        uint256 indexed noteId,
        address indexed author,
        string newMessage,
        uint256 timestamp
    );

    event NoteDeleted(
        uint256 indexed noteId,
        address indexed author,
        uint256 timestamp
    );

    event ReplyPosted(
        uint256 indexed replyId,
        uint256 indexed noteId,
        address indexed author,
        string message,
        uint256 timestamp
    );

    event UsernameSet(
        address indexed user,
        string username
    );

    /**
     * @dev Set username for the caller
     * @param _username The username to set
     */
    function setUsername(string calldata _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(
            bytes(_username).length <= MAX_USERNAME_LENGTH,
            "Username too long"
        );

        if (!userProfiles[msg.sender].exists) {
            totalUsers++;
        }

        userProfiles[msg.sender].username = _username;
        userProfiles[msg.sender].exists = true;

        emit UsernameSet(msg.sender, _username);
    }

    /**
     * @dev Post a new note to the board
     * @param _message The message content (max 280 characters)
     */
    function postNote(string calldata _message) external {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(
            bytes(_message).length <= MAX_MESSAGE_LENGTH,
            "Message exceeds maximum length"
        );

        uint256 noteId = notes.length;
        
        notes.push(
            Note({
                author: msg.sender,
                message: _message,
                timestamp: block.timestamp,
                likes: 0,
                replyCount: 0,
                isEdited: false,
                isDeleted: false
            })
        );

        userNotes[msg.sender].push(noteId);
        
        if (!userProfiles[msg.sender].exists) {
            userProfiles[msg.sender].exists = true;
            totalUsers++;
        }
        userProfiles[msg.sender].totalNotes++;

        emit NotePosted(noteId, msg.sender, _message, block.timestamp);
    }

    /**
     * @dev Like a note
     * @param _noteId The ID of the note to like
     */
    function likeNote(uint256 _noteId) external {
        require(_noteId < notes.length, "Note does not exist");
        require(!notes[_noteId].isDeleted, "Note is deleted");
        require(!noteLikes[_noteId][msg.sender], "Already liked");

        noteLikes[_noteId][msg.sender] = true;
        notes[_noteId].likes++;
        userProfiles[notes[_noteId].author].totalLikes++;

        emit NoteLiked(_noteId, msg.sender, notes[_noteId].likes);
    }

    /**
     * @dev Unlike a note
     * @param _noteId The ID of the note to unlike
     */
    function unlikeNote(uint256 _noteId) external {
        require(_noteId < notes.length, "Note does not exist");
        require(noteLikes[_noteId][msg.sender], "Not liked yet");

        noteLikes[_noteId][msg.sender] = false;
        notes[_noteId].likes--;
        if (userProfiles[notes[_noteId].author].totalLikes > 0) {
            userProfiles[notes[_noteId].author].totalLikes--;
        }

        emit NoteUnliked(_noteId, msg.sender, notes[_noteId].likes);
    }

    /**
     * @dev Edit a note (only by author)
     * @param _noteId The ID of the note to edit
     * @param _newMessage The new message content
     */
    function editNote(uint256 _noteId, string calldata _newMessage) external {
        require(_noteId < notes.length, "Note does not exist");
        require(notes[_noteId].author == msg.sender, "Not the author");
        require(!notes[_noteId].isDeleted, "Note is deleted");
        require(bytes(_newMessage).length > 0, "Message cannot be empty");
        require(
            bytes(_newMessage).length <= MAX_MESSAGE_LENGTH,
            "Message exceeds maximum length"
        );

        notes[_noteId].message = _newMessage;
        notes[_noteId].isEdited = true;

        emit NoteEdited(_noteId, msg.sender, _newMessage, block.timestamp);
    }

    /**
     * @dev Delete a note (only by author)
     * @param _noteId The ID of the note to delete
     */
    function deleteNote(uint256 _noteId) external {
        require(_noteId < notes.length, "Note does not exist");
        require(notes[_noteId].author == msg.sender, "Not the author");
        require(!notes[_noteId].isDeleted, "Already deleted");

        notes[_noteId].isDeleted = true;
        if (userProfiles[msg.sender].totalNotes > 0) {
            userProfiles[msg.sender].totalNotes--;
        }

        emit NoteDeleted(_noteId, msg.sender, block.timestamp);
    }

    /**
     * @dev Post a reply to a note
     * @param _noteId The ID of the note to reply to
     * @param _message The reply message
     */
    function postReply(uint256 _noteId, string calldata _message) external {
        require(_noteId < notes.length, "Note does not exist");
        require(!notes[_noteId].isDeleted, "Note is deleted");
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(
            bytes(_message).length <= MAX_MESSAGE_LENGTH,
            "Message exceeds maximum length"
        );

        uint256 replyId = replies.length;

        replies.push(
            Reply({
                author: msg.sender,
                message: _message,
                timestamp: block.timestamp,
                noteId: _noteId
            })
        );

        noteReplies[_noteId].push(replyId);
        notes[_noteId].replyCount++;

        emit ReplyPosted(replyId, _noteId, msg.sender, _message, block.timestamp);
    }

    /**
     * @dev Get all notes from the board (including deleted)
     * @return Array of all notes
     */
    function getAllNotes() external view returns (Note[] memory) {
        return notes;
    }

    /**
     * @dev Get all active (non-deleted) notes
     * @return Array of active notes
     */
    function getActiveNotes() external view returns (Note[] memory) {
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < notes.length; i++) {
            if (!notes[i].isDeleted) {
                activeCount++;
            }
        }

        Note[] memory activeNotes = new Note[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < notes.length; i++) {
            if (!notes[i].isDeleted) {
                activeNotes[currentIndex] = notes[i];
                currentIndex++;
            }
        }

        return activeNotes;
    }

    /**
     * @dev Get the total number of notes
     * @return Total count of notes
     */
    function getTotalNotes() external view returns (uint256) {
        return notes.length;
    }

    /**
     * @dev Get a specific note by ID
     * @param _noteId The ID of the note to retrieve
     * @return The note data
     */
    function getNote(uint256 _noteId) external view returns (Note memory) {
        require(_noteId < notes.length, "Note does not exist");
        return notes[_noteId];
    }

    /**
     * @dev Get notes from a specific author
     * @param _author The address of the author
     * @return Array of note IDs from the specified author
     */
    function getUserNoteIds(address _author) external view returns (uint256[] memory) {
        return userNotes[_author];
    }

    /**
     * @dev Get notes from a specific author
     * @param _author The address of the author
     * @return Array of notes from the specified author
     */
    function getNotesByAuthor(address _author)
        external
        view
        returns (Note[] memory)
    {
        uint256 count = 0;
        
        for (uint256 i = 0; i < notes.length; i++) {
            if (notes[i].author == _author && !notes[i].isDeleted) {
                count++;
            }
        }

        Note[] memory authorNotes = new Note[](count);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < notes.length; i++) {
            if (notes[i].author == _author && !notes[i].isDeleted) {
                authorNotes[currentIndex] = notes[i];
                currentIndex++;
            }
        }

        return authorNotes;
    }

    /**
     * @dev Get replies for a specific note
     * @param _noteId The ID of the note
     * @return Array of replies
     */
    function getRepliesForNote(uint256 _noteId) external view returns (Reply[] memory) {
        require(_noteId < notes.length, "Note does not exist");
        
        uint256[] memory replyIds = noteReplies[_noteId];
        Reply[] memory noteRepliesArray = new Reply[](replyIds.length);
        
        for (uint256 i = 0; i < replyIds.length; i++) {
            noteRepliesArray[i] = replies[replyIds[i]];
        }
        
        return noteRepliesArray;
    }

    /**
     * @dev Get user profile
     * @param _user The address of the user
     * @return The user profile data
     */
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }

    /**
     * @dev Check if a user has liked a note
     * @param _noteId The ID of the note
     * @param _user The address of the user
     * @return True if liked, false otherwise
     */
    function hasLiked(uint256 _noteId, address _user) external view returns (bool) {
        require(_noteId < notes.length, "Note does not exist");
        return noteLikes[_noteId][_user];
    }

    /**
     * @dev Get trending notes (most liked in last period)
     * @param _limit Maximum number of notes to return
     * @return Array of trending notes
     */
    function getTrendingNotes(uint256 _limit) external view returns (Note[] memory) {
        uint256 limit = _limit > notes.length ? notes.length : _limit;
        Note[] memory trending = new Note[](limit);
        uint256[] memory noteIds = new uint256[](notes.length);
        
        uint256 activeCount = 0;
        for (uint256 i = 0; i < notes.length; i++) {
            if (!notes[i].isDeleted) {
                noteIds[activeCount] = i;
                activeCount++;
            }
        }

        for (uint256 i = 0; i < activeCount && i < limit; i++) {
            uint256 maxIndex = i;
            for (uint256 j = i + 1; j < activeCount; j++) {
                if (notes[noteIds[j]].likes > notes[noteIds[maxIndex]].likes) {
                    maxIndex = j;
                }
            }
            if (maxIndex != i) {
                uint256 temp = noteIds[i];
                noteIds[i] = noteIds[maxIndex];
                noteIds[maxIndex] = temp;
            }
            trending[i] = notes[noteIds[i]];
        }

        return trending;
    }
}

