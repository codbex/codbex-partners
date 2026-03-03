import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";

export interface SupplierEntity {
    readonly Id: number;
    FirstName: string;
    LastName: string;
    Name?: string;
    Email: string;
    Phone: string;
    Fax: string;
    TIN: string;
    IBAN: string;
    CreatedAt?: Date;
}

export interface SupplierCreateEntity {
    readonly FirstName: string;
    readonly LastName: string;
    readonly Email: string;
    readonly Phone: string;
    readonly Fax: string;
    readonly TIN: string;
    readonly IBAN: string;
    readonly CreatedAt?: Date;
}

export interface SupplierUpdateEntity extends SupplierCreateEntity {
    readonly Id: number;
}

export interface SupplierEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            FirstName?: string | string[];
            LastName?: string | string[];
            Name?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
            Fax?: string | string[];
            TIN?: string | string[];
            IBAN?: string | string[];
            CreatedAt?: Date | Date[];
        };
        notEquals?: {
            Id?: number | number[];
            FirstName?: string | string[];
            LastName?: string | string[];
            Name?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
            Fax?: string | string[];
            TIN?: string | string[];
            IBAN?: string | string[];
            CreatedAt?: Date | Date[];
        };
        contains?: {
            Id?: number;
            FirstName?: string;
            LastName?: string;
            Name?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            TIN?: string;
            IBAN?: string;
            CreatedAt?: Date;
        };
        greaterThan?: {
            Id?: number;
            FirstName?: string;
            LastName?: string;
            Name?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            TIN?: string;
            IBAN?: string;
            CreatedAt?: Date;
        };
        greaterThanOrEqual?: {
            Id?: number;
            FirstName?: string;
            LastName?: string;
            Name?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            TIN?: string;
            IBAN?: string;
            CreatedAt?: Date;
        };
        lessThan?: {
            Id?: number;
            FirstName?: string;
            LastName?: string;
            Name?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            TIN?: string;
            IBAN?: string;
            CreatedAt?: Date;
        };
        lessThanOrEqual?: {
            Id?: number;
            FirstName?: string;
            LastName?: string;
            Name?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            TIN?: string;
            IBAN?: string;
            CreatedAt?: Date;
        };
    },
    $select?: (keyof SupplierEntity)[],
    $sort?: string | (keyof SupplierEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface SupplierEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SupplierEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface SupplierUpdateEntityEvent extends SupplierEntityEvent {
    readonly previousEntity: SupplierEntity;
}

export class SupplierRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SUPPLIER",
        properties: [
            {
                name: "Id",
                column: "SUPPLIER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "FirstName",
                column: "SUPPLIER_FIRSTNAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "LastName",
                column: "SUPPLIER_LASTNAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Name",
                column: "SUPPLIER_NAME",
                type: "VARCHAR",
            },
            {
                name: "Email",
                column: "SUPPLIER_EMAIL",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Phone",
                column: "SUPPLIER_PHONE",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Fax",
                column: "SUPPLIER_FAX",
                type: "VARCHAR",
                required: true
            },
            {
                name: "TIN",
                column: "SUPPLIER_TIN",
                type: "VARCHAR",
                required: true
            },
            {
                name: "IBAN",
                column: "SUPPLIER_IBAN",
                type: "VARCHAR",
                required: true
            },
            {
                name: "CreatedAt",
                column: "SUPPLIER_CREATEDAT",
                type: "TIMESTAMP",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SupplierRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: SupplierEntityOptions = {}): SupplierEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: SupplierEntityOptions = {}): SupplierEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SupplierCreateEntity): number {
        // @ts-ignore
        (entity as SupplierEntity).Name = entity["FirstName"] + " " + entity["LastName"];
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SUPPLIER",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SupplierUpdateEntity): void {
        // @ts-ignore
        (entity as SupplierEntity).Name = entity["FirstName"] + " " + entity["LastName"];
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SUPPLIER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "SUPPLIER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SupplierCreateEntity | SupplierUpdateEntity): number {
        const id = (entity as SupplierUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SupplierUpdateEntity);
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
            table: "CODBEX_SUPPLIER",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIER_ID",
                value: id
            }
        });
    }

    public count(options?: SupplierEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__SUPPLIER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SupplierEntityEvent | SupplierUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners-Suppliers-Supplier", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-partners-Suppliers-Supplier").send(JSON.stringify(data));
    }
}
