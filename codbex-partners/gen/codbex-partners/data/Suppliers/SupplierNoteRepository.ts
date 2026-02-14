import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SupplierNoteEntity } from './SupplierNoteEntity'

@Component('SupplierNoteRepository')
export class SupplierNoteRepository extends Repository<SupplierNoteEntity> {

    constructor() {
        super((SupplierNoteEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<SupplierNoteEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Suppliers-SupplierNote', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Suppliers-SupplierNote').send(JSON.stringify(data));
    }
}
