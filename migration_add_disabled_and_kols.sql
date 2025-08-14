-- Add 'disabled' column to the 'Artists' table
ALTER TABLE Artists
ADD COLUMN disabled BOOLEAN DEFAULT FALSE;

-- Add 'disabled' column to the 'Teams' table
ALTER TABLE Teams
ADD COLUMN disabled BOOLEAN DEFAULT FALSE;

-- Create 'Kols' table
CREATE TABLE Kols (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    link_x VARCHAR(255),
    avatar VARCHAR(255),
    disabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
