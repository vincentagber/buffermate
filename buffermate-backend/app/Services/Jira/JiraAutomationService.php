<?php

namespace App\Services\Jira;

use App\Models\JiraAutomationExecution;
use App\Models\JiraAutomationRule;
use App\Models\WorkItem;
use App\Models\WorkItemComment;
use App\Models\WorkItemHistory;

class JiraAutomationService
{
    /**
     * Dispatch an automation event and evaluate matching rules.
     */
    public function dispatchEvent(string $event, WorkItem $workItem, array $extraContext = []): array
    {
        $rules = JiraAutomationRule::where('workspace_id', $workItem->workspace_id)
            ->where(function ($q) use ($workItem) {
                $q->where('project_id', $workItem->project_id)
                  ->orWhereNull('project_id');
            })
            ->where('trigger_event', $event)
            ->where('is_active', true)
            ->get();

        $executionResults = [];

        foreach ($rules as $rule) {
            $executionResults[] = $this->evaluateAndExecuteRule($rule, $workItem, $extraContext);
        }

        return $executionResults;
    }

    protected function evaluateAndExecuteRule(JiraAutomationRule $rule, WorkItem $workItem, array $extraContext): array
    {
        $conditionsMet = true;
        $conditions = $rule->conditions ?? [];

        foreach ($conditions as $cond) {
            $field = $cond['field'] ?? null;
            $operator = $cond['operator'] ?? 'equals';
            $expectedValue = $cond['value'] ?? null;

            $actualValue = $workItem->{$field} ?? null;

            switch ($operator) {
                case 'equals':
                    if ($actualValue !== $expectedValue) {
                        $conditionsMet = false;
                    }
                    break;
                case 'is_empty':
                    if (!empty($actualValue)) {
                        $conditionsMet = false;
                    }
                    break;
                case 'not_equals':
                    if ($actualValue === $expectedValue) {
                        $conditionsMet = false;
                    }
                    break;
                case 'in':
                    if (!in_array($actualValue, (array)$expectedValue)) {
                        $conditionsMet = false;
                    }
                    break;
            }

            if (!$conditionsMet) {
                break;
            }
        }

        if (!$conditionsMet) {
            return [
                'rule_id' => $rule->id,
                'status' => 'skipped',
                'reason' => 'Conditions not met',
            ];
        }

        // Execute Actions
        $logs = [];
        $actions = $rule->actions ?? [];

        foreach ($actions as $actionDef) {
            $action = $actionDef['action'] ?? null;

            switch ($action) {
                case 'assign_issue':
                    $assignee = $actionDef['user_id'] ?? null;
                    if ($assignee) {
                        $workItem->update(['assignee_user_id' => $assignee]);
                        $logs[] = "Assigned issue to {$assignee}";
                    }
                    break;

                case 'set_status':
                    $newStatus = $actionDef['status'] ?? null;
                    if ($newStatus) {
                        $workItem->update(['status' => $newStatus]);
                        $logs[] = "Transitioned status to {$newStatus}";
                    }
                    break;

                case 'set_resolution':
                    $resolution = $actionDef['resolution'] ?? 'Done';
                    $workItem->update([
                        'resolution' => $resolution,
                        'completed_at' => now(),
                    ]);
                    $logs[] = "Set resolution to {$resolution} and recorded completed_at";
                    break;

                case 'add_comment':
                    $commentText = $actionDef['comment'] ?? 'Automated system update';
                    WorkItemComment::create([
                        'work_item_id' => $workItem->id,
                        'user_id' => 'automation_bot',
                        'author_name' => 'BufferMate Jira Automation',
                        'content' => $commentText,
                    ]);
                    $logs[] = "Added automated comment: {$commentText}";
                    break;
            }
        }

        // Increment rule execution counter
        $rule->increment('execution_count');
        $rule->update(['last_executed_at' => now()]);

        // Record execution in audit table
        JiraAutomationExecution::create([
            'rule_id' => $rule->id,
            'trigger_payload' => [
                'work_item_id' => $workItem->id,
                'work_item_key' => $workItem->key,
                'extra' => $extraContext,
            ],
            'status' => 'success',
            'execution_log' => implode(' | ', $logs),
            'executed_at' => now(),
        ]);

        return [
            'rule_id' => $rule->id,
            'status' => 'success',
            'logs' => $logs,
        ];
    }
}

