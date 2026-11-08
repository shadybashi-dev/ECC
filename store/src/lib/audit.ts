import { getDb } from '@/lib/db'

export function addAuditLog(db: any, actorId: string | null, action: string, entity: string, entityId: string | null, metadata: any = {}) {
  db.prepare(
    'INSERT INTO audit_logs (actor_id, action, entity, entity_id, metadata) VALUES (?, ?, ?, ?, ?)'
  ).run(actorId, action, entity, entityId, JSON.stringify(metadata))
}
