// ============================================================================
// PRISMA CLIENT SINGLETON
// ============================================================================
// Single instance of Prisma client for database operations
// ============================================================================

import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

/**
 * Get Prisma client instance
 * Creates singleton to avoid multiple connections
 */
export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}

export const prisma = getPrismaClient();

/**
 * Disconnect Prisma client
 */
export async function disconnectPrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
  }
}
