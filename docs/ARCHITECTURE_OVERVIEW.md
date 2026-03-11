# System Architecture & Technology Stack

**Last Updated**: February 26, 2026  
**Version**: 1.0.0  
**Status**: Production Ready

## High-Level Architecture

### Multi-Tenant SaaS Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Web App       │   Mobile App    │   Admin Dashboard       │
│   (React/Next)  │   (React Native)│   (React/Next)          │
└─────────────────┴─────────────────┴─────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Load Balancer   │
                    │   (Nginx/HAProxy) │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                        │
│              (Rate Limiting, Auth, Routing)                 │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Application Layer (Node.js)                │
│                    Express.js Servers                       │
│              (Horizontal Scaling - Multiple Instances)      │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌──────▼──────┐
│   MongoDB      │   │   Redis Cache   │   │  Socket.io  │
│   (Replica Set)│   │   (Cluster)     │   │  (Redis     │
│                │   │                 │   │   Adapter)  │
└────────────────┘   └─────────────────┘   └─────────────┘
        │
┌───────▼────────┐
│   File Storage │
│   (AWS S3/     │
│    MinIO)      │
└────────────────┘
```

## Technology Stack

### Frontend Technologies

#### Web Application
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand
- **UI Framework**: Tailwind CSS + Custom Styles
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: Native React state + controlled components
- **Routing**: React Router v6 (Finalized SaaS Router)
- **Real-time**: Socket.io-client
- **Layouts**: Multi-role layouts (Main, SuperAdmin, Agent)

#### Mobile Application
- **Framework**: React Native 0.72+
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation 6
- **UI Components**: NativeBase / React Native Elements
- **Push Notifications**: Firebase Cloud Messaging
- **Offline Storage**: AsyncStorage + SQLite
- **Biometrics**: React Native Biometrics

#### Admin Dashboard
- **Framework**: Next.js 13+ with App Router
- **UI Components**: Ant Design / Chakra UI
- **Charts**: D3.js / Nivo
- **Tables**: React Table v8
- **Date Handling**: Day.js

### Backend Technologies

#### Current Implementation (Production Ready)
- **Runtime**: Node.js 18+ LTS with ES Modules
- **Framework**: Express.js 4.x
- **Architecture**: Modular MVC with Service Layer Pattern
- **Database**: MongoDB 6.x with Mongoose ODM
- **Caching**: Redis 7.x for session and data caching
- **Real-time**: Socket.io for WebSocket connections
- **Background Jobs**: BullMQ with Redis queue
- **File Upload**: Multer with AWS S3 integration
- **Authentication**: JWT (jsonwebtoken) + Passport.js
- **Validation**: Joi / Express-validator
- **Logging**: Winston + Morgan
- **Error Tracking**: Sentry integration
- **Security**: Helmet, CORS, Rate limiting (express-rate-limit)
- **Email**: Nodemailer with SMTP/SendGrid
- **SMS**: Twilio integration
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Payment Gateways**: Stripe, PayU, Razorpay SDKs
- **Video Conferencing**: Jitsi Meet, Zoom API integration
- **Process Management**: PM2 for production

#### Core Services Implemented

##### Authentication & Authorization
- **JWT**: Access and refresh token system
- **RBAC**: Role-based access control with 13 user roles
- **Multi-tenant**: Tenant isolation middleware
- **Security**: Helmet, rate limiting, input sanitization
- **Session Management**: Redis-backed sessions

##### Academic Management
- **Student Management**: Complete CRUD with academic records
- **Teacher Management**: Class assignments, schedules
- **Attendance System**: Real-time marking with statistics
- **Homework & Notes**: Assignment tracking and submissions
- **Examinations**: Exam scheduling, grading, report cards
- **Timetable**: Class schedules and timetables

##### Financial Management
- **Fee Management**: Invoice generation and tracking
- **Payment Processing**: Razorpay integration
- **Payment Verification**: Webhook handling
- **Financial Reports**: Fee collection and outstanding reports
- **Receipt Generation**: Automated receipt creation

##### Communication System
- **Real-time Messaging**: Socket.io chat implementation
- **Email Service**: Nodemailer with SMTP
- **Notifications**: Multi-channel notification system
- **PTM System**: Parent-teacher meeting scheduling
- **Call Logs**: Communication tracking

##### Dashboard & Analytics
- **Role-based Dashboards**: Student, Teacher, Parent, Admin
- **Quick Statistics**: Real-time metrics
- **Activity Tracking**: Recent activities and updates
- **Performance Analytics**: Academic and attendance analytics
- **Custom Reports**: Flexible reporting system

##### Theme & Customization
- **User Preferences**: Light/dark mode, color schemes
- **Design Tokens**: Centralized design system
- **Institution Branding**: Custom logos and colors
- **Accessibility**: WCAG compliance features

##### Tenant Management
- **Multi-tenancy**: Complete tenant isolation
- **Tenant Configuration**: Custom settings per tenant
- **Subscription Management**: Plan-based features
- **Usage Tracking**: Resource monitoring per tenant

##### Admission System
- **Application Management**: Online admission processing
- **Document Upload**: Application document handling
- **Review Workflow**: Multi-stage approval process
- **Seat Allocation**: Automated seat assignment

### Database Architecture

#### Primary Database (MongoDB 6.x)
```javascript
// Collections structure (89+ collections)
Collections:
├── users (authentication and profiles)
├── institutions (tenant data)
├── students (student records with academic history)
├── teachers (teacher records with assignments)
├── parents/guardians (parent records)
├── classes (class information)
├── sections (section data)
├── subjects (subject data)
├── attendance (attendance records)
├── homework (assignments and submissions)
├── exams (examination data)
├── grades (grading records)
├── fees (fee structures)
├── invoices (fee invoices)
├── payments (payment records)
├── installments (installment plans)
├── scholarships (scholarship applications)
├── notifications (notification queue)
├── messages (chat messages)
├── conversations (chat rooms)
├── ptm_slots (PTM scheduling with video meetings)
├── admissions (admission applications)
├── entrance_tests (entrance test data)
├── merit_lists (merit list generation)
├── settings (system configuration)
├── themes (theme preferences)
├── audit_logs (activity tracking)
├── sessions (user sessions)
├── library_books (library management)
├── library_issues (book issues)
├── library_reservations (book reservations)
├── vehicles (transport vehicles)
├── transport_routes (transport routes)
├── student_transport (student assignments)
├── trips (trip tracking)
├── vehicle_maintenance (maintenance records)
├── online_exams (online examination system)
├── exam_submissions (student submissions)
├── proctoring_sessions (proctoring data)
├── question_bank (question repository)
├── video_conferences (video meeting data)
├── file_sharing (shared files)
├── dashboard_widgets (customizable widgets)
├── oauth_accounts (OAuth linked accounts)
├── biometric_credentials (biometric auth data)
├── two_factor_auth (2FA settings)
└── api_keys (API key management)

