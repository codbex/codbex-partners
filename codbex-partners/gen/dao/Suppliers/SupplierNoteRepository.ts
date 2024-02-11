import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SupplierNoteEntity {
    readonly Id: number;
    Supplier?: number;
    Note?: string;
}

export interface SupplierNoteCreateEntity {
    readonly Supplier?: number;
    readonly Note?: string;
}

export interface SupplierNoteUpdateEntity extends SupplierNoteCreateEntity {
    readonly Id: number;
}

export interface SupplierNoteEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Supplier?: number | number[];
            Note?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Supplier?: number | number[];
            Note?: string | string[];
        };
        contains?: {
            Id?: number;
            Supplier?: number;
            Note?: string;
        };
        greaterThan?: {
            Id?: number;
            Supplier?: number;
            Note?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Supplier?: number;
            Note?: string;
        };
        lessThan?: {
            Id?: number;
            Supplier?: number;
            Note?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Supplier?: number;
            Note?: string;
        };
    },
    $select?: (keyof SupplierNoteEntity)[],
    $sort?: string | (keyof SupplierNoteEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SupplierNoteEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SupplierNoteEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class SupplierNoteRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SUPPLIERNOTE",
        properties: [
            {
                name: "Id",
                column: "SUPPLIERNOTE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Supplier",
                column: "SUPPLIERNOTE_SUPPLIER",
                type: "INTEGER",
            },
            {
                name: "Note",
                column: "SUPPLIERNOTE_NOTE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(SupplierNoteRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SupplierNoteEntityOptions): SupplierNoteEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SupplierNoteEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SupplierNoteCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SUPPLIERNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERNOTE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SupplierNoteUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SUPPLIERNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERNOTE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SupplierNoteCreateEntity | SupplierNoteUpdateEntity): number {
        const id = (entity as SupplierNoteUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SupplierNoteUpdateEntity);
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
            table: "CODBEX_SUPPLIERNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERNOTE_ID",
                value: id
            }
        });
    }



    public count(Supplier: number): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SUPPLIERNOTE" WHERE "SUPPLIERNOTE_SUPPLIER" = ?', [Supplier]);
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SUPPLIERNOTE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SupplierNoteEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners/Suppliers/SupplierNote", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-partners/Suppliers/SupplierNote").send(JSON.stringify(data));
    }
}