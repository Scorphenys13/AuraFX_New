import type { AgentConfigValidationIssue, NodeTypeAvailabilityScope } from '@n8n/api-types';

const RESTRICTION_SCOPES: Record<string, NodeTypeAvailabilityScope> = {
	restricted_by_instance: 'instance',
	restricted_by_project: 'project',
};

/** A policy denies the node type this capability runs as, so it cannot publish or preview. */
export function isRestrictedIssue(issue: AgentConfigValidationIssue): boolean {
	return issue.code === 'restricted_node_type';
}

/** The level that denied the type, for the restriction popover. Absent when the policy names none. */
export function restrictionScope(
	issue: AgentConfigValidationIssue,
): NodeTypeAvailabilityScope | undefined {
	return issue.reason ? RESTRICTION_SCOPES[issue.reason] : undefined;
}

/**
 * A warning blocks publishing but not the draft preview: the workflow tool is
 * compatible, its workflow just has no published version yet.
 */
export function isWarningIssue(issue: AgentConfigValidationIssue): boolean {
	return issue.code === 'incompatible_reference' && issue.reason === 'not_published';
}

/** Warning-only issues are resolved by the publish flow itself, so only the rest block it. */
export function hasBlockingIssues(issues: AgentConfigValidationIssue[]): boolean {
	return issues.some((issue) => !isWarningIssue(issue));
}
