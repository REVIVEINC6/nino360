// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISettlementAnchor} from "./ISettlementAnchor.sol";

contract SettlementAnchor is ISettlementAnchor {
    struct AnchorRecord { uint256 ts; address submitter; string artifactCID; }
    mapping(bytes32 => AnchorRecord) private anchors;

    function anchorRoot(bytes32 root, string calldata artifactCID) external returns (uint256 ts) {
        require(root != bytes32(0), "INVALID_ROOT");
        AnchorRecord storage rec = anchors[root];
        require(rec.ts == 0, "ALREADY_ANCHORED");
        uint256 nowTs = block.timestamp;
        anchors[root] = AnchorRecord({ ts: nowTs, submitter: msg.sender, artifactCID: artifactCID });
        emit AnchorRecorded(root, nowTs, msg.sender, artifactCID);
        return nowTs;
    }

    function getAnchor(bytes32 root) external view returns (uint256 ts, address submitter, string memory artifactCID) {
        AnchorRecord storage rec = anchors[root];
        return (rec.ts, rec.submitter, rec.artifactCID);
    }
}
