import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRouter from './supplier';
import { runMigrations } from '../db/migrate';
import { closeDatabase, getDatabase } from '../db/sqlite';
import { errorHandler } from '../utils/errors';

let app: express.Express;

describe('Supplier API', () => {
  beforeEach(async () => {
    await closeDatabase();
    await getDatabase(true);
    await runMigrations(true);

    app = express();
    app.use(express.json());
    app.use('/suppliers', supplierRouter);
    app.use(errorHandler);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it('should include lastUpdated in supplier detail response', async () => {
    const db = await getDatabase();
    const timestamp = '2026-01-01T00:00:00.000Z';

    await db.run(
      'INSERT INTO suppliers (supplier_id, name, active, verified, last_updated) VALUES (?, ?, ?, ?, ?)',
      [1, 'Supplier One', 1, 1, timestamp],
    );

    const response = await request(app).get('/suppliers/1');
    expect(response.status).toBe(200);
    expect(response.body.supplierId).toBe(1);
    expect(response.body.lastUpdated).toBe(timestamp);
  });
});
