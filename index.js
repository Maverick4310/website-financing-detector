import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
app.use(express.json());

const KEYWORDS = [
    "financing",
    "finance",
    "apply now",
    "apply today",
    "credit application",
    "credit app",
    "lease",
    "leasing",
    "get approved",
    "payment options",
    "0% financing",
    "apply for credit",
    "instant approval",
    "term financing",
    "monthly payments",
    "payment plan",
    "business financing",
    "consumer financing",
    "financing available",
    "financing options"
];

async function fetchWebsite(url) {
    try {
        const response = await axios.get(url, {
            timeout: 8000,
            headers: {
                "User-Agent": "Mozilla/5.0 Navitas-Proactive-Checker"
            }
        });

        return response.data;
    } catch (err) {
        console.error("Fetch error:", err.message);
        return null;
    }
}

app.post('/scan', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required." });
    }

    console.log("Scanning:", url);

    const html = await fetchWebsite(url);
    if (!html) {
        return res.status(500).json({
            status: "Unknown",
            error: "Unable to fetch website."
        });
    }

    const $ = cheerio.load(html);
    const text = $("body").text().toLowerCase();

    const matches = KEYWORDS.filter(keyword =>
        text.includes(keyword.toLowerCase())
    );

    const status = matches.length > 0 ? "Proactive" : "Non User";

    return res.json({
        url,
        status,
        matchedKeywords: matches,
        totalMatches: matches.length
    });
});

app.get('/', (req, res) => {
    res.send("Website Proactive Checker Running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
