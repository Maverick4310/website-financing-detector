const request = require('supertest');
const app = require('../index');

describe('Website Financing Analyzer API', () => {
  
  describe('GET /', () => {
    it('should return API documentation', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      
      expect(res.body).toHaveProperty('service');
      expect(res.body.service).toBe('Website Financing Analyzer');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);
      
      expect(res.body).toHaveProperty('status');
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('POST /analyze', () => {
    it('should require URL parameter', async () => {
      const res = await request(app)
        .post('/analyze')
        .send({})
        .expect(400);
      
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('URL is required');
    });

    it('should validate URL format', async () => {
      const res = await request(app)
        .post('/analyze')
        .send({ url: 'not-a-valid-url' })
        .expect(400);
      
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Invalid URL format');
    });

    // Note: This test would make an actual HTTP request
    // In a real environment, you might want to mock the analyzer
    it('should analyze a valid URL', async () => {
      const res = await request(app)
        .post('/analyze')
        .send({ url: 'https://httpbin.org/html' })
        .expect(200);
      
      expect(res.body).toHaveProperty('classification');
      expect(res.body).toHaveProperty('confidence');
      expect(res.body).toHaveProperty('status');
      expect(res.body.status).toBe('success');
    }, 30000); // 30 second timeout for network request
  });

  describe('GET /analyze', () => {
    it('should require URL query parameter', async () => {
      const res = await request(app)
        .get('/analyze')
        .expect(400);
      
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('URL parameter is required');
    });

    it('should validate URL query parameter format', async () => {
      const res = await request(app)
        .get('/analyze?url=invalid-url')
        .expect(400);
      
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Invalid URL format');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app)
        .get('/unknown-endpoint')
        .expect(404);
      
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Endpoint not found');
    });
  });
});

describe('WebsiteAnalyzer', () => {
  const WebsiteAnalyzer = require('../src/websiteAnalyzer');
  const analyzer = new WebsiteAnalyzer();

  describe('analyzeContent', () => {
    it('should detect financing keywords', () => {
      const content = 'We offer financing options and you can apply now for credit approval.';
      const result = analyzer.analyzeContent(content);
      
      expect(result.isFinancingDetected).toBe(true);
      expect(result.matchedKeywords.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should not detect financing in regular content', () => {
      const content = 'This is a regular website about cooking recipes and food.';
      const result = analyzer.analyzeContent(content);
      
      expect(result.isFinancingDetected).toBe(false);
      expect(result.matchedKeywords.length).toBe(0);
      expect(result.confidence).toBe(0);
    });

    it('should detect payment patterns', () => {
      const content = 'Pay $99 per month for 12 months with 0% APR financing.';
      const result = analyzer.analyzeContent(content);
      
      expect(result.isFinancingDetected).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(analyzer.isValidUrl('https://example.com')).toBe(true);
      expect(analyzer.isValidUrl('http://test.org')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(analyzer.isValidUrl('not-a-url')).toBe(false);
      expect(analyzer.isValidUrl('ftp://example')).toBe(true); // FTP is valid URL
      expect(analyzer.isValidUrl('')).toBe(false);
    });
  });
});
