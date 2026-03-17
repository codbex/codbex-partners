import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SupplierEntity } from './SupplierEntity'

@Component('SupplierRepository')
export class SupplierRepository extends Repository<SupplierEntity> {

    constructor() {
        super((SupplierEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): SupplierEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): SupplierEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        });
        return entities;
    }

    public override create(entity: SupplierEntity): string | number {
        entity.Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        return super.create(entity);
    }

    public override upsert(entity: SupplierEntity): string | number {
        entity.Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        entity.Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<SupplierEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Suppliers-Supplier', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Suppliers-Supplier').send(JSON.stringify(data));
    }
}
