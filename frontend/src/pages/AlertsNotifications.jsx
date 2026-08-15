import React, { useState, useMemo, useEffect } from 'react';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Mail,
  Phone,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Download,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Users,
  BrainCircuit,
  Hexagon,
  FileSpreadsheet,
  Check,
  Flame,
  Radio,
  Share2,
  Trash2,
  Eye,
  Calendar,
  Smartphone
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { ALL_78_STUDENTS } from '../data/studentsData';
import '../styles/attendance.css';
import '../styles/learning-insights.css';
import '../styles/blockchain.css';

// Initial Institutional AI Alerts Dataset
const INITIAL_ALERTS = [
  {
    id: 'ALT-2026-091',
    studentId: 'STU1001',
    studentName: 'Rahul Patel',
    rollNo: 'CE2021001',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    dept: 'Computer Engg.',
    semester: 4,
    severity: 'critical', // 'critical' | 'warning' | 'info' | 'resolved'
    type: 'Critical Dropout Risk Surge',
    title: 'Dropout Probability Crossed 85% Threshold',
    message: 'AI Early-Warning engine detected rapid risk escalation due to consecutive absences in Data Structures lab and pending remedial submission.',
    category: 'risk',
    timestamp: '10 mins ago',
    date: '16 Aug 2026, 00:15',
    isRead: false,
    channels: ['WhatsApp Parent', 'Faculty Email', 'In-App'],
    parentPhone: '+91 98250 12345',
    parentName: 'Mr. Suresh Patel',
    hash: '0x8f91c7a2b3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'ALT-2026-092',
    studentId: 'STU1003',
    studentName: 'Aarav Mehta',
    rollNo: 'EE2021001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    dept: 'Electronics Engg.',
    semester: 4,
    severity: 'critical',
    type: 'Consecutive Absence Anomaly',
    title: '3 Consecutive Absences in Core VLSI Lectures',
    message: 'Student flagged for unexcused absence pattern over 3 straight days. Current monthly attendance dropped to 42% (Safety Limit: 75%).',
    category: 'attendance',
    timestamp: '45 mins ago',
    date: '15 Aug 2026, 23:30',
    isRead: false,
    channels: ['WhatsApp Parent', 'SMS Gateway'],
    parentPhone: '+91 98790 67890',
    parentName: 'Mr. Haresh Mehta',
    hash: '0xee2001ab3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'ALT-2026-093',
    studentId: 'STU1005',
    studentName: 'Karan Verma',
    rollNo: 'CV2021001',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    dept: 'Civil Engg.',
    semester: 4,
    severity: 'warning',
    type: 'Academic Grade Dip',
    title: 'Mid-Term Assessment Score Below 40%',
    message: 'Scored 34/100 in Structural Analysis Mid-Term test. Mandatory peer-tutoring tutorial recommended by academic advisory.',
    category: 'academic',
    timestamp: '2 hours ago',
    date: '15 Aug 2026, 22:15',
    isRead: false,
    channels: ['Faculty Email', 'In-App'],
    parentPhone: '+91 94280 45678',
    parentName: 'Mrs. Kavita Verma',
    hash: '0xcv2001ab3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'ALT-2026-094',
    studentId: 'STU1011',
    studentName: 'Aditya Kulkarni',
    rollNo: 'CE2021003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    dept: 'Computer Engg.',
    semester: 4,
    severity: 'warning',
    type: 'Milestone Review Overdue',
    title: 'Week 2 Remedial Problem Sheet Submission Pending',
    message: 'Algorithms practice assignment milestone was scheduled for yesterday. Faculty mentor Prof. Ananya Roy notified.',
    category: 'milestone',
    timestamp: '4 hours ago',
    date: '15 Aug 2026, 20:00',
    isRead: true,
    channels: ['In-App', 'Faculty Email'],
    parentPhone: '+91 98241 89012',
    parentName: 'Mr. Prakash Kulkarni',
    hash: '0xce2003ab3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'ALT-2026-095',
    studentId: 'SYSTEM',
    studentName: 'Consortium Node',
    rollNo: 'POLYGON-L2',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    dept: 'Blockchain Security',
    semester: 0,
    severity: 'info',
    type: 'Blockchain Ledger Anchored',
    title: '78 AI Risk Predictions Successfully Anchored',
    message: 'Institutional Merkle Root anchored to Polygon Amoy Block #1,428,599 with 0 tamper violations. Cryptographic audit trail verified.',
    category: 'blockchain',
    timestamp: '6 hours ago',
    date: '15 Aug 2026, 18:00',
    isRead: true,
    channels: ['Consortium Ledger'],
    parentPhone: '-',
    parentName: '-',
    hash: '0x8f91c7a2b3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'ALT-2026-096',
    studentId: 'STU1002',
    studentName: 'Sneha Singh',
    rollNo: 'IT2021001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    dept: 'Information Tech.',
    semester: 6,
    severity: 'resolved',
    type: 'Intervention Goal Achieved',
    title: 'Attendance Successfully Recovered to 82%',
    message: 'Student completed 3-week remedial attendance sprint. Risk level downgraded from High to Low.',
    category: 'resolved',
    timestamp: '1 day ago',
    date: '14 Aug 2026, 16:30',
    isRead: true,
    channels: ['In-App', 'WhatsApp Parent'],
    parentPhone: '+91 97230 11223',
    parentName: 'Mrs. Sunita Singh',
    hash: '0xit2001ab3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  }
];

export default function AlertsNotificationsPage({ notify = () => {}, globalSearchQuery = '' }) {
  // Main State
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('edusuccess_alerts_center');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ALERTS;
  });

  const [severityFilter, setSeverityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState('All High-Risk Students');
  const [broadcastType, setBroadcastType] = useState('Attendance Alert');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);

  // WhatsApp Preview Modal State
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppAlert, setWhatsAppAlert] = useState(null);

  // Sync Search
  useEffect(() => {
    if (globalSearchQuery !== undefined) {
      setSearchQuery(globalSearchQuery);
      setCurrentPage(1);
    }
  }, [globalSearchQuery]);

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem('edusuccess_alerts_center', JSON.stringify(alerts));
    } catch (e) {}
  }, [alerts]);

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alt) => {
      if (severityFilter !== 'All' && alt.severity !== severityFilter) return false;
      if (categoryFilter !== 'All' && alt.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          alt.studentName.toLowerCase().includes(q) ||
          alt.rollNo.toLowerCase().includes(q) ||
          alt.title.toLowerCase().includes(q) ||
          alt.message.toLowerCase().includes(q) ||
          alt.dept.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [alerts, severityFilter, categoryFilter, searchQuery]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / rowsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredAlerts.length);
  const paginatedAlerts = useMemo(() => {
    return filteredAlerts.slice(startIndex, endIndex);
  }, [filteredAlerts, startIndex, endIndex]);

  // Acknowledge & Resolve Alert
  const handleResolveAlert = (id, e) => {
    if (e) e.stopPropagation();
    setAlerts((prev) =>
      prev.map((alt) =>
        alt.id === id ? { ...alt, severity: 'resolved', isRead: true } : alt
      )
    );
    notify("✅ Alert marked as Acknowledged & Resolved!");
  };

  // Mark All as Read
  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((alt) => ({ ...alt, isRead: true })));
    notify("All notifications marked as read!");
  };

  // Delete Alert
  const handleDeleteAlert = (id, e) => {
    if (e) e.stopPropagation();
    setAlerts((prev) => prev.filter((alt) => alt.id !== id));
    notify("Alert removed from feed.");
  };

  // Open WhatsApp Modal
  const handleOpenWhatsAppModal = (alert, e) => {
    if (e) e.stopPropagation();
    setWhatsAppAlert(alert);
    setShowWhatsAppModal(true);
  };

  // Send WhatsApp Action
  const handleSendWhatsAppNotification = () => {
    notify(`📱 WhatsApp notification successfully dispatched to ${whatsAppAlert?.parentName} (${whatsAppAlert?.parentPhone})!`);
    setShowWhatsAppModal(false);
  };

  // Submit Broadcast Modal
  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) {
      notify("Please enter broadcast alert title.");
      return;
    }

    const newBroadcast = {
      id: `ALT-2026-${String(alerts.length + 1).padStart(3, '0')}`,
      studentId: 'COHORT-ALL',
      studentName: broadcastTarget,
      rollNo: 'INSTITUTIONAL',
      avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&auto=format&fit=crop&q=80',
      dept: 'All Engineering Depts',
      semester: 0,
      severity: 'warning',
      type: broadcastType,
      title: broadcastTitle,
      message: broadcastMsg || 'Institutional advisory notification issued by Academic Advisory Council.',
      category: 'broadcast',
      timestamp: 'Just now',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isRead: false,
      channels: [sendWhatsApp ? 'WhatsApp Parent' : null, sendEmail ? 'Faculty Email' : null, 'In-App'].filter(Boolean),
      parentPhone: 'Multi-Recipient Gateway',
      parentName: 'Targeted Cohort Guardians',
      hash: `0xbroadcast${Date.now().toString(16).slice(-8)}`
    };

    setAlerts([newBroadcast, ...alerts]);
    setShowBroadcastModal(false);
    setBroadcastTitle('');
    setBroadcastMsg('');
    notify(`📢 Broadcast alert successfully dispatched via ${newBroadcast.channels.join(' & ')}!`);
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportList = alerts.map((alt) => ({
        'Alert ID': alt.id,
        'Severity': alt.severity.toUpperCase(),
        'Category': alt.type,
        'Student Name': alt.studentName,
        'Enrollment No': alt.rollNo,
        'Department': alt.dept,
        'Title': alt.title,
        'Alert Details': alt.message,
        'Dispatched Channels': alt.channels.join(' | '),
        'Parent Guardian Contact': `${alt.parentName} (${alt.parentPhone})`,
        'Timestamp': alt.date,
        'Blockchain Hash': alt.hash
      }));

      const ws = XLSX.utils.json_to_sheet(exportList);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'AI_Alerts_Audit_Trail');
      XLSX.writeFile(wb, `EduSuccess_AI_Alerts_Notifications.xlsx`);
      notify("✅ Exported Alerts & Audit Trail to Excel!");
    } catch (e) {
      notify("Failed to export alerts.");
    }
  };

  // Stat Counts
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="att-page animate-fadeIn pb-12">
      {/* 1. Header Section */}
      <div className="att-header">
        <div className="att-title-group">
          <div className="att-icon-badge" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <BellRing style={{ width: 28, height: 28, color: '#dc2626' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1>Institutional Alerts &amp; Notification Center</h1>
              <span className="ai-blockchain-tag">
                <Radio style={{ width: 13, height: 13, color: '#7c3aed' }} />
                Real-Time Sentinel Active
              </span>
            </div>
            <p>Autonomous AI risk anomaly detection, parent WhatsApp/SMS multi-channel alerts, and faculty notification hub.</p>
          </div>
        </div>

        <div className="att-header-actions">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="btn-primary-purple"
          >
            <Radio style={{ width: 16, height: 16 }} />
            <span>+ Broadcast Alert</span>
          </button>

          <button
            onClick={handleMarkAllRead}
            className="btn-outline-action"
          >
            <CheckCircle2 style={{ width: 16, height: 16 }} />
            <span>Mark All as Read</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="btn-outline-action"
          >
            <Download style={{ width: 16, height: 16 }} />
            <span>Export Log (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Futuristic KPI Cards */}
      <div className="att-5-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {/* Card 1: Critical Alerts */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title red">Critical Alerts</span>
            <span className="att-stat-value">{criticalCount} Critical</span>
            <span className="att-stat-subtext red">Immediate Action Required</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle red">
              <AlertTriangle style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Card 2: Warning Watchlist */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title amber">Warnings &amp; Dips</span>
            <span className="att-stat-value">{warningCount} Warnings</span>
            <span className="att-stat-subtext amber">Grade / Attendance Triggers</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle amber">
              <Clock style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Card 3: Unread Notifications */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title blue">Pending Feed</span>
            <span className="att-stat-value">{unreadCount} Unread</span>
            <span className="att-stat-subtext green">Live Queue Monitored</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle" style={{ background: '#f0efff', color: '#5247e6' }}>
              <BellRing style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Card 4: WhatsApp Gateway */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title green">Parent WhatsApp Relay</span>
            <span className="att-stat-value">99.4%</span>
            <span className="att-stat-subtext green">Instant Delivery Gateway</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle green">
              <Smartphone style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, margin: '18px 0 12px', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
        {/* Left: Severity Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { id: 'All', label: `All Alerts (${alerts.length})` },
            { id: 'critical', label: `🔴 Critical (${criticalCount})` },
            { id: 'warning', label: `🟡 Warnings (${warningCount})` },
            { id: 'resolved', label: `🟢 Resolved (${alerts.filter((a) => a.severity === 'resolved').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setSeverityFilter(tab.id); setCurrentPage(1); }}
              className={`bc-tab-btn ${severityFilter === tab.id ? 'active' : ''}`}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                border: severityFilter === tab.id ? '1px solid #5247e6' : '1px solid #e2e8f0',
                background: severityFilter === tab.id ? '#f5f3ff' : '#ffffff',
                color: severityFilter === tab.id ? '#5247e6' : '#64748b',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Search */}
        <div className="att-records-search" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search style={{ width: 14, height: 14, color: '#94a3b8', position: 'absolute', left: 10 }} />
          <input
            type="text"
            placeholder="Search student, message, roll no..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{ paddingLeft: 30, height: 36, fontSize: 12 }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
              style={{ position: 'absolute', right: 8, background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 4. Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Left Column: Alerts Feed List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paginatedAlerts.length === 0 ? (
            <div className="att-records-card" style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
              <CheckCircle2 style={{ width: 48, height: 48, color: '#10b981', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0b153b', margin: '0 0 4px' }}>
                All Clear! No alerts matching filter.
              </h3>
              <p style={{ fontSize: 13 }}>There are no outstanding critical anomalies detected at this moment.</p>
            </div>
          ) : (
            paginatedAlerts.map((item) => {
              const isCrit = item.severity === 'critical';
              const isWarn = item.severity === 'warning';
              const isRes = item.severity === 'resolved';

              return (
                <div
                  key={item.id}
                  className="ai-futuristic-card"
                  style={{
                    borderLeft: `4px solid ${isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#10b981'}`,
                    background: item.isRead ? '#ffffff' : '#f8faff',
                    padding: 16
                  }}
                >
                  {/* Top Line: Avatar + Student info + Badge + Timestamp */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={item.avatar}
                        alt={item.studentName}
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0b153b', margin: 0 }}>
                            {item.studentName}
                          </h4>
                          <span style={{ fontSize: 11, color: '#64748b' }}>
                            {item.rollNo} • {item.dept}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: isCrit ? '#dc2626' : isWarn ? '#d97706' : '#059669', marginTop: 2 }}>
                          {item.type}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock style={{ width: 12, height: 12 }} />
                        {item.timestamp}
                      </span>
                      <button
                        onClick={(e) => handleDeleteAlert(item.id, e)}
                        style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
                        title="Dismiss Alert"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Alert Headline & Message */}
                  <div style={{ margin: '10px 0 8px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0b153b', marginBottom: 2 }}>
                      {item.title}
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      {item.message}
                    </p>
                  </div>

                  {/* Channel Badges & Action Toolbar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                    {/* Dispatched Channels */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.channels.map((ch, cIdx) => (
                        <span
                          key={cIdx}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 6,
                            background: ch.includes('WhatsApp') ? '#ecfdf5' : ch.includes('Email') ? '#eff6ff' : '#f8fafc',
                            color: ch.includes('WhatsApp') ? '#059669' : ch.includes('Email') ? '#2563eb' : '#64748b',
                            border: `1px solid ${ch.includes('WhatsApp') ? '#a7f3d0' : ch.includes('Email') ? '#bfdbfe' : '#e2e8f0'}`
                          }}
                        >
                          {ch}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {item.parentPhone && item.parentPhone !== '-' && (
                        <button
                          onClick={(e) => handleOpenWhatsAppModal(item, e)}
                          className="btn-outline-action"
                          style={{ padding: '4px 10px', fontSize: 11, color: '#059669', borderColor: '#a7f3d0' }}
                          title="Preview & Send WhatsApp Message to Guardian"
                        >
                          <Smartphone style={{ width: 12, height: 12 }} />
                          <span>WhatsApp Parent</span>
                        </button>
                      )}

                      {!isRes && (
                        <button
                          onClick={(e) => handleResolveAlert(item.id, e)}
                          className="btn-primary-purple"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                        >
                          <Check style={{ width: 12, height: 12 }} />
                          <span>Acknowledge</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          <div className="att-table-footer" style={{ marginTop: 8 }}>
            <div>
              Showing {filteredAlerts.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filteredAlerts.length} alerts
            </div>
            <div className="att-page-controls">
              <button className="att-page-btn" disabled={validPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft style={{ width: 14, height: 14 }} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button key={pg} className={`att-page-btn ${validPage === pg ? 'active' : ''}`} onClick={() => setCurrentPage(pg)}>
                  {pg}
                </button>
              ))}
              <button className="att-page-btn" disabled={validPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sentinel Health & Escalation Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Card 1: Channel Delivery Health */}
          <div className="att-records-card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0b153b', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Radio style={{ width: 16, height: 16, color: '#5247e6' }} />
              <span>Multi-Channel Gateway</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f0fdf4', borderRadius: 8 }}>
                <span style={{ fontWeight: 600, color: '#166534' }}>📱 WhatsApp Parent API</span>
                <span style={{ fontWeight: 800, color: '#16a34a' }}>99.4% Active</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#eff6ff', borderRadius: 8 }}>
                <span style={{ fontWeight: 600, color: '#1e40af' }}>📧 Faculty Email Relay</span>
                <span style={{ fontWeight: 800, color: '#2563eb' }}>100% Online</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f5f3ff', borderRadius: 8 }}>
                <span style={{ fontWeight: 600, color: '#5b21b6' }}>🛡️ Blockchain Audit Anchor</span>
                <span style={{ fontWeight: 800, color: '#7c3aed' }}>#1,428,599</span>
              </div>
            </div>
          </div>

          {/* Card 2: Priority Escalation Watchlist */}
          <div className="att-records-card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0b153b', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle style={{ width: 16, height: 16, color: '#dc2626' }} />
              <span>Top Escalation Queue</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alerts.filter((a) => a.severity === 'critical').slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    fontSize: 11
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#991b1b' }}>
                    <span>{item.studentName} ({item.rollNo})</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div style={{ color: '#7f1d1d', marginTop: 2 }}>{item.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL 1: BROADCAST CUSTOM ALERT
      ======================================================== */}
      {showBroadcastModal && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal" style={{ maxWidth: 580 }}>
            <button onClick={() => setShowBroadcastModal(false)} className="bc-cert-close">
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div className="bc-cert-header">
              <div className="bc-network-tag">
                <Radio style={{ width: 13, height: 13 }} />
                Institutional Notification Broadcast
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0b153b', margin: '6px 0 0' }}>
                Broadcast Multi-Channel Advisory
              </h2>
            </div>

            <form onSubmit={handleBroadcastSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                  Target Recipient Cohort:
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="att-dropdown-btn"
                  style={{ width: '100%', padding: '8px 12px', outline: 'none' }}
                >
                  <option>All High-Risk Students</option>
                  <option>All Students with Attendance &lt;75%</option>
                  <option>Computer Engg. (Sem 4 &amp; 6)</option>
                  <option>Information Tech. (Sem 4 &amp; 6)</option>
                  <option>Electronics Engg. (Sem 4 &amp; 6)</option>
                  <option>Mechanical Engg. (Sem 4 &amp; 6)</option>
                  <option>Civil Engg. (Sem 4 &amp; 6)</option>
                  <option>All 78 Enrolled Students</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                  Alert Title:
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Mandatory Attendance Remedial Orientation this Friday"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                  Notification Body / Instructions:
                </label>
                <textarea
                  rows={3}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Enter detailed message to be delivered to students and parents..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
                />
              </div>

              {/* Delivery Channels */}
              <div style={{ display: 'flex', gap: 16, fontSize: 12, fontWeight: 600, color: '#0b153b' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sendWhatsApp}
                    onChange={(e) => setSendWhatsApp(e.target.checked)}
                  />
                  <span>📱 Parent WhatsApp</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                  />
                  <span>📧 Faculty Email</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="btn-outline-action"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-purple"
                >
                  <span>Dispatch Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: PARENT WHATSAPP DISPATCH PREVIEW
      ======================================================== */}
      {showWhatsAppModal && whatsAppAlert && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal" style={{ maxWidth: 480 }}>
            <button onClick={() => setShowWhatsAppModal(false)} className="bc-cert-close">
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div className="bc-cert-header">
              <div className="bc-network-tag" style={{ background: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }}>
                <Smartphone style={{ width: 13, height: 13 }} />
                WhatsApp Guardian Gateway
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0b153b', margin: '6px 0 0' }}>
                Dispatch Parent WhatsApp Notice
              </h2>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Recipient: <strong>{whatsAppAlert.parentName}</strong> ({whatsAppAlert.parentPhone})
              </div>
            </div>

            {/* Realistic WhatsApp Chat Bubble */}
            <div style={{ background: '#e5ddd5', padding: 16, borderRadius: 12, margin: '12px 0' }}>
              <div style={{
                background: '#ffffff',
                padding: '12px 14px',
                borderRadius: '8px 8px 8px 0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                fontSize: 12,
                color: '#111827',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 800, color: '#059669', marginBottom: 4 }}>
                  🎓 EduSuccess AI — Institutional Academic Notice
                </div>
                <div>Respected <strong>{whatsAppAlert.parentName}</strong>,</div>
                <div style={{ marginTop: 4 }}>
                  This is an official automated advisory regarding your ward <strong>{whatsAppAlert.studentName} ({whatsAppAlert.rollNo})</strong>.
                </div>
                <div style={{ background: '#fef2f2', padding: '6px 8px', borderRadius: 6, margin: '6px 0', border: '1px solid #fecaca', color: '#991b1b', fontWeight: 600 }}>
                  ⚠️ {whatsAppAlert.title}: {whatsAppAlert.message}
                </div>
                <div style={{ fontSize: 11, color: '#4b5563' }}>
                  Please advise your ward to attend mandatory faculty counseling with their department advisor.
                </div>
                <div style={{ textAlign: 'right', fontSize: 10, color: '#9ca3af', marginTop: 6 }}>
                  {whatsAppAlert.timestamp} ✓✓
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button onClick={() => setShowWhatsAppModal(false)} className="btn-outline-action">
                Cancel
              </button>
              <button onClick={handleSendWhatsAppNotification} className="btn-primary-purple">
                <Send style={{ width: 14, height: 14 }} />
                <span>Send WhatsApp Notice Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
