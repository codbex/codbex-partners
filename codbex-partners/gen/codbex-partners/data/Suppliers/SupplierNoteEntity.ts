import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('SupplierNoteEntity')
@Table('CODBEX_SUPPLIERNOTE')
@Documentation('SupplierNote entity mapping')
export class SupplierNoteEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'SUPPLIERNOTE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Supplier')
    @Column({
        name: 'SUPPLIERNOTE_SUPPLIER',
        type: 'integer',
        nullable: true,
    })
    public Supplier?: number;

    @Documentation('Note')
    @Column({
        name: 'SUPPLIERNOTE_NOTE',
        type: 'string',
        length: 5000,
    })
    public Note!: string;

}

(new SupplierNoteEntity());
