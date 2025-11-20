# Website Financing Analyzer

A Node.js web service that analyzes websites to detect financing and credit offerings. The service classifies websites as "Proactive" (contains financing content) or "Non User" (no financing content detected).

## Features

- 🔍 **Smart Content Analysis**: Detects financing keywords and patterns
- 🎯 **Dual Classification**: Returns "Proactive" or "Non User" 
- 🚀 **Multiple Analysis Methods**: Uses both simple HTTP requests and JavaScript rendering
- 📊 **Confidence Scoring**: Provides confidence levels for classifications
- 🛡️ **Production Ready**: Includes rate limiting, security headers, and error handling
- 🌐 **Flexible API**: Supports both GET and POST requests

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd website-financing-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The service will be available at `http://localhost:3000`

### Deploy to Render

1. **Push to GitHub**: Upload this code to your GitHub repository

2. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Deployment**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - The `render.yaml` file will handle the rest

4. **Environment Variables** (automatically set by render.yaml):
   - `NODE_ENV=production`
   - `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
   - `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable`

## API Usage

### POST Request
```bash
curl -X POST https://your-app.onrender.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### GET Request
```bash
curl "https://your-app.onrender.com/analyze?url=https://example.com"
```

### Response Format
```json
{
  "url": "https://example.com",
  "classification": "Proactive",
  "confidence": 0.85,
  "matchedKeywords": [
    {
      "keyword": "financing",
      "count": 3,
      "isHighConfidence": true
    },
    {
      "keyword": "apply now",
      "count": 2,
      "isHighConfidence": true
    }
  ],
  "analysisDate": "2024-01-15T10:30:00.000Z",
  "status": "success"
}
```

## Detection Keywords

The analyzer searches for various financing-related terms:

### High-Confidence Keywords
- `apply now`, `financing`, `credit approval`
- `payment plan`, `buy now pay later`, `monthly payment`
- `affirm`, `klarna`, `afterpay`, `finance options`

### Standard Keywords  
- `credit`, `loan`, `installment`, `deferred payment`
- `credit score`, `no credit check`, `bad credit`
- `quick approval`, `instant approval`, `pre-qualify`
- `0% apr`, `no interest`, `interest free`

### Pattern Matching
- `$X per month`, `X months financing`
- `X% APR`, `no money down`, `zero percent`

## Classification Logic

- **Proactive**: Website contains financing keywords or patterns
  - Requires at least 1 high-confidence match OR 3+ total matches
  - Confidence score based on keyword importance and frequency

- **Non User**: No financing content detected
  - Fewer than 3 keyword matches and no high-confidence matches

## Architecture

```
├── index.js                 # Express server and API endpoints
├── src/
│   └── websiteAnalyzer.js   # Core analysis logic
├── package.json             # Dependencies and scripts
├── render.yaml              # Render deployment config
└── .env.example            # Environment template
```

## Error Handling

The service handles various error scenarios:
- Invalid URLs
- Network timeouts
- Access denied (403)
- Website not found (404)
- JavaScript rendering failures

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Configurable in `index.js`

## Development

### Run Tests
```bash
npm test
```

### Debug Mode
```bash
npm run dev
```

### Environment Variables
```bash
NODE_ENV=development
PORT=3000
```

## Example Usage Scenarios

### E-commerce Site with Financing
```bash
curl "https://your-app.onrender.com/analyze?url=https://shop.example.com"
```
Response: `"classification": "Proactive"`

### Regular Business Website  
```bash
curl "https://your-app.onrender.com/analyze?url=https://company.example.com"
```
Response: `"classification": "Non User"`

## Monitoring

- Health check endpoint: `GET /health`
- Server logs include analysis details
- Error tracking with detailed error messages

## Security Features

- Helmet.js security headers
- CORS enabled
- Rate limiting
- Input validation
- Error message sanitization

## Support

For issues or questions about deployment, check the logs in your Render dashboard or review the error responses from the API endpoints.
