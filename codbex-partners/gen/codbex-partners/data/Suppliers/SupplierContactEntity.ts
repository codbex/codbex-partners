import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('SupplierContactEntity')
@Table('CODBEX_SUPPLIERCONTACT')
@Documentation('SupplierContact entity mapping')
export class SupplierContactEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'SUPPLIERCONTACT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Supplier')
    @Column({
        name: 'SUPPLIERCONTACT_SUPPLIER',
        type: 'integer',
        nullable: true,
    })
    public Supplier?: number;

    @Documentation('Name')
    @Column({
        name: 'SUPPLIERCONTACT_NAME',
        type: 'string',
        length: 255,
    })
    public Name!: string;

    @Documentation('Designation')
    @Column({
        name: 'SUPPLIERCONTACT_DESIGNATION',
        type: 'string',
        length: 255,
    })
    public Designation!: string;

    @Documentation('Email')
    @Column({
        name: 'SUPPLIERCONTACT_EMAIL',
        type: 'string',
        length: 100,
    })
    public Email!: string;

    @Documentation('Phone')
    @Column({
        name: 'SUPPLIERCONTACT_PHONE',
        type: 'string',
        length: 15,
    })
    public Phone!: string;

}

(new SupplierContactEntity());
