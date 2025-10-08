const axios = require('axios');

const GITHUB_API_URL = process.env.GITHUB_API_BASE || 'https://api.github.com/repos/expressjs/express/issues?per_page=10';

const normalizeGitHubIssue = (issue) => ({
    title: issue.title,
    date: issue.created_at, // Use created_at as the event date
    location: issue.user.login, // Use the creator's username as a "location" proxy
    description: issue.body ? issue.body.substring(0, 150) + '...' : 'No description provided.',
    external_id: issue.id,
    source: 'GitHub Issues (Express Repo)',
});

exports.getPublicEvents = async (req, res) => {
    try {
        const response = await axios.get(GITHUB_API_URL);
        const normalizedEvents = response.data.map(normalizeGitHubIssue);
        res.json(normalizedEvents);
    } catch (err) {
        if (err.response && err.response.status === 403) {
            // Rate Limit Handling
            return res.status(429).json({ error: 'Third-Party API Rate Limit Exceeded. Please try again shortly.' });
        }
        console.error('Public API Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch public events. Please check server logs.' });
    }
};