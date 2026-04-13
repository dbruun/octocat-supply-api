-- Migration 003: Add last_updated timestamp field to suppliers table

ALTER TABLE suppliers ADD COLUMN last_updated TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP;
