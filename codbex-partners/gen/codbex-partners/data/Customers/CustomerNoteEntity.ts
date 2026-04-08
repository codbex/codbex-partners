import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('CustomerNoteEntity')
@Table('CODBEX_CUSTOMERNOTE')
@Documentation('CustomerNote entity mapping')
export class CustomerNoteEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'CUSTOMERNOTE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Customer')
    @Column({
        name: 'CUSTOMERNOTE_CUSTOMER',
        type: 'integer',
        nullable: true,
    })
    public Customer?: number;

    @Documentation('Note')
    @Column({
        name: 'CUSTOMERNOTE_NOTE',
        type: 'string',
        length: 5000,
    })
    public Note!: string;

    @Documentation('CreatedAt')
    @Column({
        name: 'CUSTOMERNOTE_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'CUSTOMERNOTE_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'CUSTOMERNOTE_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'CUSTOMERNOTE_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new CustomerNoteEntity());
