import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('ManufacturerEntity')
@Table('CODBEX_MANUFACTURER')
@Documentation('Manufacturer entity mapping')
export class ManufacturerEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'MANUFACTURER_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('FirstName')
    @Column({
        name: 'MANUFACTURER_FIRSTNAME',
        type: 'string',
        length: 50,
        nullable: true,
    })
    public FirstName?: string;

    @Documentation('LastName')
    @Column({
        name: 'MANUFACTURER_LASTNAME',
        type: 'string',
        length: 50,
        nullable: true,
    })
    public LastName?: string;

    @Documentation('LegalEntityName')
    @Column({
        name: 'MANUFACTURER_LEGALENTITYNAME',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public LegalEntityName?: string;

    @Documentation('Name')
    @Column({
        name: 'MANUFACTURER_NAME',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public Name?: string;

    @Documentation('Email')
    @Column({
        name: 'MANUFACTURER_EMAIL',
        type: 'string',
        length: 100,
    })
    public Email!: string;

    @Documentation('Phone')
    @Column({
        name: 'MANUFACTURER_PHONE',
        type: 'string',
        length: 15,
    })
    public Phone!: string;

    @Documentation('Fax')
    @Column({
        name: 'MANUFACTURER_FAX',
        type: 'string',
        length: 20,
    })
    public Fax!: string;

    @Documentation('TIN')
    @Column({
        name: 'MANUFACTURER_TIN',
        type: 'string',
        length: 15,
    })
    public TIN!: string;

    @Documentation('IBAN')
    @Column({
        name: 'MANUFACTURER_IBAN',
        type: 'string',
        length: 34,
    })
    public IBAN!: string;

    @Documentation('CreatedAt')
    @Column({
        name: 'MANUFACTURER_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

}

(new ManufacturerEntity());
