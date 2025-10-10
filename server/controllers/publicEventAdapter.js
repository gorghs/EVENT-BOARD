const axios = require('axios');

const GITHUB_API_URL = process.env.GITHUB_API_BASE || 'https://api.github.com/repos/expressjs/express/issues?per_page=10';
const TICKETMASTER_API_URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&size=10`;

const normalizeGitHubIssue = (issue) => ({
    title: issue.title,
    date: issue.created_at, // Use created_at as the event date
    location: issue.user.login, // Use the creator's username as a "location" proxy
    description: issue.body ? issue.body.substring(0, 150) + '...' : 'No description provided.',
    external_id: issue.id,
    source: 'GitHub Issues (Express Repo)',
});

const normalizeTicketmasterEvent = (event) => ({
    title: event.name,
    date: event.dates.start.dateTime,
    location: event._embedded.venues[0].name,
    description: event.info ? event.info : 'No description provided.',
    external_id: event.id,
    source: 'Ticketmaster',
});

exports.getPublicEvents = async (req, res) => {
    try {
        // Make sure to set the GITHUB_API_TOKEN environment variable
  const githubResponse = await axios.get(GITHUB_API_URL, {
    headers: {
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
    },
  });
        const ticketmasterResponse = await axios.get(TICKETMASTER_API_URL);

        const githubEvents = githubResponse.data.map(normalizeGitHubIssue);
        const ticketmasterEvents = ticketmasterResponse.data._embedded.events.map(normalizeTicketmasterEvent);

        const allEvents = [...githubEvents, ...ticketmasterEvents];

        res.json(allEvents);
    } catch (err) {
        if (err.response && err.response.status === 403) {
            // Rate Limit Handling
            return res.status(429).json({ error: 'Third-Party API Rate Limit Exceeded. Please try again shortly.' });
        }
        console.error('Public API Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch public events. Please check server logs.' });
    }
};