// Indexes for Performance
Indexes:
├── Compound indexes on tenant + date fields
├── Text indexes for search functionality
├── Geospatial indexes for location-based queries
├── TTL indexes for session expiration
└── Unique indexes for email, phone, admission numbers
```

#### MongoDB Configuration
```javascript
// Replica Set Configuration (Production)
{
  replSet: "edumanage-rs",
  members: [
    { _id: 0, host: "mongo-primary:27017", priority: 2 },
    { _id: 1, host: "mongo-secondary-1:27017", priority: 1 },
    { _id: 2, host: "mongo-secondary-2:27017", priority: 1 }
  ]
}

// Connection Options
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 100,
  minPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: "majority"
}
```

#### Cache Layer (Redis 7.x)
```javascript
// Redis Usage Patterns
{
  // Session Storage
  "session:user:{userId}": "user session data",
  "session:refresh:{token}": "refresh token data",
  
  // Application Cache
  "cache:dashboard:{userId}": "dashboard data (TTL: 5min)",
  "cache:stats:{tenantId}": "statistics (TTL: 15min)",
  "cache:attendance:{classId}:{date}": "attendance data (TTL: 1hour)",
  
  // Rate Limiting
  "ratelimit:{ip}:{endpoint}": "request count",
  
  // Real-time Data
  "socket:rooms": "active socket rooms",
  "socket:users": "online users",
  
  // Message Queue (BullMQ)
  "bull:{queueName}:*": "job queue data",
  
  // Temporary Data
  "otp:{userId}": "OTP codes (TTL: 10min)",
  "verification:{token}": "email verification (TTL: 24hours)"
}

