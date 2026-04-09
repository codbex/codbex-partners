import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('SupplierEntity')
@Table('CODBEX_SUPPLIER')
@Documentation('Supplier entity mapping')
export class SupplierEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'SUPPLIER_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('FirstName')
    @Column({
        name: 'SUPPLIER_FIRSTNAME',
        type: 'string',
        length: 50,
        nullable: true,
    })
    public FirstName?: string;

    @Documentation('LastName')
    @Column({
        name: 'SUPPLIER_LASTNAME',
        type: 'string',
        length: 50,
        nullable: true,
    })
    public LastName?: string;

    @Documentation('LegalEntityName')
    @Column({
        name: 'SUPPLIER_LEGALENTITYNAME',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public LegalEntityName?: string;

    @Documentation('Name')
    @Column({
        name: 'SUPPLIER_NAME',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public Name?: string;

    @Documentation('Email')
    @Column({
        name: 'SUPPLIER_EMAIL',
        type: 'string',
        length: 100,
    })
    public Email!: string;

    @Documentation('Phone')
    @Column({
        name: 'SUPPLIER_PHONE',
        type: 'string',
        length: 15,
    })
    public Phone!: string;

    @Documentation('Fax')
    @Column({
        name: 'SUPPLIER_FAX',
        type: 'string',
        length: 20,
    })
    public Fax!: string;

    @Documentation('TIN')
    @Column({
        name: 'SUPPLIER_TIN',
        type: 'string',
        length: 15,
    })
    public TIN!: string;

    @Documentation('IBAN')
    @Column({
        name: 'SUPPLIER_IBAN',
        type: 'string',
        length: 34,
    })
    public IBAN!: string;

    @Documentation('CreatedAt')
    @Column({
        name: 'SUPPLIER_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'SUPPLIER_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'SUPPLIER_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'SUPPLIER_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new SupplierEntity());
