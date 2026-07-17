-- FIFA Smart Stadium AI — schema
-- MySQL stores facts only. AI-generated text is persisted exclusively in
-- match_summaries and incident_ai_notes, so the fact/intelligence boundary
-- is auditable in the schema itself, not just by convention.

CREATE DATABASE IF NOT EXISTS fifa_smart_stadium
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fifa_smart_stadium;

-- ===== Core stadium structure =====

CREATE TABLE IF NOT EXISTS stadium_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  zone VARCHAR(20) NOT NULL,
  capacity INT NOT NULL,
  tier VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stadium_gates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  zone VARCHAR(20) NOT NULL,
  status ENUM('open','closed','congested') DEFAULT 'open',
  current_queue_estimate INT DEFAULT 0,
  throughput_per_min INT DEFAULT 0,
  section_id INT,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES stadium_sections(id)
) ENGINE=InnoDB;

-- ===== Crowd (latest + short history, polymorphic location) =====

CREATE TABLE IF NOT EXISTS crowd_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location_type ENUM('gate','section','concourse','parking','general') NOT NULL,
  location_id INT NOT NULL,
  density_pct DECIMAL(5,2) NOT NULL,
  people_count_estimate INT,
  trend ENUM('rising','falling','stable') DEFAULT 'stable',
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_location_time (location_type, location_id, recorded_at)
) ENGINE=InnoDB;

-- ===== Parking =====

CREATE TABLE IF NOT EXISTS parking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lot_name VARCHAR(50) NOT NULL,
  total_spots INT NOT NULL,
  occupied_spots INT NOT NULL DEFAULT 0,
  status ENUM('open','filling','full','closed') DEFAULT 'open',
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===== Food stalls =====

CREATE TABLE IF NOT EXISTS food_stalls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  category VARCHAR(40),
  zone VARCHAR(20) NOT NULL,
  wait_time_min INT DEFAULT 0,
  status ENUM('open','closed','sold_out') DEFAULT 'open',
  popularity_score DECIMAL(3,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===== Matches =====

CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  home_team VARCHAR(60) NOT NULL,
  away_team VARCHAR(60) NOT NULL,
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0,
  status ENUM('scheduled','live','halftime','finished') DEFAULT 'scheduled',
  kickoff_at DATETIME NOT NULL,
  stage VARCHAR(40),
  venue VARCHAR(100) DEFAULT 'Host Stadium',
  minute INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS match_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  minute INT NOT NULL,
  event_type ENUM('goal','yellow_card','red_card','substitution','var','kickoff','halftime','fulltime') NOT NULL,
  team VARCHAR(60),
  player VARCHAR(80),
  detail VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id)
) ENGINE=InnoDB;

-- AI cache — the ONLY place Gemini-generated match text is persisted.
CREATE TABLE IF NOT EXISTS match_summaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  summary_text TEXT NOT NULL,
  based_on_event_count INT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id)
) ENGINE=InnoDB;

-- ===== Incidents =====

CREATE TABLE IF NOT EXISTS incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('medical','security','crowd_surge','fire','weather','lost_item','other') NOT NULL,
  severity ENUM('low','medium','high','critical') NOT NULL,
  status ENUM('reported','acknowledged','in_progress','resolved') DEFAULT 'reported',
  location_desc VARCHAR(150),
  gate_id INT NULL,
  section_id INT NULL,
  description TEXT,
  reported_by VARCHAR(80) DEFAULT 'system-sim',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (gate_id) REFERENCES stadium_gates(id),
  FOREIGN KEY (section_id) REFERENCES stadium_sections(id)
) ENGINE=InnoDB;

-- AI cache — the ONLY place Gemini-generated incident text is persisted.
CREATE TABLE IF NOT EXISTS incident_ai_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  incident_id INT NOT NULL,
  note_type ENUM('summary','decision_support','commander_plan') NOT NULL,
  content TEXT NOT NULL,
  confidence DECIMAL(4,1) NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id)
) ENGINE=InnoDB;

-- ===== Transport =====

CREATE TABLE IF NOT EXISTS transport (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mode ENUM('shuttle','metro','rideshare','bus') NOT NULL,
  route_name VARCHAR(80),
  status ENUM('on_time','delayed','crowded','suspended') DEFAULT 'on_time',
  next_arrival_min INT,
  capacity_pct DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===== Chat / Assistant (no auth — session is a client-generated token) =====

CREATE TABLE IF NOT EXISTS chat_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_token VARCHAR(64) NOT NULL UNIQUE,
  language VARCHAR(10) DEFAULT 'en',
  context ENUM('fan','ops') DEFAULT 'fan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chat_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  role ENUM('user','assistant') NOT NULL,
  message TEXT NOT NULL,
  intent VARCHAR(40),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
) ENGINE=InnoDB;

-- ===== Staff (ops-recommendation context) =====

CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80),
  role ENUM('security','medical','steward','manager') NOT NULL,
  assigned_gate_id INT NULL,
  status ENUM('available','deployed','off_duty') DEFAULT 'available',
  FOREIGN KEY (assigned_gate_id) REFERENCES stadium_gates(id)
) ENGINE=InnoDB;