// Redis Cluster Configuration (Production)
{
  cluster: [
    { host: "redis-node-1", port: 6379 },
    { host: "redis-node-2", port: 6379 },
    { host: "redis-node-3", port: 6379 }
  ],
  options: {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    enableOfflineQueue: true
  }
}
```

#### File Storage (AWS S3 / MinIO)
```javascript
// Storage Structure
{
  buckets: {
    "edumanage-documents": {
      // Student documents, assignments
      path: "/{tenantId}/documents/{year}/{month}/{filename}",
      acl: "private",
      encryption: "AES256"
    },
    "edumanage-media": {
      // Profile photos, videos
      path: "/{tenantId}/media/{type}/{filename}",
      acl: "public-read",
      cdn: "CloudFront"
    },
    "edumanage-backups": {
      // Database backups
      path: "/backups/{date}/{filename}",
      acl: "private",
      lifecycle: "90 days retention"
    }
  }
}
```

---

## Traffic Management & Performance Optimization

### Load Balancing Strategy

#### Nginx Configuration (Recommended)
```nginx
upstream backend_servers {
    least_conn;  # Least connections algorithm
    
    server backend-1:5000 weight=3 max_fails=3 fail_timeout=30s;
    server backend-2:5000 weight=3 max_fails=3 fail_timeout=30s;
    server backend-3:5000 weight=2 max_fails=3 fail_timeout=30s;
    
    keepalive 32;  # Connection pooling
}

server {
    listen 80;
    server_name api.edumanage.pro;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
    limit_req zone=api_limit burst=200 nodelay;
    
    # Connection limiting
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    limit_conn conn_limit 20;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # Buffering
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    
    # Compression
    gzip on;
    gzip_types application/json text/plain text/css application/javascript;
    gzip_min_length 1000;
    
    location / {
        proxy_pass http://backend_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket support
    location /socket.io/ {
        proxy_pass http://backend_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static file caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Application-Level Optimizations

#### Express.js Configuration
```javascript
// server.js optimizations
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize data
app.use(mongoSanitize());

// Rate limiting - Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);

// Rate limiting - Authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
});
app.use('/api/v1/auth/login', authLimiter);

// Speed limiting (slow down responses)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: 500,
});
app.use('/api/', speedLimiter);

// Trust proxy (for load balancer)
app.set('trust proxy', 1);

// Cluster mode for multi-core utilization
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master process ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker processes
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}
```

### Database Query Optimization

#### MongoDB Best Practices
```javascript
// 1. Use indexes effectively
await Student.collection.createIndex({ tenantId: 1, email: 1 }, { unique: true });
await Attendance.collection.createIndex({ tenantId: 1, date: -1, classId: 1 });
await Payment.collection.createIndex({ tenantId: 1, status: 1, createdAt: -1 });

// 2. Use projection to limit fields
const students = await Student.find({ tenantId })
  .select('firstName lastName email class')
  .lean(); // Convert to plain JS object (faster)

// 3. Use aggregation for complex queries
const stats = await Attendance.aggregate([
  { $match: { tenantId, date: { $gte: startDate } } },
  { $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  }
]);

// 4. Implement pagination
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const skip = (page - 1) * limit;

const [data, total] = await Promise.all([
  Model.find(query).skip(skip).limit(limit).lean(),
  Model.countDocuments(query)
]);

// 5. Use connection pooling
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 100,
  minPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### Caching Strategy

#### Multi-Level Caching
```javascript
import Redis from 'ioredis';
import NodeCache from 'node-cache';

// Level 1: In-memory cache (fastest)
const memoryCache = new NodeCache({ 
  stdTTL: 300, // 5 minutes
  checkperiod: 60 
});

// Level 2: Redis cache (shared across instances)
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
});

// Caching middleware
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}:${req.user?.id}`;
    
    // Check memory cache first
    const memCached = memoryCache.get(key);
    if (memCached) {
      return res.json(memCached);
    }
    
    // Check Redis cache
    const redisCached = await redis.get(key);
    if (redisCached) {
      const data = JSON.parse(redisCached);
      memoryCache.set(key, data); // Store in memory for next time
      return res.json(data);
    }
    
    // Store original send function
    const originalSend = res.json;
    
    // Override send function
    res.json = function(data) {
      // Cache the response
      memoryCache.set(key, data);
      redis.setex(key, duration, JSON.stringify(data));
      
      // Call original send
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Usage
router.get('/dashboard', authenticate, cacheMiddleware(300), getDashboard);
```

