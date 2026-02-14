import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CustomerAddressTypeEntity } from './CustomerAddressTypeEntity'

@Component('CustomerAddressTypeRepository')
export class CustomerAddressTypeRepository extends Repository<CustomerAddressTypeEntity> {

    constructor() {
        super((CustomerAddressTypeEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<CustomerAddressTypeEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Settings-CustomerAddressType', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Settings-CustomerAddressType').send(JSON.stringify(data));
    }
}
