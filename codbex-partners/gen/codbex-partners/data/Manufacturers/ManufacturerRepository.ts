import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { ManufacturerEntity } from './ManufacturerEntity'

@Component('ManufacturerRepository')
export class ManufacturerRepository extends Repository<ManufacturerEntity> {

    constructor() {
        super((ManufacturerEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<ManufacturerEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Manufacturers-Manufacturer', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Manufacturers-Manufacturer').send(JSON.stringify(data));
    }
}
