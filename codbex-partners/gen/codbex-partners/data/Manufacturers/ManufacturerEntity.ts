import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

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

    @Documentation('Name')
    @Column({
        name: 'MANUFACTURER_NAME',
        type: 'string',
        length: 200,
    })
    public Name!: string;

    @Documentation('Country')
    @Column({
        name: 'MANUFACTURER_COUNTRY',
        type: 'integer',
    })
    public Country!: number;

    @Documentation('City')
    @Column({
        name: 'MANUFACTURER_CITY',
        type: 'integer',
    })
    public City!: number;

}

(new ManufacturerEntity());
