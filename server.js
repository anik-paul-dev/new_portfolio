const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// MongoDB Atlas Connection
mongoose.connect('mongodb+srv:', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Portfolio Schema
const portfolioSchema = new mongoose.Schema({
    name: String,
    about: String,
    skills: [{ name: String, level: Number }],
    projects: [{ title: String, description: String, link: String }],
    experience: [{ title: String, company: String, duration: String, description: String, id: Number }],
    stats: [{ label: String, value: Number }],
    testimonials: [{ text: String, author: String }]
});
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// API Routes
app.get('/api/portfolio', async (req, res) => {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
        portfolio = await Portfolio.create({
            name: 'Alex Johnson',
            about: "I'm a passionate full-stack developer with a keen eye for design and a love for creating seamless user experiences. My journey in tech started 5 years ago, and I've been constantly learning and evolving ever since.",
            skills: [
                { name: 'React', level: 95 },
                { name: 'JavaScript', level: 92 },
                { name: 'HTML/CSS', level: 96 },
                { name: 'Node.js', level: 90 },
                { name: 'Python', level: 85 },
                { name: 'MongoDB', level: 92 },
                { name: 'Figma', level: 93 },
                { name: 'Git', level: 94 },
                { name: 'Docker', level: 82 }
            ],
            projects: [
                { title: 'Project 1', description: 'A modern web application built with React and Node.js.', link: '#' },
                { title: 'Project 2', description: 'E-commerce platform with advanced filtering.', link: '#' }
            ],
            experience: [
                { id: 1, title: 'Senior Full Stack Developer', company: 'Tech Innovators Inc.', duration: '2022 - Present', description: 'Leading a team of 6 developers in building scalable web applications.' },
                { id: 2, title: 'Full Stack Developer', company: 'Digital Solutions LLC', duration: '2020 - 2022', description: 'Developed responsive web applications using React and Node.js.' },
                { id: 3, title: 'Frontend Developer', company: 'StartupXYZ', duration: '2019 - 2020', description: 'Focused on building modern, responsive user interfaces.' }
            ],
            stats: [
                { label: 'Projects Completed', value: 50 },
                { label: 'Years Experience', value: 5 },
                { label: 'Happy Clients', value: 50 },
                { label: 'Support Available', value: 24 }
            ],
            testimonials: [
                { text: 'Amazing work! Delivered beyond expectations.', author: 'Client 1' },
                { text: 'Highly professional and skilled developer.', author: 'Client 2' }
            ]
        });
    }
    res.json(portfolio);
});

app.post('/api/portfolio', async (req, res) => {
    const portfolio = await Portfolio.findOne();
    if (portfolio) {
        const newSkills = req.body.skills.length > 0 ? [...portfolio.skills, ...req.body.skills] : portfolio.skills;
        const newProjects = req.body.projects.length > 0 ? [...portfolio.projects, ...req.body.projects] : portfolio.projects;
        const newExperience = req.body.experience.length > 0 ? [...portfolio.experience, ...req.body.experience] : portfolio.experience;
        const newStats = req.body.stats.length > 0 ? [...portfolio.stats, ...req.body.stats] : portfolio.stats;
        const newTestimonials = req.body.testimonials.length > 0 ? [...portfolio.testimonials, ...req.body.testimonials] : portfolio.testimonials;
        await Portfolio.updateOne({}, {
            name: req.body.name || portfolio.name,
            about: req.body.about || portfolio.about,
            skills: newSkills,
            projects: newProjects,
            experience: newExperience,
            stats: newStats,
            testimonials: newTestimonials
        });
    } else {
        await Portfolio.create(req.body);
    }
    res.json({ success: true });
});

app.post('/api/contact', async (req, res) => {
    await Contact.create(req.body);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});