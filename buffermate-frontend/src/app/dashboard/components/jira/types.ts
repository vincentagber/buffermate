export type IssueType = 'epic' | 'story' | 'task' | 'bug' | 'subtask' | 'feature' | 'improvement' | 'milestone';
export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'blocked' | 'done' | 'cancelled';
export type IssuePriority = 'highest' | 'high' | 'medium' | 'low' | 'lowest';
export type ProjectTemplate = 'scrum' | 'kanban' | 'basic';
export type ProjectRole = 'project_admin' | 'scrum_master' | 'developer' | 'viewer';

export interface JiraProject {
  id: string;
  name: string;
  key: string;
  description?: string;
  template: ProjectTemplate;
  category?: string;
  lead_user_id?: string;
  default_assignee_id?: string;
  status: 'active' | 'archived';
  total_issues: number;
  done_issues: number;
  completion_percentage: number;
  members_count: number;
  active_sprint?: JiraSprint | null;
  created_at: string;
  members?: JiraMember[];
  sprints?: JiraSprint[];
  boards?: JiraBoard[];
}

export interface JiraMember {
  id: string;
  user_id: string;
  role: ProjectRole;
}

export interface JiraSprint {
  id: string;
  project_id: string;
  name: string;
  goal?: string;
  status: 'future' | 'active' | 'closed';
  start_date?: string;
  end_date?: string;
  completed_at?: string;
  issues_count?: number;
  total_story_points?: number;
  done_story_points?: number;
  work_items?: JiraIssue[];
}

export interface JiraIssue {
  id: string;
  workspace_id: string;
  project_id: string;
  sprint_id?: string | null;
  parent_id?: string | null;
  key: string;
  issue_number: number;
  title: string;
  description?: string | null;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  story_points?: number | null;
  estimated_hours?: number | null;
  logged_hours?: number;
  assignee_user_id?: string | null;
  reporter_user_id?: string | null;
  labels?: string[];
  components?: string[];
  start_date?: string | null;
  due_date?: string | null;
  completed_at?: string | null;
  resolution?: string | null;
  board_order?: number;
  created_at: string;
  updated_at?: string;
  subtasks?: JiraIssue[];
  comments?: JiraComment[];
  history?: JiraHistory[];
  links?: JiraLink[];
  attachments?: JiraAttachment[];
  parent?: JiraIssue | null;
  sprint?: JiraSprint | null;
}

export interface JiraComment {
  id: string;
  work_item_id: string;
  user_id: string;
  author_name?: string;
  content: string;
  created_at: string;
}

export interface JiraHistory {
  id: string;
  work_item_id: string;
  user_id: string;
  field: string;
  from_value?: string | null;
  to_value?: string | null;
  created_at: string;
}

export interface JiraLink {
  id: string;
  source_work_item_id: string;
  target_work_item_id: string;
  relationship: 'blocks' | 'is_blocked_by' | 'relates_to' | 'duplicates';
  target?: JiraIssue;
}

export interface JiraAttachment {
  id: string;
  work_item_id: string;
  user_id: string;
  user_name?: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  thumbnail_url?: string;
  created_at: string;
}

export interface JiraBoard {
  id: string;
  name: string;
  type: 'scrum' | 'kanban';
  columns: JiraBoardColumn[];
}

export interface JiraBoardColumn {
  id: string;
  name: string;
  mapped_status: IssueStatus;
  wip_limit?: number | null;
  order_index: number;
  cards: JiraIssue[];
  card_count: number;
  story_points_sum: number;
  is_over_wip: boolean;
}

export interface JiraAutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_event: string;
  conditions?: any[];
  actions?: any[];
  is_active: boolean;
  execution_count: number;
  last_executed_at?: string;
}

export interface JiraReportSummary {
  total_issues: number;
  done_issues: number;
  completion_percentage: number;
  total_story_points: number;
  done_story_points: number;
  status_distribution: Record<string, number>;
  priority_distribution: Record<string, number>;
  type_distribution: Record<string, number>;
  assignee_workload: Array<{
    assignee: string;
    count: number;
    story_points: number;
    estimated_hours: number;
    logged_hours: number;
  }>;
}