### Connection Pooling

#### Database Connection Pool
```javascript
// MongoDB connection pooling
const mongooseOptions = {
  maxPoolSize: 100, // Maximum connections
  minPoolSize: 10,  // Minimum connections
  maxIdleTimeMS: 30000, // Close idle connections after 30s
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Redis connection pooling
const redisPool = new Redis.Cluster([
  { host: 'redis-1', port: 6379 },
  { host: 'redis-2', port: 6379 },
  { host: 'redis-3', port: 6379 }
], {
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
  },
  clusterRetryStrategy: (times) => Math.min(100 * times, 2000),
});
```

### Background Job Processing

#### BullMQ Configuration
```javascript
import { Queue, Worker } from 'bullmq';

// Create queues
const emailQueue = new Queue('email', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 1000,
  }
});

const notificationQueue = new Queue('notification', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  }
});

// Process jobs in workers
const emailWorker = new Worker('email', async (job) => {
  const { to, subject, body } = job.data;
  await sendEmail(to, subject, body);
}, {
  connection: redis,
  concurrency: 10, // Process 10 jobs concurrently
  limiter: {
    max: 100, // Max 100 jobs
    duration: 1000, // per second
  }
});

// Add jobs to queue (non-blocking)
await emailQueue.add('send-welcome', {
  to: 'user@example.com',
  subject: 'Welcome',
  body: 'Welcome to EduManage'
});
```

### WebSocket Optimization

#### Socket.io with Redis Adapter
```javascript
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6, // 1MB
});

// Redis adapter for horizontal scaling
const pubClient = new Redis(process.env.REDIS_URL);
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// Namespace for better organization
const dashboardNamespace = io.of('/dashboard');
const chatNamespace = io.of('/chat');

// Room-based broadcasting
io.on('connection', (socket) => {
  const tenantId = socket.handshake.auth.tenantId;
  
  // Join tenant-specific room
  socket.join(`tenant:${tenantId}`);
  
  // Broadcast to specific tenant
  io.to(`tenant:${tenantId}`).emit('update', data);
});
```

### Infrastructure & DevOps

#### Production Deployment Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    CDN (CloudFlare/CloudFront)              │
│                    (Static Assets, Images)                  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer (Nginx/HAProxy)            │
│              (SSL Termination, Rate Limiting)               │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌──────▼──────┐
│   App Server   │   │   App Server    │   │  App Server │
│   Instance 1   │   │   Instance 2    │   │  Instance 3 │
│   (PM2 Cluster)│   │   (PM2 Cluster) │   │ (PM2 Cluster)│
└────────────────┘   └─────────────────┘   └─────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌──────▼──────┐
│   MongoDB      │   │   Redis Cluster │   │  File       │
│   Replica Set  │   │   (3 nodes)     │   │  Storage    │
│   (Primary +   │   │                 │   │  (S3/MinIO) │
│    2 Secondary)│   │                 │   │             │
└────────────────┘   └─────────────────┘   └─────────────┘
```

#### PM2 Configuration (Process Manager)
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'edumanage-api',
    script: './src/server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 10000,
    kill_timeout: 5000,
    wait_ready: true,
    shutdown_with_message: true,
  }]
};

// Usage
// pm2 start ecosystem.config.js
// pm2 reload edumanage-api --update-env
// pm2 logs edumanage-api
// pm2 monit
```

#### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 5000

CMD ["node", "src/server.js"]
```

```yaml
# docker-compose.yml (Development)
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/edumanage
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    volumes:
      - ./src:/app/src
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

