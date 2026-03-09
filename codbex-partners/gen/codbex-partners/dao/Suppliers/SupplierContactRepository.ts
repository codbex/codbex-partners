import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";

export interface SupplierContactEntity {
    readonly Id: number;
    Supplier?: number;
    Name: string;
    Designation: string;
    Email: string;
    Phone: string;
}

export interface SupplierContactCreateEntity {
    readonly Supplier?: number;
    readonly Name: string;
    readonly Designation: string;
    readonly Email: string;
    readonly Phone: string;
}

export interface SupplierContactUpdateEntity extends SupplierContactCreateEntity {
    readonly Id: number;
}

export interface SupplierContactEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Supplier?: number | number[];
            Name?: string | string[];
            Designation?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Supplier?: number | number[];
            Name?: string | string[];
            Designation?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
        };
        contains?: {
            Id?: number;
            Supplier?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        greaterThan?: {
            Id?: number;
            Supplier?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Supplier?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        lessThan?: {
            Id?: number;
            Supplier?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Supplier?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
    },
    $select?: (keyof SupplierContactEntity)[],
    $sort?: string | (keyof SupplierContactEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface SupplierContactEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SupplierContactEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface SupplierContactUpdateEntityEvent extends SupplierContactEntityEvent {
    readonly previousEntity: SupplierContactEntity;
}

export class SupplierContactRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SUPPLIERCONTACT",
        properties: [
            {
                name: "Id",
                column: "SUPPLIERCONTACT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Supplier",
                column: "SUPPLIERCONTACT_SUPPLIER",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "SUPPLIERCONTACT_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Designation",
                column: "SUPPLIERCONTACT_DESIGNATION",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Email",
                column: "SUPPLIERCONTACT_EMAIL",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Phone",
                column: "SUPPLIERCONTACT_PHONE",
                type: "VARCHAR",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SupplierContactRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: SupplierContactEntityOptions = {}): SupplierContactEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: SupplierContactEntityOptions = {}): SupplierContactEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SupplierContactCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SUPPLIERCONTACT",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERCONTACT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SupplierContactUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SUPPLIERCONTACT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "SUPPLIERCONTACT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SupplierContactCreateEntity | SupplierContactUpdateEntity): number {
        const id = (entity as SupplierContactUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SupplierContactUpdateEntity);
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
            table: "CODBEX_SUPPLIERCONTACT",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERCONTACT_ID",
                value: id
            }
        });
    }

    public count(options?: SupplierContactEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SUPPLIERCONTACT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SupplierContactEntityEvent | SupplierContactUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners-Suppliers-SupplierContact", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-partners-Suppliers-SupplierContact").send(JSON.stringify(data));
    }
}
