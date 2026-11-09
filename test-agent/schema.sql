CREATE TABLE IF NOT EXISTS test_reports (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 device_id TEXT NOT NULL,device_name TEXT,app_version TEXT,event_type TEXT NOT NULL,payload_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_test_reports_created ON test_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_reports_device ON test_reports(device_id,created_at DESC);
CREATE TABLE IF NOT EXISTS test_sessions (
 session_id TEXT PRIMARY KEY,device_id TEXT NOT NULL,device_name TEXT,started_at TEXT NOT NULL,ended_at TEXT,event_count INTEGER NOT NULL DEFAULT 0,video_key TEXT
);
CREATE INDEX IF NOT EXISTS idx_test_sessions_started ON test_sessions(started_at DESC);
CREATE TABLE IF NOT EXISTS test_events (
 id INTEGER PRIMARY KEY AUTOINCREMENT,session_id TEXT NOT NULL,event_type TEXT NOT NULL,payload_json TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_test_events_session ON test_events(session_id,id);

CREATE TABLE IF NOT EXISTS test_snapshots (
 id INTEGER PRIMARY KEY AUTOINCREMENT,session_id TEXT NOT NULL,object_key TEXT NOT NULL,reason TEXT,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_test_snapshots_session ON test_snapshots(session_id,id);
