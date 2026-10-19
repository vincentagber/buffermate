import { 
  WorkspaceRole, 
  PermissionAction, 
  Workspace, 
  WorkspaceMember, 
  AuditLog 
} from '../types';

/**
 * PRD-Compliant Role-Based Access Control (RBAC) Matrix
 * 
 * Strict separation:
 * - Creator: draft/edit, submit for approval. Cannot approve or publish.
 * - Approver: review/approve/reject. Cannot publish.
 * - Strategist: plan, edit, publish approved content. Cannot approve own work if separated.
 * - Admin/Owner: full workspace governance, connection management, publishing.
 * - Community Manager: inbox/leads.
 * - Analyst: read-only reporting.
 */
export const ROLE_PERMISSIONS: Record<WorkspaceRole, PermissionAction[]> = {
  owner: [
    'workspace:manage',
    'members:manage',
    'connections:manage',
    'billing:manage',
    'campaigns:manage',
    'content:create',
    'content:edit',
    'content:delete',
    'content:submit_for_approval',
    'content:approve',
    'content:publish',
    'inbox:read',
    'inbox:reply',
    'analytics:view',
    'automation:manage',
    'automation:kill_switch',
  ],
  admin: [
    'members:manage',
    'connections:manage',
    'campaigns:manage',
    'content:create',
    'content:edit',
    'content:delete',
    'content:submit_for_approval',
    'content:approve',
    'content:publish',
    'inbox:read',
    'inbox:reply',
    'analytics:view',
    'automation:manage',
    'automation:kill_switch',
  ],
  strategist: [
    'campaigns:manage',
    'content:create',
    'content:edit',
    'content:submit_for_approval',
    'content:publish', // Can publish APPROVED content
    'inbox:read',
    'analytics:view',
  ],
  creator: [
    'content:create',
    'content:edit',
    'content:submit_for_approval',
    // NO content:approve, NO content:publish
  ],
  approver: [
    'content:approve',
    'analytics:view',
    // NO content:publish, NO content:create
  ],
  community_manager: [
    'inbox:read',
    'inbox:reply',
    'analytics:view',
  ],
  analyst: [
    'analytics:view',
  ],
};

export function canPerformAction(role: WorkspaceRole, action: PermissionAction): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(action);
}

export function canApproveContent(role: WorkspaceRole): boolean {
  return canPerformAction(role, 'content:approve');
}

export function canPublishContent(role: WorkspaceRole): boolean {
  return canPerformAction(role, 'content:publish');
}

/**
 * Validates strict tenant isolation between an entity and the requested workspace context.
 */
export function isTenantIsolated(entityWorkspaceId: string, requestedWorkspaceId: string): boolean {
  return Boolean(entityWorkspaceId && requestedWorkspaceId && entityWorkspaceId === requestedWorkspaceId);
}

/**
 * In-Memory & Database-backed Workspace & RBAC Service
 * Supports multi-workspace management with complete tenant isolation and audit logging.
 */
class WorkspaceService {
  private static instance: WorkspaceService;
  private workspaces: Map<string, Workspace> = new Map();
  private members: Map<string, WorkspaceMember[]> = new Map(); // workspace_id -> members
  private auditLogs: AuditLog[] = [];

  private constructor() {
    this.seedDefaultWorkspace();
  }

  public static getInstance(): WorkspaceService {
    if (!WorkspaceService.instance) {
      WorkspaceService.instance = new WorkspaceService();
    }
    return WorkspaceService.instance;
  }

