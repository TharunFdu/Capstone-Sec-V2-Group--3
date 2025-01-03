const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const { OAuth2Client } = require('google-auth-library');

exports.register = async (req, res) => {
    const { name, email, password, role, location } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            location,  
        });

        const token = jwt.sign({ userId: newUser.id, role: newUser.role }, keys.jwtSecret, { expiresIn: '1h' });

        res.status(201).json({ token, user: newUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, email: user.email }, 
            keys.jwtSecret,
            { expiresIn: '1h' }
        );

        res.json({ token, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, sub: googleId } = ticket.getPayload();
        let user = await User.findOne({ where: { googleId } });

        if (!user) {
            if (email === 'admin@example.com') {
                return res.status(400).json({ message: 'Google login is not allowed for the main admin.' });
            }

            user = await User.create({
                name,
                email,
                googleId,
                role: 'user', 
                location: '',
            });
        }

        const jwtToken = jwt.sign({ userId: user.id, role: user.role }, keys.jwtSecret, { expiresIn: '1h' });

        res.json({ token: jwtToken, user });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ message: 'Google login failed, please try again.' });
    }
};

exports.setRole = async (req, res) => {
    const { role, userId } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.email === 'admin@example.com') {
            return res.status(403).json({ message: 'The main admin\'s role cannot be changed.' });
        }

        user.role = role;
        await user.save();

        res.json({ role: user.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.updateUserRole = async (req, res) => {
    const { userId, newRole } = req.body;
    const adminId = req.user.userId; 

    try {
        const admin = await User.findByPk(adminId);
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: Only the main admin can update roles.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin' && userId === adminId) {
            return res.status(400).json({ message: 'The main admin\'s role cannot be modified.' });
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({ message: `User role updated to ${newRole}.`, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.ensureMainAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ where: { role: 'admin' } });
        if (!existingAdmin) {
            await User.create({
                name: 'Main Admin',
                email: 'admin@example.com',
                password: await bcrypt.hash('adminpassword', 10),
                role: 'admin',
                location: 'Head Office',
            });
            console.log('Main admin created with default credentials.');
        }
    } catch (err) {
        console.error('Error ensuring main admin exists:', err);
    }
};

exports.getAllUsers = async (req, res) => {
    console.log('getAllUsers invoked by:', req.user);
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'location'],
        });
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

