import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface CustomerAddressTypeEntity {
    readonly Id: number;
    Name?: string;
}

export interface CustomerAddressTypeCreateEntity {
    readonly Name?: string;
}

export interface CustomerAddressTypeUpdateEntity extends CustomerAddressTypeCreateEntity {
    readonly Id: number;
}

export interface CustomerAddressTypeEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof CustomerAddressTypeEntity)[],
    $sort?: string | (keyof CustomerAddressTypeEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface CustomerAddressTypeEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CustomerAddressTypeEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface CustomerAddressTypeUpdateEntityEvent extends CustomerAddressTypeEntityEvent {
    readonly previousEntity: CustomerAddressTypeEntity;
}

export class CustomerAddressTypeRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CUSTOMERADDRESSTYPE",
        properties: [
            {
                name: "Id",
                column: "CUSTOMERADDRESSTYPE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "CUSTOMERADDRESSTYPE_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CustomerAddressTypeRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: CustomerAddressTypeEntityOptions = {}): CustomerAddressTypeEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): CustomerAddressTypeEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: CustomerAddressTypeCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CUSTOMERADDRESSTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERADDRESSTYPE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CustomerAddressTypeUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CUSTOMERADDRESSTYPE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "CUSTOMERADDRESSTYPE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CustomerAddressTypeCreateEntity | CustomerAddressTypeUpdateEntity): number {
        const id = (entity as CustomerAddressTypeUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CustomerAddressTypeUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_CUSTOMERADDRESSTYPE",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERADDRESSTYPE_ID",
                value: id
            }
        });
    }

    public count(options?: CustomerAddressTypeEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CUSTOMERADDRESSTYPE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CustomerAddressTypeEntityEvent | CustomerAddressTypeUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners-entities-CustomerAddressType", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-partners-entities-CustomerAddressType").send(JSON.stringify(data));
    }
}
