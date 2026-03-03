import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('CustomerAddressTypeEntity')
@Table('CODBEX_CUSTOMERADDRESSTYPE')
@Documentation('CustomerAddressType entity mapping')
export class CustomerAddressTypeEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'CUSTOMERADDRESSTYPE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'CUSTOMERADDRESSTYPE_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name!: string;

}

(new CustomerAddressTypeEntity());
