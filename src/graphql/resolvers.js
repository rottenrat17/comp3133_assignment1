const User = require('../models/User');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

const getToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

const toEmployeeGql = (empDoc) => ({
  ...empDoc.toObject(),
  _id: empDoc._id.toString(),
  date_of_joining: empDoc.date_of_joining?.toISOString?.() || empDoc.date_of_joining,
  created_at: (empDoc.created_at || empDoc.createdAt)?.toISOString?.() || empDoc.created_at,
  updated_at: (empDoc.updated_at || empDoc.updatedAt)?.toISOString?.() || empDoc.updated_at,
});

module.exports = {
  employees: async () => {
    const list = await Employee.find().sort({ created_at: -1 });
    return list.map(toEmployeeGql);
  },

  employee: async ({ id }) => {
    if (!id) throw new Error('Employee ID is required.');
    const emp = await Employee.findById(id);
    if (!emp) throw new Error('Employee not found.');
    return toEmployeeGql(emp);
  },

  signup: async ({ username, email, password }) => {
    if (!username?.trim()) throw new Error('Username is required.');
    if (!email?.trim()) throw new Error('Email is required.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });
    if (existing) {
      if (existing.email === cleanEmail) throw new Error('An account with this email already exists.');
      throw new Error('This username is already taken.');
    }

    const user = await User.create({ username: cleanUsername, email: cleanEmail, password });
    return {
      message: 'User created successfully.',
      user_id: user._id.toString(),
      jwt_token: getToken(user),
    };
  },

  login: async ({ email, password }) => {
    if (!email?.trim() || !password) throw new Error('Email and password are required.');

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) throw new Error('Invalid email or password.');

    const match = await user.matchPassword(password);
    if (!match) throw new Error('Invalid email or password.');

    return {
      message: 'Login successful.',
      user_id: user._id.toString(),
      jwt_token: getToken(user),
    };
  },

  addEmployee: async (args) => {
    const { first_name, last_name, email, position, salary, date_of_joining, department } = args;
    if (!first_name?.trim()) throw new Error('First name is required.');
    if (!last_name?.trim()) throw new Error('Last name is required.');
    if (!email?.trim()) throw new Error('Email is required.');
    if (!position?.trim()) throw new Error('Position is required.');
    if (salary == null || Number(salary) < 0 || Number.isNaN(Number(salary))) throw new Error('Valid salary is required.');
    if (!date_of_joining) throw new Error('Date of joining is required.');
    if (!department?.trim()) throw new Error('Department is required.');

    const cleanEmail = email.trim().toLowerCase();
    const existing = await Employee.findOne({ email: cleanEmail });
    if (existing) throw new Error('An employee with this email already exists.');

    const emp = await Employee.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: cleanEmail,
      position: position.trim(),
      salary: Number(salary),
      date_of_joining: new Date(date_of_joining),
      department: department.trim(),
    });

    return { message: 'Employee created successfully.', employee_id: emp._id.toString() };
  },

  updateEmployee: async ({ id, ...updates }) => {
    if (!id) throw new Error('Employee ID is required.');
    const emp = await Employee.findById(id);
    if (!emp) throw new Error('Employee not found.');

    const allowed = ['first_name', 'last_name', 'email', 'position', 'salary', 'date_of_joining', 'department'];
    for (const key of allowed) {
      if (updates[key] === undefined || updates[key] === null) continue;

      if (key === 'salary') {
        const n = Number(updates[key]);
        if (!Number.isNaN(n) && n >= 0) emp.salary = n;
        continue;
      }

      if (key === 'date_of_joining') {
        emp.date_of_joining = new Date(updates[key]);
        continue;
      }

      if (key === 'email') {
        emp.email = String(updates[key]).trim().toLowerCase();
        continue;
      }

      emp[key] = typeof updates[key] === 'string' ? updates[key].trim() : updates[key];
    }

    await emp.save();
    return { message: 'Employee details updated successfully.', employee_id: emp._id.toString() };
  },

  deleteEmployee: async ({ id }) => {
    if (!id) throw new Error('Employee ID is required.');
    const emp = await Employee.findByIdAndDelete(id);
    if (!emp) throw new Error('Employee not found.');
    return { message: 'Employee deleted successfully.', employee_id: id };
  },
};
