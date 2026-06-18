-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    name VARCHAR(100) PRIMARY KEY
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(100) REFERENCES departments(name) ON DELETE SET NULL,
    designation VARCHAR(100),
    email VARCHAR(150),
    quota_cl DECIMAL(4, 1) DEFAULT 6.0,
    quota_sl DECIMAL(4, 1) DEFAULT 6.0,
    quota_el DECIMAL(4, 1) DEFAULT 15.0
);

-- Create leaves table (stores attendance status for each day)
CREATE TABLE IF NOT EXISTS leaves (
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    PRIMARY KEY (employee_id, date)
);

-- Create system_settings table (stores app settings)
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL
);
