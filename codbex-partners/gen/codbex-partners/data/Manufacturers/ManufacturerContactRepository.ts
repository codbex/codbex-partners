import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { ManufacturerContactEntity } from './ManufacturerContactEntity'

@Component('ManufacturerContactRepository')
export class ManufacturerContactRepository extends Repository<ManufacturerContactEntity> {

    constructor() {
        super((ManufacturerContactEntity as EntityConstructor));
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
