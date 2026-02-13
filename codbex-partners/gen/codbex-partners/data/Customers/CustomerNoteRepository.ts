import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CustomerNoteEntity } from './CustomerNoteEntity'

@Component('CustomerNoteRepository')
export class CustomerNoteRepository extends Repository<CustomerNoteEntity> {

    constructor() {
        super((CustomerNoteEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<CustomerNoteEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-partners-Customers-CustomerNote', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-partners-Customers-CustomerNote').send(JSON.stringify(data));
    }
}
