// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISettlementAnchor {
    event AnchorRecorded(bytes32 indexed root, uint256 indexed ts, address indexed submitter, string artifactCID);

    function anchorRoot(bytes32 root, string calldata artifactCID) external returns (uint256 ts);

    function getAnchor(bytes32 root) external view returns (uint256 ts, address submitter, string memory artifactCID);
}
