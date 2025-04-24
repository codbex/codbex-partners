import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface CustomerContactEntity {
    readonly Id: number;
    Customer?: number;
    Name?: string;
    Designation?: string;
    Email?: string;
    Phone?: string;
}

export interface CustomerContactCreateEntity {
    readonly Customer?: number;
    readonly Name?: string;
    readonly Designation?: string;
    readonly Email?: string;
    readonly Phone?: string;
}

export interface CustomerContactUpdateEntity extends CustomerContactCreateEntity {
    readonly Id: number;
}

export interface CustomerContactEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Customer?: number | number[];
            Name?: string | string[];
            Designation?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Customer?: number | number[];
            Name?: string | string[];
            Designation?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
        };
        contains?: {
            Id?: number;
            Customer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        greaterThan?: {
            Id?: number;
            Customer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Customer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        lessThan?: {
            Id?: number;
            Customer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Customer?: number;
            Name?: string;
            Designation?: string;
            Email?: string;
            Phone?: string;
        };
    },
    $select?: (keyof CustomerContactEntity)[],
    $sort?: string | (keyof CustomerContactEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface CustomerContactEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CustomerContactEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface CustomerContactUpdateEntityEvent extends CustomerContactEntityEvent {
    readonly previousEntity: CustomerContactEntity;
}

export class CustomerContactRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CUSTOMERCONTACT",
        properties: [
            {
                name: "Id",
                column: "CUSTOMERCONTACT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Customer",
                column: "CUSTOMERCONTACT_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "CUSTOMERCONTACT_NAME",
                type: "VARCHAR",
            },
            {
                name: "Designation",
                column: "CUSTOMERCONTACT_DESIGNATION",
                type: "VARCHAR",
            },
            {
                name: "Email",
                column: "CUSTOMERCONTACT_EMAIL",
                type: "VARCHAR",
            },
            {
                name: "Phone",
                column: "CUSTOMERCONTACT_PHONE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CustomerContactRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: CustomerContactEntityOptions = {}): CustomerContactEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): CustomerContactEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: CustomerContactCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CUSTOMERCONTACT",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERCONTACT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CustomerContactUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CUSTOMERCONTACT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "CUSTOMERCONTACT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CustomerContactCreateEntity | CustomerContactUpdateEntity): number {
        const id = (entity as CustomerContactUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CustomerContactUpdateEntity);
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
            table: "CODBEX_CUSTOMERCONTACT",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERCONTACT_ID",
                value: id
            }
        });
    }

    public count(options?: CustomerContactEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CUSTOMERCONTACT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CustomerContactEntityEvent | CustomerContactUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners-Customers-CustomerContact", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-partners-Customers-CustomerContact").send(JSON.stringify(data));
    }
}