#### Kubernetes Deployment (Production)
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: edumanage-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: edumanage-api
  template:
    metadata:
      labels:
        app: edumanage-api
    spec:
      containers:
      - name: api
        image: edumanage/api:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: edumanage-secrets
              key: mongodb-uri
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: edumanage-secrets
              key: redis-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: edumanage-api-service
spec:
  selector:
    app: edumanage-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: edumanage-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: edumanage-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

#### Monitoring & Logging
- **Metrics**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM**: New Relic / DataDog
- **Error Tracking**: Sentry
- **Health Checks**: Custom health endpoints

#### Security
- **WAF**: AWS WAF / Cloudflare
- **DDoS Protection**: Cloudflare
- **SSL/TLS**: Let's Encrypt / AWS Certificate Manager
- **Secrets Management**: AWS Secrets Manager / HashiCorp Vault
- **Compliance**: SOC 2, ISO 27001 standards

### Development Workflow

#### Version Control
- **VCS**: Git
- **Hosting**: GitHub / GitLab
- **Branching**: GitFlow
- **Code Review**: Pull requests
- **CI/CD**: Automated testing and deployment

#### Development Environment
- **Local Development**: Docker Compose
- **IDE**: VS Code / IntelliJ
- **API Testing**: Postman / Insomnia
- **Database Management**: pgAdmin, DBeaver
- **Documentation**: Swagger/OpenAPI

#### Testing Strategy
- **Unit Testing**: Jest (Frontend), Pytest (Backend)
- **Integration Testing**: Supertest, TestContainers
- **E2E Testing**: Playwright
- **Performance Testing**: K6, Artillery
- **Security Testing**: OWASP ZAP

### Scalability Considerations

#### Horizontal Scaling
- **Stateless Services**: All microservices designed for horizontal scaling
- **Load Balancing**: Application load balancers
- **Database Sharding**: Tenant-based sharding
- **Caching Strategy**: Multi-level caching

#### Performance Optimization
- **CDN**: Global content delivery
- **Database Optimization**: Indexing, query optimization
- **Async Processing**: Background job queues
- **Caching**: Redis clusters, application-level caching

#### High Availability
- **Multi-AZ Deployment**: Multiple availability zones
- **Database Replication**: Master-slave replication
- **Failover**: Automatic failover mechanisms
- **Backup Strategy**: Automated backups, point-in-time recovery

## Integration Architecture

### Third-Party Integrations
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Payment       │    │   Communication  │    │   Analytics     │
│   Gateways      │    │   Services      │    │   Platforms     │
│                 │    │                 │    │                 │
│ • Razorpay      │    │ • SendGrid      │    │ • Google        │
│ • Stripe        │    │ • Twilio        │    │   Analytics     │
│ • PayU          │    │ • FCM           │    │ • Mixpanel      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Integration   │
                    │   Layer         │
                    │                 │
                    │ • API Gateway   │
                    │ • Webhooks      │
                    │ • Message Queue │
                    └─────────────────┘
```

### Data Flow Architecture
1. **Request Flow**: Client → API Gateway → Authentication → Service → Database
2. **Event Flow**: Service → Message Queue → Analytics → Reporting
3. **Notification Flow**: Service → Notification Service → Multiple Channels
4. **File Flow**: Client → Upload Service → Storage → CDN

## Technology Rationale

### Frontend Choices
- **React**: Component-based architecture for building a complex UI.
- **TypeScript**: Ensures type safety across the large codebase.
- **Tailwind CSS**: Rapid styling with a utility-first approach.
- **Zustand**: Lightweight and performant state management.

### Backend Choices
- **Node.js**: Event-driven architecture for high scalability.
- **Express.js**: Minimalist web framework for robust API development.
- **MongoDB**: Schema-less document store for flexible educational data.
- **Redis**: High-performance caching and message queuing (BullMQ).

### Infrastructure Choices
- **Docker**: Containerization for consistent development and production environments.
- **AWS/DigitalOcean**: Reliable hosting for SaaS applications.
- **Nginx**: High-performance reverse proxy and load balancer.
