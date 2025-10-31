// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title NoteBoard
 * @dev A simple on-chain message board where users can post short notes
 */
contract NoteBoard {
    struct Note {
        address author;
        string message;
        uint256 timestamp;
    }

    Note[] private notes;
    
    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    event NotePosted(
        uint256 indexed noteId,
        address indexed author,
        string message,
        uint256 timestamp
    );

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
                timestamp: block.timestamp
            })
        );

        emit NotePosted(noteId, msg.sender, _message, block.timestamp);
    }

    /**
     * @dev Get all notes from the board
     * @return Array of all notes
     */
    function getAllNotes() external view returns (Note[] memory) {
        return notes;
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
     * @return Array of notes from the specified author
     */
    function getNotesByAuthor(address _author)
        external
        view
        returns (Note[] memory)
    {
        uint256 count = 0;
        
        // Count notes by author
        for (uint256 i = 0; i < notes.length; i++) {
            if (notes[i].author == _author) {
                count++;
            }
        }

        // Create array and populate
        Note[] memory authorNotes = new Note[](count);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < notes.length; i++) {
            if (notes[i].author == _author) {
                authorNotes[currentIndex] = notes[i];
                currentIndex++;
            }
        }

        return authorNotes;
    }
}

