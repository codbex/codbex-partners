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

}

(new ManufacturerNoteEntity());
