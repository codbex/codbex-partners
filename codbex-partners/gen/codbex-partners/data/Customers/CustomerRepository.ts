import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CustomerEntity } from './CustomerEntity'

@Component('CustomerRepository')
export class CustomerRepository extends Repository<CustomerEntity> {

    constructor() {
        super((CustomerEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): CustomerEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): CustomerEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        });
        return entities;
    }

    public override create(entity: CustomerEntity): string | number {
        entity.Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        return super.create(entity);
    }

    public override upsert(entity: CustomerEntity): string | number {
        entity.Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        entity.Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
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
