import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface ManufacturerEntity {
    readonly Id: number;
    Name: string;
    City: number;
    Country?: number;
}

export interface ManufacturerCreateEntity {
    readonly Name: string;
    readonly City: number;
    readonly Country?: number;
}

export interface ManufacturerUpdateEntity extends ManufacturerCreateEntity {
    readonly Id: number;
}

export interface ManufacturerEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            City?: number | number[];
            Country?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            City?: number | number[];
            Country?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            City?: number;
            Country?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            City?: number;
            Country?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            City?: number;
            Country?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            City?: number;
            Country?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            City?: number;
            Country?: number;
        };
    },
    $select?: (keyof ManufacturerEntity)[],
    $sort?: string | (keyof ManufacturerEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface ManufacturerEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ManufacturerEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface ManufacturerUpdateEntityEvent extends ManufacturerEntityEvent {
    readonly previousEntity: ManufacturerEntity;
}

export class ManufacturerRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_MANUFACTURER",
        properties: [
            {
                name: "Id",
                column: "MANUFACTURER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "MANUFACTURER_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "City",
                column: "MANUFACTURER_CITY",
                type: "INTEGER",
                required: true
            },
            {
                name: "Country",
                column: "MANUFACTURER_COUNTRY",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(ManufacturerRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: ManufacturerEntityOptions): ManufacturerEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): ManufacturerEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ManufacturerCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_MANUFACTURER",
            entity: entity,
            key: {
                name: "Id",
                column: "MANUFACTURER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ManufacturerUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_MANUFACTURER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "MANUFACTURER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ManufacturerCreateEntity | ManufacturerUpdateEntity): number {
        const id = (entity as ManufacturerUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ManufacturerUpdateEntity);
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
            table: "CODBEX_MANUFACTURER",
            entity: entity,
            key: {
                name: "Id",
                column: "MANUFACTURER_ID",
                value: id
            }
        });
    }

    public count(options?: ManufacturerEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_MANUFACTURER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ManufacturerEntityEvent | ManufacturerUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners-Manufacturers-Manufacturer", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-partners-Manufacturers-Manufacturer").send(JSON.stringify(data));
    }
}
