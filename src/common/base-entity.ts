import { PrimaryGeneratedColumn , CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
export class BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({type: 'timestamp', update: false })
    CreatedAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    UpdatedAt: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    DeletedAt: Date;
}