import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface CustomerNoteEntity {
    readonly Id: number;
    Customer?: number;
    Note?: string;
}

export interface CustomerNoteCreateEntity {
    readonly Customer?: number;
    readonly Note?: string;
}

export interface CustomerNoteUpdateEntity extends CustomerNoteCreateEntity {
    readonly Id: number;
}

export interface CustomerNoteEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Customer?: number | number[];
            Note?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Customer?: number | number[];
            Note?: string | string[];
        };
        contains?: {
            Id?: number;
            Customer?: number;
            Note?: string;
        };
        greaterThan?: {
            Id?: number;
            Customer?: number;
            Note?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Customer?: number;
            Note?: string;
        };
        lessThan?: {
            Id?: number;
            Customer?: number;
            Note?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Customer?: number;
            Note?: string;
        };
    },
    $select?: (keyof CustomerNoteEntity)[],
    $sort?: string | (keyof CustomerNoteEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface CustomerNoteEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CustomerNoteEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class CustomerNoteRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CUSTOMERNOTE",
        properties: [
            {
                name: "Id",
                column: "CUSTOMERNOTE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Customer",
                column: "CUSTOMERNOTE_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Note",
                column: "CUSTOMERNOTE_NOTE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CustomerNoteRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: CustomerNoteEntityOptions): CustomerNoteEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): CustomerNoteEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: CustomerNoteCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CUSTOMERNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERNOTE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CustomerNoteUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CUSTOMERNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERNOTE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CustomerNoteCreateEntity | CustomerNoteUpdateEntity): number {
        const id = (entity as CustomerNoteUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CustomerNoteUpdateEntity);
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
            table: "CODBEX_CUSTOMERNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERNOTE_ID",
                value: id
            }
        });
    }

    public count(options?: CustomerNoteEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CUSTOMERNOTE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CustomerNoteEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners-Customers-CustomerNote", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-partners-Customers-CustomerNote").send(JSON.stringify(data));
    }
}
