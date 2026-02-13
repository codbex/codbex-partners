import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { SupplierEntity } from './SupplierEntity'

@Component('SupplierRepository')
export class SupplierRepository extends Repository<SupplierEntity> {

    constructor() {
        super((SupplierEntity as EntityConstructor));
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
