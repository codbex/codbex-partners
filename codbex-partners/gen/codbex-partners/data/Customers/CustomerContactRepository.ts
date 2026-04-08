import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CustomerContactEntity } from './CustomerContactEntity'

@Component('CustomerContactRepository')
export class CustomerContactRepository extends Repository<CustomerContactEntity> {

    constructor() {
        super((CustomerContactEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): CustomerContactEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): CustomerContactEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        });
        return entities;
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
