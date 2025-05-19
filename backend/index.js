
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const Task = require('./models/Task');

const salt = bcrypt.genSaltSync(10);
const secret = 'saesgrfsg415sr';
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        })
        res.json(userDoc);
    } catch (error) {
        res.status(400).json(error)
    }
})


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(400).json('Invalid username or password');
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ username, id: userDoc._id }, secret, {}, function (err, token) {
                if (err) {
                    console.error('JWT sign error:', err);
                    return res.status(500).json('Error creating token');
                }
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username
                });
            });
        } else {
            res.status(400).json('Invalid username or password');
        }
    } catch (error) {
        console.error('Login endpoint error:', error);
        res.status(500).json('An error occurred during login');
    }
})


app.post('/logout', async (req, res) => {
    res.cookie('token', '').json("ok");
})

// app.post('/generatelist', async (req, res) => {
//     const { topic } = req.body;
//     const userId = req.user._id;

//     const prompt = `Generate a list of 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting.`;

//     //AIzaSyCUK3UUS05tM7LW6O_8b7IzFP98JSx7tXY
//     // const key = process.env.GEMINI_API_KEY;

//     try {
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
//         });

//         const data = await response.json();
//         const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

//         res.json({ tasks: rawText.trim() }); // ✅ send JSON response
//     } catch (error) {
//         console.error('Gemini API error:', error);
//         res.status(500).json({ error: 'Failed to generate task list' });
//     }
// })

app.post('/generatelist', async (req, res) => {
    const { topic } = req.body;
    const userId = req.body.userId;
    console.log(userId);

    const prompt = `Generate a list of 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const taskDoc = Task.create({
            userId: userId,
            topic: topic,
            content: rawText,
        })
        res.json(taskDoc)
        // res.json({ tasks: (await taskDoc).content.trim() }); 
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ error: 'Failed to generate task list' });
    }
});


app.get('/lists/:id', async (req, res) => {
    const { id } = req.params;
    const taskDoc = await Task.find({ userId: id });
    console.log(taskDoc);

    res.json({ taskDoc });
});

app.delete('/list/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ success: true, message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
app.put('/list/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { topic, content } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, { topic, content }, { new: true });
        res.json({ success: true, updatedTask });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/list/status/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.status = task.status === 'complete' ? 'incomplete' : 'complete';
        await task.save();
        res.json({ success: true, updatedTask: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


mongoose.connect(process.env.MONGO_URL).then(
    app.listen(5000, () => {
        console.log(`App is connected database.`)
    })

)
// e4FMQurherFtBP4R