// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract FoodGovernanceDAO is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct Proposal {
        uint256 id;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 endTime;
        bool executed;
    }

    uint256 public nextProposalId;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    // Ultra-light UI-driven proposal creation
    function createProposal(uint256 duration) external returns (uint256 proposalId) {
        proposalId = ++nextProposalId;
        proposals[proposalId] = Proposal({
            id: proposalId,
            yesVotes: 0,
            noVotes: 0,
            endTime: block.timestamp + duration,
            executed: false
        });
        emit ProposalCreated(proposalId);
    }

    // 1 Address = 1 Vote simplicity
    function vote(uint256 proposalId, bool support) external {
        require(proposalId > 0 && proposalId <= nextProposalId, "Invalid proposal");
        require(block.timestamp < proposals[proposalId].endTime, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(!proposals[proposalId].executed, "Already executed");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposals[proposalId].yesVotes++;
        } else {
            proposals[proposalId].noVotes++;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    // Mark as executed for history tracking
    function executeProposal(uint256 proposalId) external onlyRole(OPERATOR_ROLE) {
        require(proposalId > 0 && proposalId <= nextProposalId, "Invalid proposal");
        require(block.timestamp >= proposals[proposalId].endTime, "Voting is still active");
        require(!proposals[proposalId].executed, "Already executed");
        require(proposals[proposalId].yesVotes > proposals[proposalId].noVotes, "Proposal rejected");

        proposals[proposalId].executed = true;
        
        emit ProposalExecuted(proposalId);
    }
}
