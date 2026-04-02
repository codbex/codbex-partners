import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('CustomerEntity')
@Table('CODBEX_CUSTOMER')
@Documentation('Customer entity mapping')
export class CustomerEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'CUSTOMER_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('FirstName')
    @Column({
        name: 'CUSTOMER_FIRSTNAME',
        type: 'string',
        length: 50,
        nullable: true,
    })
    public FirstName?: string;

    @Documentation('LastName')
    @Column({
        name: 'CUSTOMER_LASTNAME',
        type: 'string',
        length: 50,
        nullable: true,
    })
    public LastName?: string;

    @Documentation('LegalEntityName')
    @Column({
        name: 'CUSTOMER_LEGALENTITYNAME',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public LegalEntityName?: string;

    @Documentation('Name')
    @Column({
        name: 'CUSTOMER_NAME',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public Name?: string;

    @Documentation('Email')
    @Column({
        name: 'CUSTOMER_EMAIL',
        type: 'string',
        length: 100,
    })
    public Email!: string;

    @Documentation('Phone')
    @Column({
        name: 'CUSTOMER_PHONE',
        type: 'string',
        length: 15,
    })
    public Phone!: string;

    @Documentation('Fax')
    @Column({
        name: 'CUSTOMER_FAX',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Fax?: string;

    @Documentation('Country')
    @Column({
        name: 'CUSTOMER_COUNTRY',
        type: 'integer',
    })
    public Country!: number;

    @Documentation('City')
    @Column({
        name: 'CUSTOMER_CITY',
        type: 'integer',
    })
    public City!: number;

    @Documentation('Address')
    @Column({
        name: 'CUSTOMER_ADDRESS',
        type: 'string',
        length: 255,
    })
    public Address!: string;

    @Documentation('PostalCode')
    @Column({
        name: 'CUSTOMER_POSTALCODE',
        type: 'string',
        length: 10,
    })
    public PostalCode!: string;

    @Documentation('TIN')
    @Column({
        name: 'CUSTOMER_TIN',
        type: 'string',
        length: 15,
    })
    public TIN!: string;

    @Documentation('IBAN')
    @Column({
        name: 'CUSTOMER_IBAN',
        type: 'string',
        length: 34,
    })
    public IBAN!: string;

    @Documentation('ResponsiblePerson')
    @Column({
        name: 'CUSTOMER_RESPONSIBLEPERSON',
        type: 'integer',
    })
    public ResponsiblePerson!: number;

    @Documentation('Identifier')
    @Column({
        name: 'CUSTOMER_IDENTIFIER',
        type: 'string',
        length: 36,
    })
    public Identifier!: string;

    @Documentation('CreatedAt')
    @Column({
        name: 'CUSTOMER_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

}

(new CustomerEntity());
