import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { ManufacturerNoteEntity } from './ManufacturerNoteEntity'

@Component('ManufacturerNoteRepository')
export class ManufacturerNoteRepository extends Repository<ManufacturerNoteEntity> {

    constructor() {
        super((ManufacturerNoteEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<ManufacturerNoteEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Manufacturers-ManufacturerNote', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Manufacturers-ManufacturerNote').send(JSON.stringify(data));
    }
}
