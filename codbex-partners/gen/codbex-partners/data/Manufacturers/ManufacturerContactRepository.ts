import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { ManufacturerContactEntity } from './ManufacturerContactEntity'

@Component('ManufacturerContactRepository')
export class ManufacturerContactRepository extends Repository<ManufacturerContactEntity> {

    constructor() {
        super((ManufacturerContactEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): ManufacturerContactEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): ManufacturerContactEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
        });
        return entities;
    }

    protected override async triggerEvent(data: EntityEvent<ManufacturerContactEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Manufacturers-ManufacturerContact', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Manufacturers-ManufacturerContact').send(JSON.stringify(data));
    }
}
