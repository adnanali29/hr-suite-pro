const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure DB connection
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
};

// If sslmode is not specified in the URL, apply SSL settings for Neon DB
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sslmode=')) {
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
} else if (process.env.DATABASE_URL) {
  // If it's Neon DB, we typically need SSL
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
}

let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool(dbConfig);
  pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
  });
} else {
  console.warn('WARNING: DATABASE_URL is not set in environment. Running in in-memory simulation fallback.');
}

// In-memory fallback database for safe execution if database is not configured yet
let mockDb = {
  departments: [
    'Accounts', 'Customer service and sales', 'Hr and Admin',
    'Manufacturing', 'Store', 'Sales and Marketing', 'Lab', 'Designing'
  ],
  authCredentials: { email: 'Hr@hempcann.in', password: '123456789' },
  leaveColors: {
    CL: { text: '#92400e', bg: '#fffbeb', border: '#fde68a' },
    SL: { text: '#9f1239', bg: '#fff1f2', border: '#fecdd3' },
    EL: { text: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
  },
  quotas: { CL: 6, SL: 6, EL: 15 },
  employees: [
    { id:'HCS_086', name:'Dr. Diptimayee Sarangi', department:'Manufacturing', designation:'Plant Manager', email:'diptimayee.sarangi@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_010', name:'Duryodhan Behera', department:'Accounts', designation:'Accountant', email:'duryodhan.behera@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_071', name:'Jyoti Ranjan Ray', department:'Accounts', designation:'Finance Manager', email:'jyoti.ray@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_062', name:'Smruti Simantani Moharana', department:'Customer service and sales', designation:'Customer Service Executive', email:'smruti.moharana@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_122', name:'Sanjib Kumar Barik', department:'Customer service and sales', designation:'Sales Executive', email:'sanjib.barik@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_125', name:'Sipra Pattanayak', department:'Customer service and sales', designation:'CRM Specialist', email:'sipra.pattanayak@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_161', name:'Priyanka Kabi', department:'Hr and Admin', designation:'HR Associate', email:'priyanka.kabi@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_008', name:'Saswati Samal', department:'Manufacturing', designation:'Production Worker', email:'saswati.samal@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_007', name:'Jharana Mallik', department:'Manufacturing', designation:'Production Worker', email:'jharana.mallik@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_015', name:'Gobinda Pariharya', department:'Manufacturing', designation:'Machine Operator', email:'gobinda.pariharya@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_128', name:'Sunita Nayak', department:'Manufacturing', designation:'Production Worker', email:'sunita.nayak@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_001', name:'Debendranath Das', department:'Manufacturing', designation:'Production Supervisor', email:'debendranath.das@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_003', name:'Jyotis Ranjan Pradhan', department:'Manufacturing', designation:'Machine Operator', email:'jyotis.pradhan@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_118', name:'Hyking Acharjee', department:'Manufacturing', designation:'Quality Analyst', email:'hyking.acharjee@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_011', name:'Nakula Bhoi', department:'Manufacturing', designation:'Production Worker', email:'nakula.bhoi@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_027', name:'Saswat Muduli', department:'Manufacturing', designation:'Machine Operator', email:'saswat.muduli@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_044', name:'Ajaya Muduli', department:'Manufacturing', designation:'Production Worker', email:'ajaya.muduli@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_050', name:'Bharat Hati', department:'Manufacturing', designation:'Machine Operator', email:'bharat.hati@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_051', name:'Akshya Kumar Swain', department:'Manufacturing', designation:'Quality Analyst', email:'akshya.swain@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_136', name:'Chandan Parida', department:'Manufacturing', designation:'Production Worker', email:'chandan.parida@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_002', name:'Ananta Jena', department:'Manufacturing', designation:'Production Supervisor', email:'ananta.jena@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_187', name:'Deepak Kumar Sahoo', department:'Store', designation:'Store Executive', email:'deepak.sahoo@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_133', name:'Paramananda Acharya', department:'Store', designation:'Store Manager', email:'paramananda.acharya@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_030', name:'Pradeep Ku. Jena', department:'Store', designation:'Inventory Officer', email:'pradeep.jena@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_031', name:'Sudhir Goswami', department:'Store', designation:'Logistics Executive', email:'sudhir.goswami@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_058', name:'Nigamanand Das', department:'Sales and Marketing', designation:'Sales Executive', email:'nigamanand.das@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_111', name:'Babashri L.P. Gumansingh', department:'Sales and Marketing', designation:'Marketing Specialist', email:'babashri.gumansingh@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_166', name:'Ashish Kumar Barik', department:'Store', designation:'Store Executive', email:'ashish.barik@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_165', name:'Deepak Rajan Rout', department:'Store', designation:'Logistics Executive', email:'deepak.rout@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_174', name:'Pradeep Ku. Mahana', department:'Store', designation:'Store Executive', email:'pradeep.mahana@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_184', name:'Siprarani Sahoo', department:'Lab', designation:'Lab Analyst', email:'siprarani.sahoo@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_193', name:'Anmisha Behera', department:'Lab', designation:'Lab Technician', email:'anmisha.behera@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_185', name:'Chandana Kumari', department:'Lab', designation:'Lab Analyst', email:'chandana.kumari@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_198', name:'Lopamudra Mohapatra', department:'Lab', designation:'Senior Analyst', email:'lopamudra.mohapatra@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_190', name:'Adnan Ali', department:'Sales and Marketing', designation:'Sales Executive', email:'adnan.ali@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_194', name:'Subrat Kumar Parida', department:'Lab', designation:'Lab Technician', email:'subrat.parida@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} },
    { id:'HCS_197', name:'Shruti Jain', department:'Designing', designation:'Graphic Designer', email:'shruti.jain@hempcann.in', quotaCL:6, quotaSL:6, quotaEL:15, leaves:{} }
  ]
};

// Initialize DB schema & seed default data if empty
async function initDatabase() {
  if (!pool) return;
  const client = await pool.connect();
  try {
    console.log('Initializing database schema...');
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
          name VARCHAR(100) PRIMARY KEY
      );

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

      CREATE TABLE IF NOT EXISTS leaves (
          employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          status VARCHAR(20) NOT NULL,
          PRIMARY KEY (employee_id, date)
      );

      CREATE TABLE IF NOT EXISTS system_settings (
          key VARCHAR(50) PRIMARY KEY,
          value JSONB NOT NULL
      );
    `);

    // Check if seeded
    const deptCount = await client.query('SELECT COUNT(*) FROM departments');
    if (parseInt(deptCount.rows[0].count) === 0) {
      console.log('Database is empty. Seeding initial departments...');
      for (const dept of mockDb.departments) {
        await client.query('INSERT INTO departments (name) VALUES ($1) ON CONFLICT DO NOTHING', [dept]);
      }
    }

    const empCount = await client.query('SELECT COUNT(*) FROM employees');
    if (parseInt(empCount.rows[0].count) === 0) {
      console.log('Database is empty. Seeding initial employees...');
      for (const emp of mockDb.employees) {
        await client.query(
          `INSERT INTO employees (id, name, department, designation, email, quota_cl, quota_sl, quota_el)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`,
          [emp.id, emp.name, emp.department, emp.designation, emp.email, emp.quotaCL, emp.quotaSL, emp.quotaEL]
        );
      }
    }

    // Seed default settings
    const settings = [
      { key: 'authCredentials', value: mockDb.authCredentials },
      { key: 'leaveColors', value: mockDb.leaveColors },
      { key: 'quotas', value: mockDb.quotas }
    ];

    for (const s of settings) {
      const sCheck = await client.query('SELECT COUNT(*) FROM system_settings WHERE key = $1', [s.key]);
      if (parseInt(sCheck.rows[0].count) === 0) {
        await client.query(
          'INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [s.key, JSON.stringify(s.value)]
        );
      }
    }

    console.log('Database successfully initialized and seeded.');
  } catch (err) {
    console.error('Database initialization error:', err);
  } finally {
    client.release();
  }
}

// ─── API ENDPOINTS ──────────────────────────────────────────────────

// GET all data: departments, employees, leaves, settings
app.get('/api/data', async (req, res) => {
  if (!pool) {
    // Return mock database for testing
    return res.json(mockDb);
  }

  try {
    const departmentsRes = await pool.query('SELECT name FROM departments ORDER BY name');
    const employeesRes = await pool.query('SELECT * FROM employees ORDER BY name');
    const leavesRes = await pool.query('SELECT employee_id, to_char(date, \'YYYY-MM-DD\') as date_str, status FROM leaves');
    const settingsRes = await pool.query('SELECT key, value FROM system_settings');

    const departmentsList = departmentsRes.rows.map(r => r.name);
    
    // Map database system settings
    const settingsMap = {};
    settingsRes.rows.forEach(r => {
      settingsMap[r.key] = r.value;
    });

    const authCredentials = settingsMap.authCredentials || mockDb.authCredentials;
    const leaveColors = settingsMap.leaveColors || mockDb.leaveColors;
    const quotas = settingsMap.quotas || mockDb.quotas;

    // Build leaves lookup map for each employee
    const leavesByEmp = {};
    leavesRes.rows.forEach(r => {
      if (!leavesByEmp[r.employee_id]) {
        leavesByEmp[r.employee_id] = {};
      }
      leavesByEmp[r.employee_id][r.date_str] = r.status;
    });

    const employeesList = employeesRes.rows.map(emp => ({
      id: emp.id,
      name: emp.name,
      department: emp.department,
      designation: emp.designation,
      email: emp.email,
      quotaCL: parseFloat(emp.quota_cl),
      quotaSL: parseFloat(emp.quota_sl),
      quotaEL: parseFloat(emp.quota_el),
      leaves: leavesByEmp[emp.id] || {}
    }));

    res.json({
      departments: departmentsList,
      employees: employeesList,
      authCredentials,
      leaveColors,
      quotas
    });
  } catch (err) {
    console.error('Error fetching data from database:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// POST save/update employee
app.post('/api/employees', async (req, res) => {
  const { id, name, department, designation, email, quotaCL, quotaSL, quotaEL } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: 'id and name are required' });
  }

  if (!pool) {
    const idx = mockDb.employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      mockDb.employees[idx] = { ...mockDb.employees[idx], name, department, designation, email, quotaCL, quotaSL, quotaEL };
    } else {
      mockDb.employees.push({ id, name, department, designation, email, quotaCL, quotaSL, quotaEL, leaves: {} });
    }
    return res.json({ success: true });
  }

  try {
    await pool.query(
      `INSERT INTO employees (id, name, department, designation, email, quota_cl, quota_sl, quota_el)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         department = EXCLUDED.department,
         designation = EXCLUDED.designation,
         email = EXCLUDED.email,
         quota_cl = EXCLUDED.quota_cl,
         quota_sl = EXCLUDED.quota_sl,
         quota_el = EXCLUDED.quota_el`,
      [id, name, department, designation, email, quotaCL, quotaSL, quotaEL]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving employee:', err);
    res.status(500).json({ error: 'Database insert/update failed' });
  }
});

// DELETE employee
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  if (!pool) {
    const idx = mockDb.employees.findIndex(e => e.id === id);
    if (idx !== -1) {
      mockDb.employees.splice(idx, 1);
    }
    return res.json({ success: true });
  }

  try {
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

// POST set single day leave/attendance status
app.post('/api/leaves/status', async (req, res) => {
  const { employeeId, dateStr, status } = req.body;

  if (!employeeId || !dateStr || !status) {
    return res.status(400).json({ error: 'employeeId, dateStr, and status are required' });
  }

  if (!pool) {
    const emp = mockDb.employees.find(e => e.id === employeeId);
    if (emp) {
      emp.leaves[dateStr] = status;
    }
    return res.json({ success: true });
  }

  try {
    await pool.query(
      `INSERT INTO leaves (employee_id, date, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (employee_id, date) DO UPDATE SET status = EXCLUDED.status`,
      [employeeId, dateStr, status]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error setting leave status:', err);
    res.status(500).json({ error: 'Database upsert failed' });
  }
});

// POST book leave (date range)
app.post('/api/leaves/book', async (req, res) => {
  const { employeeId, type, duration, startDateStr, endDateStr } = req.body;

  if (!employeeId || !type || !duration || !startDateStr || !endDateStr) {
    return res.status(400).json({ error: 'All parameters are required' });
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (!pool) {
    const emp = mockDb.employees.find(e => e.id === employeeId);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    let curr = new Date(startDate);
    while (curr <= endDate) {
      const ds = curr.toISOString().split('T')[0];
      if (ds >= "2026-04-01" && ds <= "2027-03-31") {
        const dow = curr.getDay();
        emp.leaves[ds] = (dow === 0) ? 'W' : (duration === 'half' ? `${type}-half` : type);
      }
      curr.setDate(curr.getDate() + 1);
    }
    return res.json({ success: true });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let curr = new Date(startDate);
    while (curr <= endDate) {
      const ds = curr.toISOString().split('T')[0];
      if (ds >= "2026-04-01" && ds <= "2027-03-31") {
        const dow = curr.getDay();
        const finalStatus = (dow === 0) ? 'W' : (duration === 'half' ? `${type}-half` : type);

        await client.query(
          `INSERT INTO leaves (employee_id, date, status)
           VALUES ($1, $2, $3)
           ON CONFLICT (employee_id, date) DO UPDATE SET status = EXCLUDED.status`,
          [employeeId, ds, finalStatus]
        );
      }
      curr.setDate(curr.getDate() + 1);
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error booking leave:', err);
    res.status(500).json({ error: 'Database transaction failed' });
  } finally {
    client.release();
  }
});

// POST add department
app.post('/api/departments', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  if (!pool) {
    if (!mockDb.departments.includes(name)) {
      mockDb.departments.push(name);
    }
    return res.json({ success: true });
  }

  try {
    await pool.query('INSERT INTO departments (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error adding department:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// DELETE department
app.delete('/api/departments/:name', async (req, res) => {
  const { name } = req.params;

  if (!pool) {
    const idx = mockDb.departments.indexOf(name);
    if (idx !== -1) {
      mockDb.departments.splice(idx, 1);
    }
    return res.json({ success: true });
  }

  try {
    await pool.query('DELETE FROM departments WHERE name = $1', [name]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// POST save global settings (leave colors, quotas, account settings)
app.post('/api/settings', async (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.status(400).json({ error: 'key and value are required' });
  }

  if (!pool) {
    mockDb[key] = value;
    // Apply key quota to all employees in mockdb
    if (key === 'quotas') {
      mockDb.employees.forEach(emp => {
        emp.quotaCL = value.CL;
        emp.quotaSL = value.SL;
        emp.quotaEL = value.EL;
      });
    }
    return res.json({ success: true });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO system_settings (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, JSON.stringify(value)]
    );

    // If quotas are updated, globally update all employees' quotas in Neon
    if (key === 'quotas') {
      await client.query(
        'UPDATE employees SET quota_cl = $1, quota_sl = $2, quota_el = $3',
        [value.CL, value.SL, value.EL]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saving settings:', err);
    res.status(500).json({ error: 'Database transaction failed' });
  } finally {
    client.release();
  }
});

// Catch-all route to serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, async () => {
  console.log(`HR Suite Pro server running locally at http://localhost:${PORT}`);
  if (pool) {
    await initDatabase();
  }
});
