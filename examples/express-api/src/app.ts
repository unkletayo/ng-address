import express, { type Request, type Response, type NextFunction } from 'express';
import {
  NIGERIAN_STATES,
  findNigerianState,
  normalizeNigerianAddress,
  isValidPostcodeFormat,
  AddressError
} from '@ng-address/core';
import { NipostProvider } from '@ng-address/nipost';

export interface AppOptions {
  nipostApiKey?: string;
  nipostProvider?: NipostProvider;
}

export function createApp(options: AppOptions = {}): express.Express {
  const app = express();
  app.use(express.json());

  const provider =
    options.nipostProvider ||
    new NipostProvider({
      apiKey: options.nipostApiKey || process.env.NIPOST_API_KEY || 'mock_key'
    });

  // Health check
  app.get('/healthz', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Taxonomy: List States
  app.get('/api/v1/taxonomy/states', (req: Request, res: Response) => {
    const { zone } = req.query;
    let states = NIGERIAN_STATES;

    if (typeof zone === 'string' && zone.trim()) {
      const targetZone = zone.toLowerCase().replace(/[-_\s]/g, '');
      states = states.filter((s) => {
        const normalizedZone = s.geoZone.toLowerCase().replace(/[-_\s]/g, '');
        return normalizedZone.includes(targetZone);
      });
    }

    res.json({
      success: true,
      count: states.length,
      data: states
    });
  });

  // 2. Taxonomy: Get LGAs for State
  app.get('/api/v1/taxonomy/states/:state/lgas', (req: Request, res: Response) => {
    const stateQuery = req.params.state ? String(req.params.state) : '';
    const matched = findNigerianState(stateQuery);

    if (!matched) {
      res.status(404).json({
        success: false,
        error: `Nigerian state "${stateQuery}" not found`
      });
      return;
    }

    res.json({
      success: true,
      state: matched.name,
      stateCode: matched.code,
      capital: matched.capital,
      count: matched.lgas.length,
      lgas: matched.lgas
    });
  });

  // 3. Address Normalization
  app.post('/api/v1/address/normalize', (req: Request, res: Response) => {
    const { address } = req.body;

    if (!address) {
      res.status(400).json({
        success: false,
        error: 'Missing required "address" field in request body'
      });
      return;
    }

    const normalized = normalizeNigerianAddress(address);
    res.json({
      success: true,
      data: normalized
    });
  });

  // 4. Address Validation
  app.post('/api/v1/address/validate', (req: Request, res: Response) => {
    const { input } = req.body;

    if (!input || typeof input !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Missing or invalid "input" field in request body'
      });
      return;
    }

    const isPostcode = isValidPostcodeFormat(input);
    const matchedState = findNigerianState(input);

    let matchedLgaState: string | undefined;
    for (const s of NIGERIAN_STATES) {
      if (s.lgas.some((l) => l.toLowerCase() === input.toLowerCase().trim())) {
        matchedLgaState = s.name;
        break;
      }
    }

    const isValid = isPostcode || Boolean(matchedState) || Boolean(matchedLgaState);

    res.json({
      success: true,
      valid: isValid,
      details: {
        isPostcode,
        state: matchedState?.name ?? matchedLgaState ?? null,
        stateCode: matchedState?.code ?? null,
        recognizedLgaInState: matchedLgaState ?? null
      }
    });
  });

  // 5. Postcode Lookup (Server Proxy Route)
  app.post('/api/v1/address/lookup', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postcode } = req.body;

      if (!postcode || typeof postcode !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Missing or invalid "postcode" field in request body'
        });
        return;
      }

      if (!isValidPostcodeFormat(postcode)) {
        res.status(400).json({
          success: false,
          error: `"${postcode}" is not a valid Nigerian postcode format`
        });
        return;
      }

      const resolution = await provider.resolvePostcode(postcode);
      res.json({
        success: true,
        data: resolution
      });
    } catch (err) {
      next(err);
    }
  });

  // Centralized Error Middleware
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AddressError) {
      const statusCode = err.code === 'NOT_FOUND' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        code: err.code,
        error: err.message
      });
      return;
    }

    console.error('Unhandled server error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error occurred while processing address request'
    });
  });

  return app;
}
