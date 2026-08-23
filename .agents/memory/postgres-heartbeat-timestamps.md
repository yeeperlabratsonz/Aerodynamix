---
name: PostgreSQL heartbeat timestamp precision
description: Constraint for storing multiplayer heartbeat and signaling timestamps in the hosted database
---

Multiplayer heartbeat and signaling timestamps must use PostgreSQL `DOUBLE PRECISION` (or an equivalent 64-bit numeric type), never `REAL`.

**Why:** Unix timestamps near 1.7 billion lose roughly two minutes of precision in PostgreSQL `REAL`, causing active players and voice signals to be incorrectly treated as stale.

**How to apply:** When adding or reviewing time-based multiplayer persistence, check the actual database column type and include a migration for existing tables, not only a corrected create-table definition.