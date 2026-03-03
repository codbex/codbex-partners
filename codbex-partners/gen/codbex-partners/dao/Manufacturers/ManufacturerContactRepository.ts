import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";

export interface ManufacturerContactEntity {
    readonly Id: number;
    Manufacturer?: number;
    Name: string;
    Designation: string;
    Email: string;
    Phone: string;
}

export interface ManufacturerContactCreateEntity {
    readonly Manufacturer?: number;
    readonly Name: string;
    readonly Designation: string;
    readonly Email: string;
    readonly Phone: string;
}

export interface ManufacturerContactUpdateEntity extends ManufacturerContactCreateEntity {
    readonly Id: number;
}

export interface ManufacturerContactEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Manufacturer?: number | number[];
            Name?: string | string[];
            Designation?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Manufacturer?: number | number[];
            Name?: string | string[];
            Designation?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
        };
        contains?: {
            Id?: number;
            Manufacturer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        greaterThan?: {
            Id?: number;
            Manufacturer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Manufacturer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        lessThan?: {
            Id?: number;
            Manufacturer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Manufacturer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
    },
    $select?: (keyof ManufacturerContactEntity)[],
    $sort?: string | (keyof ManufacturerContactEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface ManufacturerContactEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ManufacturerContactEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface ManufacturerContactUpdateEntityEvent extends ManufacturerContactEntityEvent {
    readonly previousEntity: ManufacturerContactEntity;
}

export class ManufacturerContactRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_MANUFACTURERCONTACT",
        properties: [
            {
                name: "Id",
                column: "MANUFACTURERCONTACT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Manufacturer",
                column: "MANUFACTURERCONTACT_MANUFACTURER",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "MANUFACTURERCONTACT_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Designation",
                column: "MANUFACTURERCONTACT_DESIGNATION",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Email",
                column: "MANUFACTURERCONTACT_EMAIL",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Phone",
                column: "MANUFACTURERCONTACT_PHONE",
                type: "VARCHAR",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(ManufacturerContactRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: ManufacturerContactEntityOptions = {}): ManufacturerContactEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: ManufacturerContactEntityOptions = {}): ManufacturerContactEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ManufacturerContactCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_MANUFACTURERCONTACT",
            entity: entity,
            key: {
                name: "Id",
                column: "MANUFACTURERCONTACT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ManufacturerContactUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_MANUFACTURERCONTACT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "MANUFACTURERCONTACT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ManufacturerContactCreateEntity | ManufacturerContactUpdateEntity): number {
        const id = (entity as ManufacturerContactUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ManufacturerContactUpdateEntity);
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
            table: "CODBEX_MANUFACTURERCONTACT",
            entity: entity,
            key: {
                name: "Id",
                column: "MANUFACTURERCONTACT_ID",
                value: id
            }
        });
    }

    public count(options?: ManufacturerContactEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_MANUFACTURERCONTACT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ManufacturerContactEntityEvent | ManufacturerContactUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners-Manufacturers-ManufacturerContact", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-partners-Manufacturers-ManufacturerContact").send(JSON.stringify(data));
    }
}
