import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface ManifacturerEntity {
    readonly Id: number;
    Name: string;
    City: number;
    Country: number;
}

export interface ManifacturerCreateEntity {
    readonly Name: string;
    readonly City: number;
    readonly Country: number;
}

export interface ManifacturerUpdateEntity extends ManifacturerCreateEntity {
    readonly Id: number;
}

export interface ManifacturerEntityOptions {
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
    $select?: (keyof ManifacturerEntity)[],
    $sort?: string | (keyof ManifacturerEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface ManifacturerEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ManifacturerEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class ManifacturerRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_MANIFACTURER",
        properties: [
            {
                name: "Id",
                column: "MANIFACTURER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "MANIFACTURER_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "City",
                column: "MANIFACTURER_CITY",
                type: "INTEGER",
                required: true
            },
            {
                name: "Country",
                column: "MANIFACTURER_COUNTRY",
                type: "INTEGER",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(ManifacturerRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: ManifacturerEntityOptions): ManifacturerEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): ManifacturerEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ManifacturerCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_MANIFACTURER",
            entity: entity,
            key: {
                name: "Id",
                column: "MANIFACTURER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ManifacturerUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_MANIFACTURER",
            entity: entity,
            key: {
                name: "Id",
                column: "MANIFACTURER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ManifacturerCreateEntity | ManifacturerUpdateEntity): number {
        const id = (entity as ManifacturerUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ManifacturerUpdateEntity);
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
            table: "CODBEX_MANIFACTURER",
            entity: entity,
            key: {
                name: "Id",
                column: "MANIFACTURER_ID",
                value: id
            }
        });
    }

    public count(options?: ManifacturerEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_MANIFACTURER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ManifacturerEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners-Manufacturers-Manifacturer", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-partners-Manufacturers-Manifacturer").send(JSON.stringify(data));
    }
}
