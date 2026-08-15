// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EduSuccessRegistry
 * @dev Decentralized Academic Integrity, Attendance Ledger, and Intervention Audit System for EduSuccess AI.
 * Enables tamper-proof credentialing, immutable counseling logs, and automated smart-grant financial aid.
 */
contract EduSuccessRegistry {
    address public immutable owner;
    string public institutionName;
    string public consortiumNetwork;

    // Authorized institutional relayers (teachers, counselors, automated oracle services)
    mapping(address => bool) public isAuthorizedRelayer;

    struct AttendanceBatchRecord {
        string date;
        bytes32 batchHash;
        uint256 studentCount;
        uint256 timestamp;
        uint256 blockNumber;
    }

    struct AcademicCredential {
        string studentId;
        string rollNo;
        uint256 cgpaScaled; // e.g. 845 for 8.45 CGPA
        uint256 backlogs;
        bytes32 recordHash;
        uint256 timestamp;
        bool isVerified;
    }

    struct InterventionLog {
        uint256 logId;
        string studentId;
        string counselorId;
        string actionType;
        string ipfsHash;
        uint256 timestamp;
    }

    struct SmartGrant {
        uint256 grantId;
        string studentId;
        uint256 amountInWei;
        address beneficiary;
        string eligibilityCriteria;
        uint256 timestamp;
    }

    // State mappings
    mapping(string => AttendanceBatchRecord) public attendanceBatches; // date -> record
    mapping(string => AcademicCredential) public studentCredentials;   // studentId -> credential
    mapping(bytes32 => bool) public registeredRecordHashes;
    
    InterventionLog[] public interventionAuditTrail;
    SmartGrant[] public grantDisbursements;

    // Events for real-time Web3 listening and indexers
    event AttendanceBatchCommitted(
        string indexed date,
        bytes32 indexed batchHash,
        uint256 studentCount,
        uint256 timestamp
    );

    event AcademicCredentialAnchored(
        string indexed studentId,
        string rollNo,
        bytes32 indexed recordHash,
        uint256 cgpaScaled,
        uint256 timestamp
    );

    event InterventionAudited(
        uint256 indexed logId,
        string indexed studentId,
        string counselorId,
        string actionType,
        string ipfsHash,
        uint256 timestamp
    );

    event SmartGrantDisbursed(
        uint256 indexed grantId,
        string indexed studentId,
        uint256 amountInWei,
        address indexed beneficiary,
        string criteria,
        uint256 timestamp
    );

    event RelayerStatusUpdated(address indexed relayer, bool isAuthorized);

    modifier onlyOwner() {
        require(msg.sender == owner, "EduSuccessRegistry: caller is not the owner");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || isAuthorizedRelayer[msg.sender], "EduSuccessRegistry: caller not authorized");
        _;
    }

    constructor(string memory _institutionName, string memory _consortiumNetwork) {
        owner = msg.sender;
        institutionName = _institutionName;
        consortiumNetwork = _consortiumNetwork;
        isAuthorizedRelayer[msg.sender] = true;
    }

    function setRelayerStatus(address _relayer, bool _status) external onlyOwner {
        isAuthorizedRelayer[_relayer] = _status;
        emit RelayerStatusUpdated(_relayer, _status);
    }

    /**
     * @notice Commits daily or monthly attendance batch cryptographic hash to the blockchain ledger.
     */
    function commitAttendanceBatch(
        string calldata _date,
        bytes32 _batchHash,
        uint256 _studentCount
    ) external onlyAuthorized {
        require(_batchHash != bytes32(0), "Invalid batch hash");

        attendanceBatches[_date] = AttendanceBatchRecord({
            date: _date,
            batchHash: _batchHash,
            studentCount: _studentCount,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        registeredRecordHashes[_batchHash] = true;

        emit AttendanceBatchCommitted(_date, _batchHash, _studentCount, block.timestamp);
    }

    /**
     * @notice Anchors student academic integrity snapshot (CGPA, backlogs, proof hash) on-chain.
     */
    function anchorAcademicCredential(
        string calldata _studentId,
        string calldata _rollNo,
        uint256 _cgpaScaled,
        uint256 _backlogs,
        bytes32 _recordHash
    ) external onlyAuthorized {
        require(_recordHash != bytes32(0), "Invalid record hash");

        studentCredentials[_studentId] = AcademicCredential({
            studentId: _studentId,
            rollNo: _rollNo,
            cgpaScaled: _cgpaScaled,
            backlogs: _backlogs,
            recordHash: _recordHash,
            timestamp: block.timestamp,
            isVerified: true
        });

        registeredRecordHashes[_recordHash] = true;

        emit AcademicCredentialAnchored(_studentId, _rollNo, _recordHash, _cgpaScaled, block.timestamp);
    }

    /**
     * @notice Logs counseling, parent notice, or remedial interventions immutably.
     */
    function recordInterventionAudit(
        string calldata _studentId,
        string calldata _counselorId,
        string calldata _actionType,
        string calldata _ipfsHash
    ) external onlyAuthorized returns (uint256) {
        uint256 logId = interventionAuditTrail.length + 1;

        InterventionLog memory log = InterventionLog({
            logId: logId,
            studentId: _studentId,
            counselorId: _counselorId,
            actionType: _actionType,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp
        });

        interventionAuditTrail.push(log);

        emit InterventionAudited(logId, _studentId, _counselorId, _actionType, _ipfsHash, block.timestamp);
        return logId;
    }

    /**
     * @notice Automated Smart-Contract scholarship disbursement for eligible at-risk students.
     */
    function disburseSmartGrant(
        string calldata _studentId,
        address payable _beneficiary,
        string calldata _criteria
    ) external payable onlyAuthorized returns (uint256) {
        require(_beneficiary != address(0), "Invalid beneficiary address");

        uint256 grantId = grantDisbursements.length + 1;

        SmartGrant memory grant = SmartGrant({
            grantId: grantId,
            studentId: _studentId,
            amountInWei: msg.value,
            beneficiary: _beneficiary,
            eligibilityCriteria: _criteria,
            timestamp: block.timestamp
        });

        grantDisbursements.push(grant);

        if (msg.value > 0) {
            (bool sent, ) = _beneficiary.call{value: msg.value}("");
            require(sent, "Failed to send Ether grant");
        }

        emit SmartGrantDisbursed(grantId, _studentId, msg.value, _beneficiary, _criteria, block.timestamp);
        return grantId;
    }

    /**
     * @notice Public verification endpoint for employers, universities, or parents.
     */
    function verifyStudentIntegrity(
        string calldata _studentId,
        bytes32 _providedHash
    ) external view returns (bool isValid, uint256 anchoredAt, bytes32 onChainHash, string memory rollNo) {
        AcademicCredential memory cred = studentCredentials[_studentId];
        if (cred.timestamp == 0) {
            return (false, 0, bytes32(0), "");
        }
        bool matches = (cred.recordHash == _providedHash);
        return (matches, cred.timestamp, cred.recordHash, cred.rollNo);
    }

    function getInterventionLogsCount() external view returns (uint256) {
        return interventionAuditTrail.length;
    }

    function getGrantDisbursementsCount() external view returns (uint256) {
        return grantDisbursements.length;
    }
}