  private seedDefaultWorkspace() {
    const defaultWs: Workspace = {
      id: 'ws_northstar_main',
      name: 'Northstar Agency',
      slug: 'northstar-agency',
      timezone: 'Africa/Lagos',
      default_locale: 'en',
      plan_id: 'agency_pro',
      settings: {
        autopilot_killed: false,
        require_approval: true,
        default_publish_time: '09:00',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.workspaces.set(defaultWs.id, defaultWs);

    const defaultMembers: WorkspaceMember[] = [
      {
        id: 'mem_owner_1',
        workspace_id: defaultWs.id,
        user_id: 'user_admin_001',
        role: 'owner',
        status: 'active',
        joined_at: new Date().toISOString(),
      },
      {
        id: 'mem_creator_1',
        workspace_id: defaultWs.id,
        user_id: 'user_creator_002',
        role: 'creator',
        status: 'active',
        joined_at: new Date().toISOString(),
      },
      {
        id: 'mem_approver_1',
        workspace_id: defaultWs.id,
        user_id: 'user_approver_003',
        role: 'approver',
        status: 'active',
        joined_at: new Date().toISOString(),
      },
      {
        id: 'mem_strategist_1',
        workspace_id: defaultWs.id,
        user_id: 'user_strategist_004',
        role: 'strategist',
        status: 'active',
        joined_at: new Date().toISOString(),
      },
    ];
    this.members.set(defaultWs.id, defaultMembers);
  }

  public getWorkspace(id: string): Workspace | undefined {
    return this.workspaces.get(id);
  }

  public listWorkspacesForUser(userId: string): Array<{ workspace: Workspace; role: WorkspaceRole }> {
    const result: Array<{ workspace: Workspace; role: WorkspaceRole }> = [];
    for (const [wsId, membersList] of this.members.entries()) {
      const mem = membersList.find((m) => m.user_id === userId && m.status === 'active');
      if (mem) {
        const ws = this.workspaces.get(wsId);
        if (ws) {
          result.push({ workspace: ws, role: mem.role });
        }
      }
    }
    return result;
  }

  public createWorkspace(data: { name: string; slug: string; timezone?: string; ownerUserId: string }): Workspace {
    const ws: Workspace = {
      id: `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name,
      slug: data.slug,
      timezone: data.timezone || 'UTC',
      default_locale: 'en',
      plan_id: 'pro',
      owner_user_id: data.ownerUserId,
      settings: {
        autopilot_killed: false,
        require_approval: true,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.workspaces.set(ws.id, ws);

    // Add owner member
    const ownerMember: WorkspaceMember = {
      id: `mem_${Date.now()}`,
      workspace_id: ws.id,
      user_id: data.ownerUserId,
      role: 'owner',
      status: 'active',
      joined_at: new Date().toISOString(),
    };
    this.members.set(ws.id, [ownerMember]);

    this.recordAuditLog(
      ws.id,
      data.ownerUserId,
      'workspace:created',
      'workspace',
      ws.id,
      { name: ws.name, slug: ws.slug }
    );

    return ws;
  }

  public getMemberRole(workspaceId: string, userId: string): WorkspaceRole | null {
    const membersList = this.members.get(workspaceId);
    if (!membersList) return null;
    const member = membersList.find((m) => m.user_id === userId && m.status === 'active');
    return member ? member.role : null;
  }

  public addMember(
    workspaceId: string, 
    userId: string, 
    role: WorkspaceRole, 
    actorId: string
  ): { success: boolean; member?: WorkspaceMember; error?: string } {
    const actorRole = this.getMemberRole(workspaceId, actorId);
    if (!actorRole || !canPerformAction(actorRole, 'members:manage')) {
      return { success: false, error: 'Unauthorized: actor cannot manage workspace members' };
    }

    const membersList = this.members.get(workspaceId) || [];
    if (membersList.some((m) => m.user_id === userId)) {
      return { success: false, error: 'User is already a member of this workspace' };
    }

    const newMember: WorkspaceMember = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      workspace_id: workspaceId,
      user_id: userId,
      role,
      status: 'active',
      invited_by: actorId,
      joined_at: new Date().toISOString(),
    };

    membersList.push(newMember);
    this.members.set(workspaceId, membersList);

    this.recordAuditLog(
      workspaceId,
      actorId,
      'member:added',
      'workspace_member',
      newMember.id,
      { userId, role }
    );

    return { success: true, member: newMember };
  }

  public checkPermission(
    userId: string, 
    workspaceId: string, 
    action: PermissionAction
  ): { allowed: boolean; role?: WorkspaceRole; reason?: string } {
    const role = this.getMemberRole(workspaceId, userId);
    if (!role) {
      return { allowed: false, reason: 'User is not an active member of this workspace' };
    }

    const allowed = canPerformAction(role, action);
    if (!allowed) {
      return { 
        allowed: false, 
        role, 
        reason: `Role '${role}' is not authorized to perform action '${action}'` 
      };
    }

    return { allowed: true, role };
  }

  public recordAuditLog(
    workspaceId: string,
    actorId: string | undefined,
    action: string,
    resourceType: string,
    resourceId?: string,
    metadata: Record<string, any> = {}
  ): AuditLog {
    // Redact sensitive keys from audit log metadata (tokens, passwords, keys)
    const redactedMetadata = { ...metadata };
    for (const key of Object.keys(redactedMetadata)) {
      const lower = key.toLowerCase();
      if (
        lower.includes('token') || 
        lower.includes('password') || 
        lower.includes('secret') || 
        lower.includes('key')
      ) {
        redactedMetadata[key] = '[REDACTED]';
      }
    }

    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      workspace_id: workspaceId,
      actor_id: actorId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata_redacted: redactedMetadata,
      created_at: new Date().toISOString(),
    };

    this.auditLogs.unshift(log);
    // Keep max 500 logs in-memory
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }

    return log;
  }

  public getAuditLogs(workspaceId: string, limit: number = 50): AuditLog[] {
    return this.auditLogs.filter((l) => l.workspace_id === workspaceId).slice(0, limit);
  }

  public updateWorkspaceSettings(
    workspaceId: string, 
    actorId: string, 
    settings: Partial<Workspace['settings']>
  ): { success: boolean; workspace?: Workspace; error?: string } {
    const perm = this.checkPermission(userIdToActor(actorId), workspaceId, 'workspace:manage');
    if (!perm.allowed) {
      return { success: false, error: perm.reason };
    }

    const ws = this.workspaces.get(workspaceId);
    if (!ws) {
      return { success: false, error: 'Workspace not found' };
    }

    ws.settings = { ...ws.settings, ...settings };
    ws.updated_at = new Date().toISOString();
    this.workspaces.set(workspaceId, ws);

    this.recordAuditLog(
      workspaceId,
      actorId,
      'workspace:settings_updated',
      'workspace',
      workspaceId,
      settings
    );

    return { success: true, workspace: ws };
  }
}

function userIdToActor(actorId: string): string {
  return actorId;
}

export const workspaceService = WorkspaceService.getInstance();
