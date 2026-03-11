import express from 'express';
import database from '../config/database.js';
import redis from '../config/redis.js';
import { getCacheStats } from '../middleware/cacheMiddleware.js';
import os from 'os';

const router = express.Router();

/**
 * Basic health check endpoint
 * GET /health
 */
router.get('/health', async (req, res) => {
  try {
    const dbHealth = await database.checkDBHealth();
    const redisHealth = await redis.checkRedisHealth();

    const isHealthy = dbHealth.healthy && redisHealth.healthy;

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbHealth,
        redis: redisHealth
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

/**
 * Readiness check (for Kubernetes)
 * GET /ready
 */
router.get('/ready', async (req, res) => {
  try {
    const dbHealth = await database.checkDBHealth();
    const redisHealth = await redis.checkRedisHealth();

    if (dbHealth.healthy && redisHealth.healthy) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        services: {
          database: dbHealth,
          redis: redisHealth
        }
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message
    });
  }
});

/**
 * Liveness check (for Kubernetes)
 * GET /live
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

/**
 * Detailed system metrics
 * GET /metrics
 */
router.get('/metrics', async (req, res) => {
  try {
    const dbStats = await database.getDBStats();
    const redisStats = await redis.getRedisStats();
    const cacheStats = getCacheStats();

    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      
      // Process metrics
      process: {
        pid: process.pid,
        memory: {
          rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
          heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          external: `${(process.memoryUsage().external / 1024 / 1024).toFixed(2)} MB`
        },
        cpu: process.cpuUsage()
      },

      // System metrics
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        loadAverage: os.loadavg()
      },

      // Database metrics
      database: dbStats,

      // Redis metrics
      redis: redisStats,

      // Cache metrics
      cache: cacheStats
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to collect metrics',
      message: error.message
    });
  }
});

/**
 * Application info
 * GET /info
 */
router.get('/info', (req, res) => {
  res.json({
    name: 'EduManage Pro API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

export default router;
