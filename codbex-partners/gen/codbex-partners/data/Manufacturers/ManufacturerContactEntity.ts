import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('ManufacturerContactEntity')
@Table('CODBEX_MANUFACTURERCONTACT')
@Documentation('ManufacturerContact entity mapping')
export class ManufacturerContactEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'MANUFACTURERCONTACT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Manufacturer')
    @Column({
        name: 'MANUFACTURERCONTACT_MANUFACTURER',
        type: 'integer',
        nullable: true,
    })
    public Manufacturer?: number;

    @Documentation('Name')
    @Column({
        name: 'MANUFACTURERCONTACT_NAME',
        type: 'string',
        length: 255,
    })
    public Name!: string;

    @Documentation('Designation')
    @Column({
        name: 'MANUFACTURERCONTACT_DESIGNATION',
        type: 'string',
        length: 255,
    })
    public Designation!: string;

    @Documentation('Email')
    @Column({
        name: 'MANUFACTURERCONTACT_EMAIL',
        type: 'string',
        length: 100,
    })
    public Email!: string;

    @Documentation('Phone')
    @Column({
        name: 'MANUFACTURERCONTACT_PHONE',
        type: 'string',
        length: 15,
    })
    public Phone!: string;

}

(new ManufacturerContactEntity());
