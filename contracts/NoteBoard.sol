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
        uint256 threadId;
        uint256 replyToNoteId;
        address[] mentions;
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
        bool isVerified;
        uint256 joinDate;
        uint256 lastActive;
        uint256 streakDays;
    }

    struct Reaction {
        ReactionType reactionType;
        uint256 count;
    }

    struct Poll {
        uint256 noteId;
        string[] options;
        uint256[] votes;
        uint256 endTime;
        bool isActive;
    }

    struct Community {
        string name;
        string description;
        address creator;
        uint256 memberCount;
        uint256 createdAt;
        bool isPrivate;
        uint256 subscriptionFee;
    }

    struct Subscription {
        address subscriber;
        address creator;
        uint256 expiresAt;
        bool isActive;
    }

    Note[] private notes;
    Reply[] private replies;
    Poll[] private polls;
    Community[] private communities;
    
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
    
    // Advanced features
    mapping(address => mapping(address => bool)) public blocked;
    mapping(address => mapping(address => bool)) public muted;
    mapping(uint256 => uint256) public reportCount;
    mapping(uint256 => mapping(address => bool)) public hasReported;
    mapping(uint256 => uint256[]) public noteThreads;
    mapping(address => uint256[]) public userMentions;
    mapping(address => string[]) public userBadges;
    
    // Polls
    mapping(uint256 => uint256) public noteToPoll;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public userVote;
    
    // Communities
    mapping(uint256 => mapping(address => bool)) public communityMembers;
    mapping(uint256 => address[]) private communityMemberList;
    mapping(uint256 => uint256[]) private communityNotes;
    
    // Subscriptions
    mapping(address => mapping(address => Subscription)) public subscriptions;
    mapping(address => address[]) private subscribers;
    mapping(address => uint256) public subscriptionPrice;
    
    // Engagement rewards
    mapping(address => uint256) public rewardPoints;
    mapping(address => uint256) public totalEarnings;
    
    // NFT Profile Picture
    mapping(address => address) public profileNFTContract;
    mapping(address => uint256) public profileNFTTokenId;
    
    address public owner;
    mapping(address => bool) public moderators;
    uint256 public platformFee = 100; // 1% (in basis points)
    
    uint256 public constant MAX_MESSAGE_LENGTH = 280;
    uint256 public constant MAX_USERNAME_LENGTH = 30;
    uint256 public constant MAX_BIO_LENGTH = 160;
    uint256 public constant MAX_TAGS = 5;
    uint256 public constant MAX_PINNED = 3;
    uint256 public constant REPORT_THRESHOLD = 10;
    uint256 public constant MAX_POLL_OPTIONS = 10;
    uint256 public constant POINTS_PER_NOTE = 10;
    uint256 public constant POINTS_PER_LIKE_RECEIVED = 5;
    uint256 public constant POINTS_PER_REPLY = 3;
    uint256 public totalUsers;
    uint256 public threadCount;

    constructor() {
        owner = msg.sender;
        moderators[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyModerator() {
        require(moderators[msg.sender], "Not moderator");
        _;
    }

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

    event UserBlocked(address indexed blocker, address indexed blocked);
    event UserUnblocked(address indexed blocker, address indexed unblocked);
    event UserMuted(address indexed muter, address indexed muted);
    event UserUnmuted(address indexed muter, address indexed unmuted);
    event NoteReported(uint256 indexed noteId, address indexed reporter);
    event UserVerified(address indexed user);
    event BadgeAwarded(address indexed user, string badge);
    event ModeratorAdded(address indexed moderator);
    event ModeratorRemoved(address indexed moderator);
    event PollCreated(uint256 indexed pollId, uint256 indexed noteId, address indexed creator);
    event PollVoted(uint256 indexed pollId, address indexed voter, uint256 optionIndex);
    event CommunityCreated(uint256 indexed communityId, address indexed creator, string name);
    event CommunityJoined(uint256 indexed communityId, address indexed member);
    event CommunityLeft(uint256 indexed communityId, address indexed member);
    event Subscribed(address indexed subscriber, address indexed creator, uint256 expiresAt);
    event SubscriptionRenewed(address indexed subscriber, address indexed creator, uint256 newExpiry);
    event RewardsClaimed(address indexed user, uint256 amount);
    event ProfileNFTSet(address indexed user, address nftContract, uint256 tokenId);

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
            userProfiles[msg.sender].joinDate = block.timestamp;
        }

        userProfiles[msg.sender].username = _username;
        userProfiles[msg.sender].exists = true;
        userProfiles[msg.sender].lastActive = block.timestamp;
        _updateStreak(msg.sender);

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
     * @param _threadId Thread ID (0 for new thread)
     * @param _replyToNoteId Note ID being replied to (0 if not a reply)
     * @param _mentions Array of addresses mentioned
     */
    function postNote(
        string calldata _message, 
        string[] calldata _tags,
        string calldata _ipfsHash,
        uint256 _threadId,
        uint256 _replyToNoteId,
        address[] calldata _mentions
    ) external {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(
            bytes(_message).length <= MAX_MESSAGE_LENGTH,
            "Message exceeds maximum length"
        );
        require(_tags.length <= MAX_TAGS, "Too many tags");

        uint256 noteId = notes.length;
        uint256 threadId = _threadId;
        
        // Create new thread if not specified
        if (threadId == 0) {
            threadId = threadCount++;
        }
        
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
        newNote.threadId = threadId;
        newNote.replyToNoteId = _replyToNoteId;
        newNote.mentions = _mentions;

        userNotes[msg.sender].push(noteId);
        noteThreads[threadId].push(noteId);
        
        // Add to tagged notes
        for (uint256 i = 0; i < _tags.length; i++) {
            taggedNotes[_tags[i]].push(noteId);
        }
        
        // Track mentions
        for (uint256 i = 0; i < _mentions.length; i++) {
            userMentions[_mentions[i]].push(noteId);
        }
        
        if (!userProfiles[msg.sender].exists) {
            userProfiles[msg.sender].exists = true;
            userProfiles[msg.sender].joinDate = block.timestamp;
            totalUsers++;
        }
        userProfiles[msg.sender].totalNotes++;
        userProfiles[msg.sender].lastActive = block.timestamp;
        _updateStreak(msg.sender);
        
        // Award points for posting
        rewardPoints[msg.sender] += POINTS_PER_NOTE;
        _checkMilestones(msg.sender);

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
        
        // Award points to note author
        rewardPoints[notes[_noteId].author] += POINTS_PER_LIKE_RECEIVED;

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
        
        // Award points for replying
        rewardPoints[msg.sender] += POINTS_PER_REPLY;

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
            userProfiles[msg.sender].joinDate = block.timestamp;
            totalUsers++;
        }

        userProfiles[msg.sender].isPremium = true;
        _awardBadge(msg.sender, "Premium Member");
    }

    /**
     * @dev Block a user
     * @param _user The address to block
     */
    function blockUser(address _user) external {
        require(_user != msg.sender, "Cannot block yourself");
        require(!blocked[msg.sender][_user], "Already blocked");

        blocked[msg.sender][_user] = true;
        
        // Unfollow if following
        if (following[msg.sender][_user]) {
            following[msg.sender][_user] = false;
            if (userProfiles[_user].followersCount > 0) {
                userProfiles[_user].followersCount--;
            }
            if (userProfiles[msg.sender].followingCount > 0) {
                userProfiles[msg.sender].followingCount--;
            }
        }

        emit UserBlocked(msg.sender, _user);
    }

    /**
     * @dev Unblock a user
     * @param _user The address to unblock
     */
    function unblockUser(address _user) external {
        require(blocked[msg.sender][_user], "Not blocked");

        blocked[msg.sender][_user] = false;

        emit UserUnblocked(msg.sender, _user);
    }

    /**
     * @dev Mute a user
     * @param _user The address to mute
     */
    function muteUser(address _user) external {
        require(_user != msg.sender, "Cannot mute yourself");
        require(!muted[msg.sender][_user], "Already muted");

        muted[msg.sender][_user] = true;

        emit UserMuted(msg.sender, _user);
    }

    /**
     * @dev Unmute a user
     * @param _user The address to unmute
     */
    function unmuteUser(address _user) external {
        require(muted[msg.sender][_user], "Not muted");

        muted[msg.sender][_user] = false;

        emit UserUnmuted(msg.sender, _user);
    }

    /**
     * @dev Report a note
     * @param _noteId The ID of the note to report
     */
    function reportNote(uint256 _noteId) external {
        require(_noteId < notes.length, "Note does not exist");
        require(!hasReported[_noteId][msg.sender], "Already reported");

        hasReported[_noteId][msg.sender] = true;
        reportCount[_noteId]++;

        emit NoteReported(_noteId, msg.sender);

        // Auto-delete if threshold reached
        if (reportCount[_noteId] >= REPORT_THRESHOLD && !notes[_noteId].isDeleted) {
            notes[_noteId].isDeleted = true;
        }
    }

    /**
     * @dev Verify a user (moderator only)
     * @param _user The address to verify
     */
    function verifyUser(address _user) external onlyModerator {
        require(userProfiles[_user].exists, "User does not exist");
        require(!userProfiles[_user].isVerified, "Already verified");

        userProfiles[_user].isVerified = true;
        _awardBadge(_user, "Verified");

        emit UserVerified(_user);
    }

    /**
     * @dev Add a moderator (owner only)
     * @param _moderator The address to add as moderator
     */
    function addModerator(address _moderator) external onlyOwner {
        require(!moderators[_moderator], "Already a moderator");

        moderators[_moderator] = true;

        emit ModeratorAdded(_moderator);
    }

    /**
     * @dev Remove a moderator (owner only)
     * @param _moderator The address to remove from moderators
     */
    function removeModerator(address _moderator) external onlyOwner {
        require(moderators[_moderator], "Not a moderator");
        require(_moderator != owner, "Cannot remove owner");

        moderators[_moderator] = false;

        emit ModeratorRemoved(_moderator);
    }

    /**
     * @dev Create a poll attached to a note
     * @param _noteId The note ID to attach poll to
     * @param _options Array of poll options
     * @param _duration Duration in seconds
     */
    function createPoll(uint256 _noteId, string[] calldata _options, uint256 _duration) external {
        require(_noteId < notes.length, "Note does not exist");
        require(notes[_noteId].author == msg.sender, "Not the author");
        require(_options.length >= 2 && _options.length <= MAX_POLL_OPTIONS, "Invalid options count");
        require(_duration > 0, "Invalid duration");

        uint256 pollId = polls.length;
        uint256[] memory votes = new uint256[](_options.length);
        
        polls.push(Poll({
            noteId: _noteId,
            options: _options,
            votes: votes,
            endTime: block.timestamp + _duration,
            isActive: true
        }));

        noteToPoll[_noteId] = pollId;

        emit PollCreated(pollId, _noteId, msg.sender);
    }

    /**
     * @dev Vote on a poll
     * @param _pollId The poll ID
     * @param _optionIndex The option to vote for
     */
    function voteOnPoll(uint256 _pollId, uint256 _optionIndex) external {
        require(_pollId < polls.length, "Poll does not exist");
        require(polls[_pollId].isActive, "Poll not active");
        require(block.timestamp < polls[_pollId].endTime, "Poll ended");
        require(_optionIndex < polls[_pollId].options.length, "Invalid option");
        require(!hasVoted[_pollId][msg.sender], "Already voted");

        hasVoted[_pollId][msg.sender] = true;
        userVote[_pollId][msg.sender] = _optionIndex;
        polls[_pollId].votes[_optionIndex]++;

        emit PollVoted(_pollId, msg.sender, _optionIndex);
    }

    /**
     * @dev Create a community
     * @param _name Community name
     * @param _description Community description
     * @param _isPrivate Whether community is private
     * @param _subscriptionFee Fee to join (0 for free)
     */
    function createCommunity(
        string calldata _name,
        string calldata _description,
        bool _isPrivate,
        uint256 _subscriptionFee
    ) external {
        uint256 communityId = communities.length;
        
        communities.push(Community({
            name: _name,
            description: _description,
            creator: msg.sender,
            memberCount: 1,
            createdAt: block.timestamp,
            isPrivate: _isPrivate,
            subscriptionFee: _subscriptionFee
        }));

        communityMembers[communityId][msg.sender] = true;
        communityMemberList[communityId].push(msg.sender);

        emit CommunityCreated(communityId, msg.sender, _name);
    }

    /**
     * @dev Join a community
     * @param _communityId The community ID
     */
    function joinCommunity(uint256 _communityId) external payable {
        require(_communityId < communities.length, "Community does not exist");
        require(!communityMembers[_communityId][msg.sender], "Already a member");
        require(msg.value >= communities[_communityId].subscriptionFee, "Insufficient fee");

        communityMembers[_communityId][msg.sender] = true;
        communityMemberList[_communityId].push(msg.sender);
        communities[_communityId].memberCount++;

        // Transfer fee to creator
        if (msg.value > 0) {
            uint256 fee = (msg.value * platformFee) / 10000;
            uint256 creatorAmount = msg.value - fee;
            payable(communities[_communityId].creator).transfer(creatorAmount);
        }

        emit CommunityJoined(_communityId, msg.sender);
    }

    /**
     * @dev Leave a community
     * @param _communityId The community ID
     */
    function leaveCommunity(uint256 _communityId) external {
        require(_communityId < communities.length, "Community does not exist");
        require(communityMembers[_communityId][msg.sender], "Not a member");
        require(communities[_communityId].creator != msg.sender, "Creator cannot leave");

        communityMembers[_communityId][msg.sender] = false;
        if (communities[_communityId].memberCount > 0) {
            communities[_communityId].memberCount--;
        }

        emit CommunityLeft(_communityId, msg.sender);
    }

    /**
     * @dev Subscribe to a creator
     * @param _creator The creator address
     * @param _duration Duration in seconds
     */
    function subscribe(address _creator, uint256 _duration) external payable {
        require(_creator != msg.sender, "Cannot subscribe to yourself");
        require(subscriptionPrice[_creator] > 0, "Creator not accepting subscriptions");
        require(msg.value >= subscriptionPrice[_creator], "Insufficient payment");

        uint256 expiresAt = block.timestamp + _duration;
        
        subscriptions[msg.sender][_creator] = Subscription({
            subscriber: msg.sender,
            creator: _creator,
            expiresAt: expiresAt,
            isActive: true
        });

        subscribers[_creator].push(msg.sender);

        // Transfer subscription fee
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 creatorAmount = msg.value - fee;
        totalEarnings[_creator] += creatorAmount;
        payable(_creator).transfer(creatorAmount);

        emit Subscribed(msg.sender, _creator, expiresAt);
    }

    /**
     * @dev Set subscription price
     * @param _price Price per month in wei
     */
    function setSubscriptionPrice(uint256 _price) external {
        subscriptionPrice[msg.sender] = _price;
    }

    /**
     * @dev Claim reward points (convert to ETH if available)
     * @param _amount Amount of points to claim
     */
    function claimRewards(uint256 _amount) external {
        require(rewardPoints[msg.sender] >= _amount, "Insufficient points");
        
        rewardPoints[msg.sender] -= _amount;
        
        // Convert points to ETH (if contract has balance)
        uint256 ethAmount = (_amount * 1 ether) / 100000; // Example conversion rate
        
        if (address(this).balance >= ethAmount) {
            payable(msg.sender).transfer(ethAmount);
            emit RewardsClaimed(msg.sender, ethAmount);
        }
    }

    /**
     * @dev Set NFT as profile picture
     * @param _nftContract NFT contract address
     * @param _tokenId Token ID
     */
    function setProfileNFT(address _nftContract, uint256 _tokenId) external {
        // In production, verify ownership via ERC721 interface
        profileNFTContract[msg.sender] = _nftContract;
        profileNFTTokenId[msg.sender] = _tokenId;

        emit ProfileNFTSet(msg.sender, _nftContract, _tokenId);
    }

    /**
     * @dev Withdraw platform fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }

    /**
     * @dev Check milestones and award badges
     * @param _user The user address
     */
    function _checkMilestones(address _user) private {
        uint256 notes = userProfiles[_user].totalNotes;
        uint256 likes = userProfiles[_user].totalLikes;
        
        if (notes == 1) _awardBadge(_user, "First Note");
        if (notes == 10) _awardBadge(_user, "10 Notes");
        if (notes == 100) _awardBadge(_user, "Century");
        if (notes == 1000) _awardBadge(_user, "Prolific Writer");
        
        if (likes == 100) _awardBadge(_user, "100 Likes");
        if (likes == 1000) _awardBadge(_user, "1K Likes");
        if (likes == 10000) _awardBadge(_user, "10K Likes");
    }

    /**
     * @dev Award a badge to a user
     * @param _user The address of the user
     * @param _badge The badge name
     */
    function _awardBadge(address _user, string memory _badge) private {
        userBadges[_user].push(_badge);
        emit BadgeAwarded(_user, _badge);
    }

    /**
     * @dev Update user activity streak
     * @param _user The address of the user
     */
    function _updateStreak(address _user) private {
        uint256 lastActive = userProfiles[_user].lastActive;
        
        if (lastActive > 0) {
            uint256 daysSinceActive = (block.timestamp - lastActive) / 1 days;
            
            if (daysSinceActive == 1) {
                // Consecutive day
                userProfiles[_user].streakDays++;
                
                // Award badges for streaks
                if (userProfiles[_user].streakDays == 7) {
                    _awardBadge(_user, "7-Day Streak");
                } else if (userProfiles[_user].streakDays == 30) {
                    _awardBadge(_user, "30-Day Streak");
                } else if (userProfiles[_user].streakDays == 100) {
                    _awardBadge(_user, "100-Day Streak");
                }
            } else if (daysSinceActive > 1) {
                // Streak broken
                userProfiles[_user].streakDays = 1;
            }
        } else {
            userProfiles[_user].streakDays = 1;
        }
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

    /**
     * @dev Check if user is blocked
     * @param _blocker The blocker address
     * @param _blocked The blocked address
     * @return True if blocked, false otherwise
     */
    function isBlocked(address _blocker, address _blocked) external view returns (bool) {
        return blocked[_blocker][_blocked];
    }

    /**
     * @dev Check if user is muted
     * @param _muter The muter address
     * @param _muted The muted address
     * @return True if muted, false otherwise
     */
    function isMuted(address _muter, address _muted) external view returns (bool) {
        return muted[_muter][_muted];
    }

    /**
     * @dev Get notes in a thread
     * @param _threadId The thread ID
     * @return Array of notes in the thread
     */
    function getThreadNotes(uint256 _threadId) external view returns (Note[] memory) {
        uint256[] memory noteIds = noteThreads[_threadId];
        Note[] memory threadNotes = new Note[](noteIds.length);
        
        for (uint256 i = 0; i < noteIds.length; i++) {
            threadNotes[i] = notes[noteIds[i]];
        }
        
        return threadNotes;
    }

    /**
     * @dev Get notes where user is mentioned
     * @param _user The address of the user
     * @return Array of note IDs where user is mentioned
     */
    function getUserMentions(address _user) external view returns (uint256[] memory) {
        return userMentions[_user];
    }

    /**
     * @dev Get user's badges
     * @param _user The address of the user
     * @return Array of badge names
     */
    function getUserBadges(address _user) external view returns (string[] memory) {
        return userBadges[_user];
    }

    /**
     * @dev Get report count for a note
     * @param _noteId The ID of the note
     * @return Number of reports
     */
    function getReportCount(uint256 _noteId) external view returns (uint256) {
        require(_noteId < notes.length, "Note does not exist");
        return reportCount[_noteId];
    }

    /**
     * @dev Check if user is a moderator
     * @param _user The address to check
     * @return True if moderator, false otherwise
     */
    function isModerator(address _user) external view returns (bool) {
        return moderators[_user];
    }

    /**
     * @dev Get contract owner
     * @return Owner address
     */
    function getOwner() external view returns (address) {
        return owner;
    }

    /**
     * @dev Get poll details
     * @param _pollId The poll ID
     * @return Poll data
     */
    function getPoll(uint256 _pollId) external view returns (Poll memory) {
        require(_pollId < polls.length, "Poll does not exist");
        return polls[_pollId];
    }

    /**
     * @dev Get poll for a note
     * @param _noteId The note ID
     * @return Poll ID (0 if no poll)
     */
    function getPollForNote(uint256 _noteId) external view returns (uint256) {
        return noteToPoll[_noteId];
    }

    /**
     * @dev Check if user voted on poll
     * @param _pollId The poll ID
     * @param _user The user address
     * @return True if voted
     */
    function hasUserVoted(uint256 _pollId, address _user) external view returns (bool) {
        return hasVoted[_pollId][_user];
    }

    /**
     * @dev Get community details
     * @param _communityId The community ID
     * @return Community data
     */
    function getCommunity(uint256 _communityId) external view returns (Community memory) {
        require(_communityId < communities.length, "Community does not exist");
        return communities[_communityId];
    }

    /**
     * @dev Get all communities
     * @return Array of communities
     */
    function getAllCommunities() external view returns (Community[] memory) {
        return communities;
    }

    /**
     * @dev Check if user is community member
     * @param _communityId The community ID
     * @param _user The user address
     * @return True if member
     */
    function isCommunityMember(uint256 _communityId, address _user) external view returns (bool) {
        return communityMembers[_communityId][_user];
    }

    /**
     * @dev Get community members
     * @param _communityId The community ID
     * @return Array of member addresses
     */
    function getCommunityMembers(uint256 _communityId) external view returns (address[] memory) {
        require(_communityId < communities.length, "Community does not exist");
        return communityMemberList[_communityId];
    }

    /**
     * @dev Check if user is subscribed to creator
     * @param _subscriber The subscriber address
     * @param _creator The creator address
     * @return True if active subscription
     */
    function isSubscribed(address _subscriber, address _creator) external view returns (bool) {
        Subscription memory sub = subscriptions[_subscriber][_creator];
        return sub.isActive && sub.expiresAt > block.timestamp;
    }

    /**
     * @dev Get subscriber list for creator
     * @param _creator The creator address
     * @return Array of subscriber addresses
     */
    function getSubscribers(address _creator) external view returns (address[] memory) {
        return subscribers[_creator];
    }

    /**
     * @dev Get user's reward points
     * @param _user The user address
     * @return Points balance
     */
    function getRewardPoints(address _user) external view returns (uint256) {
        return rewardPoints[_user];
    }

    /**
     * @dev Get user's total earnings
     * @param _user The user address
     * @return Total earnings in wei
     */
    function getTotalEarnings(address _user) external view returns (uint256) {
        return totalEarnings[_user];
    }

    /**
     * @dev Get user's profile NFT
     * @param _user The user address
     * @return NFT contract and token ID
     */
    function getProfileNFT(address _user) external view returns (address, uint256) {
        return (profileNFTContract[_user], profileNFTTokenId[_user]);
    }

    /**
     * @dev Get leaderboard (top users by points)
     * @param _limit Number of users to return
     * @return Arrays of addresses and points
     */
    function getLeaderboard(uint256 _limit) external view returns (address[] memory, uint256[] memory) {
        // This is a simplified version - in production, consider using subgraph
        uint256 limit = _limit > totalUsers ? totalUsers : _limit;
        address[] memory topUsers = new address[](limit);
        uint256[] memory topPoints = new uint256[](limit);
        
        // Note: This is gas-intensive for large user bases
        // Better to track separately or use off-chain indexing
        
        return (topUsers, topPoints);
    }

    /**
     * @dev Fallback to receive ETH
     */
    receive() external payable {}
}

