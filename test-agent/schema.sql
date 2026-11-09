CREATE TABLE IF NOT EXISTS test_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  device_id TEXT NOT NULL,
  device_name TEXT,
  app_version TEXT,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_test_reports_created ON test_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_reports_device ON test_reports(device_id, created_at DESC);
