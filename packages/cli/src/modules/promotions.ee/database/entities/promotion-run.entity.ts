import type { PromotionDirection } from '@n8n/api-types';
import { generateNanoId, User, WithCreatedAt } from '@n8n/db';
import {
	BeforeInsert,
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	type Relation,
} from '@n8n/typeorm';

import { PromotionConnection } from './promotion-connection.entity';

/**
 * One Promote or Apply. The row holds what n8n did: who ran it, which
 * connection, which direction, and which commit. A host review, when one was
 * opened, lives on `promotion_review`.
 */
@Entity('promotion_run')
export class PromotionRun extends WithCreatedAt {
	@PrimaryColumn({ type: 'varchar', length: 36 })
	id: string;

	@BeforeInsert()
	generateId() {
		if (!this.id) this.id = generateNanoId();
	}

	@Index()
	@Column({ type: 'varchar', length: 36, nullable: true })
	connectionId: string | null;

	@Column({ type: 'uuid', nullable: true })
	createdById: string | null;

	/** Copied from the config at run time. A later config edit does not change it. */
	@Column({ type: 'varchar', length: 16 })
	direction: PromotionDirection;

	@Column({ type: 'varchar', length: 255 })
	branchName: string;

	/** The commit n8n pushed or applied. */
	@Column({ type: 'varchar', length: 64 })
	commitSha: string;

	@ManyToOne(() => PromotionConnection, { onDelete: 'SET NULL', nullable: true })
	@JoinColumn({ name: 'connectionId' })
	connection: Relation<PromotionConnection> | null;

	@ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
	@JoinColumn({ name: 'createdById' })
	createdBy: Relation<User> | null;
}
