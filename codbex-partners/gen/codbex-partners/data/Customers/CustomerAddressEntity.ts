import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('CustomerAddressEntity')
@Table('CODBEX_CUSTOMERADDRESS')
@Documentation('CustomerAddress entity mapping')
export class CustomerAddressEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'CUSTOMERADDRESS_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Customer')
    @Column({
        name: 'CUSTOMERADDRESS_CUSTOMER',
        type: 'integer',
        nullable: true,
    })
    public Customer?: number;

    @Documentation('FirstName')
    @Column({
        name: 'CUSTOMERADDRESS_FIRSTNAME',
        type: 'string',
        length: 50,
    })
    public FirstName!: string;

    @Documentation('LastName')
    @Column({
        name: 'CUSTOMERADDRESS_LASTNAME',
        type: 'string',
        length: 50,
    })
    public LastName!: string;

    @Documentation('Email')
    @Column({
        name: 'CUSTOMERADDRESS_EMAIL',
        type: 'string',
        length: 100,
    })
    public Email!: string;

    @Documentation('Phone')
    @Column({
        name: 'CUSTOMERADDRESS_PHONE',
        type: 'string',
        length: 15,
    })
    public Phone!: string;

    @Documentation('Country')
    @Column({
        name: 'CUSTOMERADDRESS_COUNTRY',
        type: 'integer',
    })
    public Country!: number;

    @Documentation('City')
    @Column({
        name: 'CUSTOMERADDRESS_CITY',
        type: 'integer',
    })
    public City!: number;

    @Documentation('AddressLine1')
    @Column({
        name: 'CUSTOMERADDRESS_ADRESSLINE1',
        type: 'string',
        length: 500,
    })
    public AddressLine1!: string;

    @Documentation('AddressLine2')
    @Column({
        name: 'CUSTOMERADDRESS_ADDRESSLINE2',
        type: 'string',
        length: 500,
    })
    public AddressLine2!: string;

    @Documentation('PostalCode')
    @Column({
        name: 'CUSTOMERADDRESS_POSTALCODE',
        type: 'string',
        length: 10,
    })
    public PostalCode!: string;

    @Documentation('AddressType')
    @Column({
        name: 'CUSTOMERADDRESS_CUSTOMERADDRESSTYPE',
        type: 'integer',
    })
    public AddressType!: number;

    @Documentation('IsActive')
    @Column({
        name: 'CUSTOMERADDRESS_ISACTIVE',
        type: 'boolean',
    })
    public IsActive!: boolean;

}

(new CustomerAddressEntity());
