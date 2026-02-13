import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('CustomerContactEntity')
@Table('CODBEX_CUSTOMERCONTACT')
@Documentation('CustomerContact entity mapping')
export class CustomerContactEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'CUSTOMERCONTACT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Customer')
    @Column({
        name: 'CUSTOMERCONTACT_CUSTOMER',
        type: 'integer',
        nullable: true,
    })
    public Customer?: number;

    @Documentation('Name')
    @Column({
        name: 'CUSTOMERCONTACT_NAME',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public Name?: string;

    @Documentation('Designation')
    @Column({
        name: 'CUSTOMERCONTACT_DESIGNATION',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public Designation?: string;

    @Documentation('Email')
    @Column({
        name: 'CUSTOMERCONTACT_EMAIL',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public Email?: string;

    @Documentation('Phone')
    @Column({
        name: 'CUSTOMERCONTACT_PHONE',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public Phone?: string;

}

(new CustomerContactEntity());
