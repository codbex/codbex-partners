import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

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

    @Documentation('Name')
    @Column({
        name: 'SUPPLIER_NAME',
        type: 'string',
        length: 100,
    })
    public Name!: string;

    @Documentation('Address')
    @Column({
        name: 'SUPPLIER_ADDRESS',
        type: 'string',
        length: 200,
    })
    public Address!: string;

    @Documentation('PostalCode')
    @Column({
        name: 'SUPPLIER_POSTALCODE',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public PostalCode?: string;

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
        length: 20,
        nullable: true,
    })
    public Phone?: string;

    @Documentation('Fax')
    @Column({
        name: 'SUPPLIER_FAX',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Fax?: string;

    @Documentation('Country')
    @Column({
        name: 'SUPPLIER_COUNTRY',
        type: 'integer',
    })
    public Country!: number;

    @Documentation('City')
    @Column({
        name: 'SUPPLIER_CITY',
        type: 'integer',
    })
    public City!: number;

    @Documentation('TIN')
    @Column({
        name: 'SUPPLIER_TIN',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public TIN?: string;

    @Documentation('IBAN')
    @Column({
        name: 'SUPPLIER_IBAN',
        type: 'string',
        length: 36,
        nullable: true,
    })
    public IBAN?: string;

}

(new SupplierEntity());
