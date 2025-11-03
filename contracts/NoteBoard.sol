// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title NoteBoard
 * @dev A comprehensive on-chain social platform with advanced features
 */
contract NoteBoard {
    enum ReactionType { LIKE, LOVE, LAUGH, WOW, SAD, ANGRY }

    struct Note {
        address author;
        string message;
        uint256 timestamp;
        uint256 likes;
        uint256 replyCount;
        bool isEdited;
        bool isDeleted;
        bool isPinned;
        string[] tags;
        string ipfsHash;
        uint256 tipAmount;
        uint256 repostCount;
    }

    struct Reply {
        address author;
        string message;
        uint256 timestamp;
        uint256 noteId;
    }

    struct UserProfile {
        string username;
        string bio;
        string avatarIpfsHash;
        uint256 totalNotes;
        uint256 totalLikes;
        uint256 followersCount;
        uint256 followingCount;
        bool exists;
        bool isPremium;
    }

    struct Reaction {
        ReactionType reactionType;
        uint256 count;
    }

    Note[] private notes;
    Reply[] private replies;
    
    // Existing mappings
    mapping(uint256 => mapping(address => bool)) public noteLikes;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256[]) private userNotes;
    mapping(uint256 => uint256[]) private noteReplies;
    
    // New mappings
    mapping(address => mapping(uint256 => bool)) public bookmarks;
    mapping(address => uint256[]) private userBookmarks;
    mapping(address => mapping(address => bool)) public following;
    mapping(address => address[]) private followers;
    mapping(address => address[]) private followingList;
    mapping(uint256 => mapping(ReactionType => uint256)) public noteReactions;
    mapping(uint256 => mapping(address => ReactionType)) public userReactions;
    mapping(address => uint256[]) private pinnedNotes;
    mapping(string => uint256[]) private taggedNotes;
    mapping(uint256 => uint256) public originalNoteId;
    
    uint256 public constant MAX_MESSAGE_LENGTH = 280;
    uint256 public constant MAX_USERNAME_LENGTH = 30;
    uint256 public constant MAX_BIO_LENGTH = 160;
    uint256 public constant MAX_TAGS = 5;
    uint256 public constant MAX_PINNED = 3;
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

    event NoteBookmarked(
        uint256 indexed noteId,
        address indexed user
    );

    event NoteUnbookmarked(
        uint256 indexed noteId,
        address indexed user
    );

    event UserFollowed(
        address indexed follower,
        address indexed following
    );

    event UserUnfollowed(
        address indexed follower,
        address indexed unfollowing
    );

    event NoteTipped(
        uint256 indexed noteId,
        address indexed tipper,
        uint256 amount
    );

    event NoteReacted(
        uint256 indexed noteId,
        address indexed user,
        ReactionType reactionType
    );

    event NotePinned(
        uint256 indexed noteId,
        address indexed user
    );

    event NoteUnpinned(
        uint256 indexed noteId,
        address indexed user
    );

    event NoteReposted(
        uint256 indexed originalNoteId,
        uint256 indexed repostNoteId,
        address indexed reposter
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
     * @dev Set bio for the caller
     * @param _bio The bio to set
     */
    function setBio(string calldata _bio) external {
        require(
            bytes(_bio).length <= MAX_BIO_LENGTH,
            "Bio too long"
        );

        if (!userProfiles[msg.sender].exists) {
            userProfiles[msg.sender].exists = true;
            totalUsers++;
        }

        userProfiles[msg.sender].bio = _bio;
    }

    /**
     * @dev Set avatar IPFS hash
     * @param _ipfsHash The IPFS hash of the avatar
     */
    function setAvatar(string calldata _ipfsHash) external {
        if (!userProfiles[msg.sender].exists) {
            userProfiles[msg.sender].exists = true;
            totalUsers++;
        }

        userProfiles[msg.sender].avatarIpfsHash = _ipfsHash;
    }

    /**
     * @dev Post a new note to the board
     * @param _message The message content (max 280 characters)
     * @param _tags Array of tags for the note
     * @param _ipfsHash IPFS hash for attached media (optional)
     */
    function postNote(
        string calldata _message, 
        string[] calldata _tags,
        string calldata _ipfsHash
    ) external {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(
            bytes(_message).length <= MAX_MESSAGE_LENGTH,
            "Message exceeds maximum length"
        );
        require(_tags.length <= MAX_TAGS, "Too many tags");

        uint256 noteId = notes.length;
        
        Note storage newNote = notes.push();
        newNote.author = msg.sender;
        newNote.message = _message;
        newNote.timestamp = block.timestamp;
        newNote.likes = 0;
        newNote.replyCount = 0;
        newNote.isEdited = false;
        newNote.isDeleted = false;
        newNote.isPinned = false;
        newNote.tags = _tags;
        newNote.ipfsHash = _ipfsHash;
        newNote.tipAmount = 0;
        newNote.repostCount = 0;

        userNotes[msg.sender].push(noteId);
        
        // Add to tagged notes
        for (uint256 i = 0; i < _tags.length; i++) {
            taggedNotes[_tags[i]].push(noteId);
        }
        
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
     * @dev Bookmark a note
     * @param _noteId The ID of the note to bookmark
     */
    function bookmarkNote(uint256 _noteId) external {
        require(_noteId < notes.length, "Note does not exist");
        require(!notes[_noteId].isDeleted, "Note is deleted");
        require(!bookmarks[msg.sender][_noteId], "Already bookmarked");

        bookmarks[msg.sender][_noteId] = true;
        userBookmarks[msg.sender].push(_noteId);

        emit NoteBookmarked(_noteId, msg.sender);
    }

    /**
     * @dev Remove bookmark from a note
     * @param _noteId The ID of the note to unbookmark
     */
    function unbookmarkNote(uint256 _noteId) external {
        require(_noteId < notes.length, "Note does not exist");
        require(bookmarks[msg.sender][_noteId], "Not bookmarked");

        bookmarks[msg.sender][_noteId] = false;

        emit NoteUnbookmarked(_noteId, msg.sender);
    }

    /**
     * @dev Follow a user
     * @param _userToFollow The address of the user to follow
     */
    function followUser(address _userToFollow) external {
        require(_userToFollow != msg.sender, "Cannot follow yourself");
        require(!following[msg.sender][_userToFollow], "Already following");

        following[msg.sender][_userToFollow] = true;
        followers[_userToFollow].push(msg.sender);
        followingList[msg.sender].push(_userToFollow);

        userProfiles[_userToFollow].followersCount++;
        userProfiles[msg.sender].followingCount++;

        emit UserFollowed(msg.sender, _userToFollow);
    }

    /**
     * @dev Unfollow a user
     * @param _userToUnfollow The address of the user to unfollow
     */
    function unfollowUser(address _userToUnfollow) external {
        require(following[msg.sender][_userToUnfollow], "Not following");

        following[msg.sender][_userToUnfollow] = false;

        if (userProfiles[_userToUnfollow].followersCount > 0) {
            userProfiles[_userToUnfollow].followersCount--;
        }
        if (userProfiles[msg.sender].followingCount > 0) {
            userProfiles[msg.sender].followingCount--;
        }

        emit UserUnfollowed(msg.sender, _userToUnfollow);
    }

    /**
     * @dev React to a note with emoji reaction
     * @param _noteId The ID of the note
     * @param _reactionType The type of reaction
     */
    function reactToNote(uint256 _noteId, ReactionType _reactionType) external {
        require(_noteId < notes.length, "Note does not exist");
        require(!notes[_noteId].isDeleted, "Note is deleted");

        // Remove old reaction if exists
        if (uint256(userReactions[_noteId][msg.sender]) > 0) {
            ReactionType oldReaction = userReactions[_noteId][msg.sender];
            if (noteReactions[_noteId][oldReaction] > 0) {
                noteReactions[_noteId][oldReaction]--;
            }
        }

        // Add new reaction
        userReactions[_noteId][msg.sender] = _reactionType;
        noteReactions[_noteId][_reactionType]++;

        emit NoteReacted(_noteId, msg.sender, _reactionType);
    }

    /**
     * @dev Pin a note to profile
     * @param _noteId The ID of the note to pin
     */
    function pinNote(uint256 _noteId) external {
        require(_noteId < notes.length, "Note does not exist");
        require(notes[_noteId].author == msg.sender, "Not the author");
        require(!notes[_noteId].isDeleted, "Note is deleted");
        require(!notes[_noteId].isPinned, "Already pinned");
        require(pinnedNotes[msg.sender].length < MAX_PINNED, "Max pinned reached");

        notes[_noteId].isPinned = true;
        pinnedNotes[msg.sender].push(_noteId);

        emit NotePinned(_noteId, msg.sender);
    }

    /**
     * @dev Unpin a note from profile
     * @param _noteId The ID of the note to unpin
     */
    function unpinNote(uint256 _noteId) external {
        require(_noteId < notes.length, "Note does not exist");
        require(notes[_noteId].author == msg.sender, "Not the author");
        require(notes[_noteId].isPinned, "Not pinned");

        notes[_noteId].isPinned = false;

        emit NoteUnpinned(_noteId, msg.sender);
    }

    /**
     * @dev Tip a note author with ETH
     * @param _noteId The ID of the note to tip
     */
    function tipNote(uint256 _noteId) external payable {
        require(_noteId < notes.length, "Note does not exist");
        require(!notes[_noteId].isDeleted, "Note is deleted");
        require(msg.value > 0, "Tip must be greater than 0");
        require(notes[_noteId].author != msg.sender, "Cannot tip yourself");

        notes[_noteId].tipAmount += msg.value;
        
        // Transfer ETH to note author
        (bool success, ) = payable(notes[_noteId].author).call{value: msg.value}("");
        require(success, "Tip transfer failed");

        emit NoteTipped(_noteId, msg.sender, msg.value);
    }

    /**
     * @dev Repost a note
     * @param _originalNoteId The ID of the note to repost
     * @param _additionalMessage Optional additional message
     */
    function repostNote(uint256 _originalNoteId, string calldata _additionalMessage) external {
        require(_originalNoteId < notes.length, "Note does not exist");
        require(!notes[_originalNoteId].isDeleted, "Note is deleted");

        uint256 repostId = notes.length;
        
        Note storage repost = notes.push();
        repost.author = msg.sender;
        repost.message = _additionalMessage;
        repost.timestamp = block.timestamp;
        repost.likes = 0;
        repost.replyCount = 0;
        repost.isEdited = false;
        repost.isDeleted = false;
        repost.isPinned = false;
        repost.ipfsHash = "";
        repost.tipAmount = 0;
        repost.repostCount = 0;

        originalNoteId[repostId] = _originalNoteId;
        notes[_originalNoteId].repostCount++;
        userNotes[msg.sender].push(repostId);

        if (!userProfiles[msg.sender].exists) {
            userProfiles[msg.sender].exists = true;
            totalUsers++;
        }
        userProfiles[msg.sender].totalNotes++;

        emit NoteReposted(_originalNoteId, repostId, msg.sender);
    }

    /**
     * @dev Upgrade to premium account (requires payment)
     */
    function upgradeToPremium() external payable {
        require(msg.value >= 0.01 ether, "Premium costs 0.01 ETH");
        require(!userProfiles[msg.sender].isPremium, "Already premium");

        if (!userProfiles[msg.sender].exists) {
            userProfiles[msg.sender].exists = true;
            totalUsers++;
        }

        userProfiles[msg.sender].isPremium = true;
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

    /**
     * @dev Get user's bookmarked notes
     * @param _user The address of the user
     * @return Array of bookmarked note IDs
     */
    function getUserBookmarks(address _user) external view returns (uint256[] memory) {
        return userBookmarks[_user];
    }

    /**
     * @dev Get user's followers
     * @param _user The address of the user
     * @return Array of follower addresses
     */
    function getFollowers(address _user) external view returns (address[] memory) {
        return followers[_user];
    }

    /**
     * @dev Get users that a user is following
     * @param _user The address of the user
     * @return Array of addresses being followed
     */
    function getFollowing(address _user) external view returns (address[] memory) {
        return followingList[_user];
    }

    /**
     * @dev Check if user is following another user
     * @param _follower The follower address
     * @param _following The address being checked
     * @return True if following, false otherwise
     */
    function isFollowing(address _follower, address _following) external view returns (bool) {
        return following[_follower][_following];
    }

    /**
     * @dev Get pinned notes for a user
     * @param _user The address of the user
     * @return Array of pinned note IDs
     */
    function getPinnedNotes(address _user) external view returns (uint256[] memory) {
        return pinnedNotes[_user];
    }

    /**
     * @dev Get notes by tag
     * @param _tag The tag to search for
     * @return Array of note IDs with that tag
     */
    function getNotesByTag(string calldata _tag) external view returns (uint256[] memory) {
        return taggedNotes[_tag];
    }

    /**
     * @dev Get reaction counts for a note
     * @param _noteId The ID of the note
     * @return Array of reaction counts [LIKE, LOVE, LAUGH, WOW, SAD, ANGRY]
     */
    function getReactions(uint256 _noteId) external view returns (uint256[6] memory) {
        require(_noteId < notes.length, "Note does not exist");
        
        uint256[6] memory reactions;
        reactions[0] = noteReactions[_noteId][ReactionType.LIKE];
        reactions[1] = noteReactions[_noteId][ReactionType.LOVE];
        reactions[2] = noteReactions[_noteId][ReactionType.LAUGH];
        reactions[3] = noteReactions[_noteId][ReactionType.WOW];
        reactions[4] = noteReactions[_noteId][ReactionType.SAD];
        reactions[5] = noteReactions[_noteId][ReactionType.ANGRY];
        
        return reactions;
    }

    /**
     * @dev Get user's reaction to a note
     * @param _noteId The ID of the note
     * @param _user The address of the user
     * @return The reaction type
     */
    function getUserReaction(uint256 _noteId, address _user) external view returns (ReactionType) {
        require(_noteId < notes.length, "Note does not exist");
        return userReactions[_noteId][_user];
    }

    /**
     * @dev Get original note ID for a repost
     * @param _repostId The ID of the repost
     * @return The original note ID (0 if not a repost)
     */
    function getOriginalNoteId(uint256 _repostId) external view returns (uint256) {
        return originalNoteId[_repostId];
    }

    /**
     * @dev Get feed for a user (notes from followed users)
     * @param _user The address of the user
     * @param _limit Maximum number of notes to return
     * @return Array of notes from followed users
     */
    function getFeed(address _user, uint256 _limit) external view returns (Note[] memory) {
        address[] memory following = followingList[_user];
        uint256 totalFeedNotes = 0;
        
        // Count total notes from followed users
        for (uint256 i = 0; i < following.length; i++) {
            totalFeedNotes += userNotes[following[i]].length;
        }

        if (totalFeedNotes == 0) {
            return new Note[](0);
        }

        uint256 limit = _limit > totalFeedNotes ? totalFeedNotes : _limit;
        Note[] memory feed = new Note[](limit);
        uint256 currentIndex = 0;

        // Collect notes from followed users
        for (uint256 i = 0; i < following.length && currentIndex < limit; i++) {
            uint256[] memory userNoteIds = userNotes[following[i]];
            
            for (uint256 j = userNoteIds.length; j > 0 && currentIndex < limit; j--) {
                uint256 noteId = userNoteIds[j - 1];
                if (!notes[noteId].isDeleted) {
                    feed[currentIndex] = notes[noteId];
                    currentIndex++;
                }
            }
        }

        return feed;
    }

    /**
     * @dev Search notes by keyword in message
     * @param _keyword The keyword to search for
     * @param _limit Maximum number of results
     * @return Array of matching notes
     */
    function searchNotes(string calldata _keyword, uint256 _limit) external view returns (Note[] memory) {
        bytes memory keywordBytes = bytes(_keyword);
        uint256 matchCount = 0;
        uint256[] memory matchingIds = new uint256[](notes.length);

        // Find matching notes
        for (uint256 i = 0; i < notes.length && matchCount < _limit; i++) {
            if (!notes[i].isDeleted) {
                bytes memory messageBytes = bytes(notes[i].message);
                if (contains(messageBytes, keywordBytes)) {
                    matchingIds[matchCount] = i;
                    matchCount++;
                }
            }
        }

        // Create result array
        uint256 resultSize = matchCount < _limit ? matchCount : _limit;
        Note[] memory results = new Note[](resultSize);
        
        for (uint256 i = 0; i < resultSize; i++) {
            results[i] = notes[matchingIds[i]];
        }

        return results;
    }

    /**
     * @dev Helper function to check if bytes contains substring
     * @param _text The text to search in
     * @param _substring The substring to find
     * @return True if substring found, false otherwise
     */
    function contains(bytes memory _text, bytes memory _substring) private pure returns (bool) {
        if (_substring.length > _text.length) {
            return false;
        }

        for (uint256 i = 0; i <= _text.length - _substring.length; i++) {
            bool found = true;
            for (uint256 j = 0; j < _substring.length; j++) {
                if (_text[i + j] != _substring[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get platform statistics
     * @return totalUsers, totalNotes, totalReplies
     */
    function getPlatformStats() external view returns (uint256, uint256, uint256) {
        return (totalUsers, notes.length, replies.length);
    }

    /**
     * @dev Get recent notes (latest first)
     * @param _limit Maximum number of notes to return
     * @return Array of recent notes
     */
    function getRecentNotes(uint256 _limit) external view returns (Note[] memory) {
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < notes.length; i++) {
            if (!notes[i].isDeleted) {
                activeCount++;
            }
        }

        uint256 limit = _limit > activeCount ? activeCount : _limit;
        Note[] memory recent = new Note[](limit);
        uint256 currentIndex = 0;

        for (uint256 i = notes.length; i > 0 && currentIndex < limit; i--) {
            if (!notes[i - 1].isDeleted) {
                recent[currentIndex] = notes[i - 1];
                currentIndex++;
            }
        }

        return recent;
    }
}

