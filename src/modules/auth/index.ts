// ============================================================================
// AUTH MODULE EXPORTS
// ============================================================================
// Public API for authentication module
// ============================================================================

export * from './auth.types';
export * from './auth.utils';
export * from './auth.validation';
export * from './auth.middleware';
export * from './auth.service';
export * from './auth.controller';

import authRoutes from './auth.routes';

export { authRoutes };

export default {
  routes: authRoutes,
};
