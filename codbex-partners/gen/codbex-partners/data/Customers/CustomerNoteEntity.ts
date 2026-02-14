import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

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
        nullable: true,
    })
    public Note?: string;

}

(new CustomerNoteEntity());
