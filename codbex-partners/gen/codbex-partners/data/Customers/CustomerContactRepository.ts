import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CustomerContactEntity } from './CustomerContactEntity'

@Component('CustomerContactRepository')
export class CustomerContactRepository extends Repository<CustomerContactEntity> {

    constructor() {
        super((CustomerContactEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<CustomerContactEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Customers-CustomerContact', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Customers-CustomerContact').send(JSON.stringify(data));
    }
}
