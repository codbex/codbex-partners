import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SupplierContactEntity } from './SupplierContactEntity'

@Component('SupplierContactRepository')
export class SupplierContactRepository extends Repository<SupplierContactEntity> {

    constructor() {
        super((SupplierContactEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): SupplierContactEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): SupplierContactEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        });
        return entities;
    }

    protected override async triggerEvent(data: EntityEvent<SupplierContactEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Suppliers-SupplierContact', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Suppliers-SupplierContact').send(JSON.stringify(data));
    }
}
