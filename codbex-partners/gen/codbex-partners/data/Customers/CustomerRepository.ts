import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CustomerEntity } from './CustomerEntity'

@Component('CustomerRepository')
export class CustomerRepository extends Repository<CustomerEntity> {

    constructor() {
        super((CustomerEntity as EntityConstructor));
    }

    public override create(entity: CustomerEntity): string | number {
        entity.Name = entity["FirstName"] + " " + entity["LastName"];
        entity.CreatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        return super.create(entity);
    }

    public override upsert(entity: CustomerEntity): string | number {
        entity.Name = entity["FirstName"] + " " + entity["LastName"];
        entity.CreatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        entity.Name = entity["FirstName"] + " " + entity["LastName"];
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<CustomerEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Customers-Customer', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Customers-Customer').send(JSON.stringify(data));
    }
}
