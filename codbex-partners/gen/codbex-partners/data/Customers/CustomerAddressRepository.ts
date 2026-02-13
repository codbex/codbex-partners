import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CustomerAddressEntity } from './CustomerAddressEntity'

@Component('CustomerAddressRepository')
export class CustomerAddressRepository extends Repository<CustomerAddressEntity> {

    constructor() {
        super((CustomerAddressEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<CustomerAddressEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Customers-CustomerAddress', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Customers-CustomerAddress').send(JSON.stringify(data));
    }
}
