const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/register', validateUser, async (req, res) => {
	try {
		const data = {
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password, 10)
		};
		const newUser = await db.createUser(data);
		res.status(201).json(newUser);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Failed to create user' });
	}
});

// middleware
function validateUser(req, res, next) {
	if (!req.body.username || !req.body.password) {
		return res.status(422).json({
			error: 'Username and password are required to create a user'
		});
	}
	if (req.body.password !== req.body.confirmPassword) {
		return res.status(422).json({
			error: 'please make sure password and confirm password are matching'
		});
	}
	next();
}

const port = process.env.PORT || 4040;

console.log(`Server listening on port ${port}`);
app.listen(port);
