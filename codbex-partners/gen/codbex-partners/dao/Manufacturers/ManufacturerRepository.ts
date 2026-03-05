import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";

export interface ManufacturerEntity {
    readonly Id: number;
    FirstName?: string;
    LastName?: string;
    LegalEntityName?: string;
    Name?: string;
    Email: string;
    Phone: string;
    Fax: string;
    TIN: string;
    IBAN: string;
    CreatedAt?: Date;
}

export interface ManufacturerCreateEntity {
    readonly FirstName?: string;
    readonly LastName?: string;
    readonly LegalEntityName?: string;
    readonly Email: string;
    readonly Phone: string;
    readonly Fax: string;
    readonly TIN: string;
    readonly IBAN: string;
    readonly CreatedAt?: Date;
}

export interface ManufacturerUpdateEntity extends ManufacturerCreateEntity {
    readonly Id: number;
}

export interface ManufacturerEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            FirstName?: string | string[];
            LastName?: string | string[];
            LegalEntityName?: string | string[];
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
            LegalEntityName?: string | string[];
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
            LegalEntityName?: string;
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
            LegalEntityName?: string;
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
            LegalEntityName?: string;
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
            LegalEntityName?: string;
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
            LegalEntityName?: string;
            Name?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            TIN?: string;
            IBAN?: string;
            CreatedAt?: Date;
        };
    },
    $select?: (keyof ManufacturerEntity)[],
    $sort?: string | (keyof ManufacturerEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface ManufacturerEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ManufacturerEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface ManufacturerUpdateEntityEvent extends ManufacturerEntityEvent {
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
                name: "FirstName",
                column: "MANUFACTURER_FIRSTNAME",
                type: "VARCHAR",
            },
            {
                name: "LastName",
                column: "MANUFACTURER_LASTNAME",
                type: "VARCHAR",
            },
            {
                name: "LegalEntityName",
                column: "MANUFACTURER_LEGALENTITYNAME",
                type: "VARCHAR",
            },
            {
                name: "Name",
                column: "MANUFACTURER_NAME",
                type: "VARCHAR",
            },
            {
                name: "Email",
                column: "MANUFACTURER_EMAIL",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Phone",
                column: "MANUFACTURER_PHONE",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Fax",
                column: "MANUFACTURER_FAX",
                type: "VARCHAR",
                required: true
            },
            {
                name: "TIN",
                column: "MANUFACTURER_TIN",
                type: "VARCHAR",
                required: true
            },
            {
                name: "IBAN",
                column: "MANUFACTURER_IBAN",
                type: "VARCHAR",
                required: true
            },
            {
                name: "CreatedAt",
                column: "MANUFACTURER_CREATEDAT",
                type: "TIMESTAMP",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(ManufacturerRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: ManufacturerEntityOptions = {}): ManufacturerEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: ManufacturerEntityOptions = {}): ManufacturerEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ManufacturerCreateEntity): number {
        // @ts-ignore
        (entity as ManufacturerEntity).Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
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
        // @ts-ignore
        (entity as ManufacturerEntity).Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
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
