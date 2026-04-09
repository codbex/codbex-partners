import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('ManufacturerNoteEntity')
@Table('CODBEX_MANUFACTURERNOTE')
@Documentation('ManufacturerNote entity mapping')
export class ManufacturerNoteEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'MANUFACTURERNOTE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Manufacturer')
    @Column({
        name: 'MANUFACTURERNOTE_MANUFACTURER',
        type: 'integer',
        nullable: true,
    })
    public Manufacturer?: number;

    @Documentation('Note')
    @Column({
        name: 'MANUFACTURERNOTE_NOTE',
        type: 'string',
        length: 5000,
    })
    public Note!: string;

    @Documentation('CreatedAt')
    @Column({
        name: 'MANUFACTURERNOTE_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'MANUFACTURERNOTE_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'MANUFACTURERNOTE_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'MANUFACTURERNOTE_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new ManufacturerNoteEntity());
