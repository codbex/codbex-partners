import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface ManufacturerNoteEntity {
    readonly Id: number;
    Manufacturer?: number;
    Note?: string;
}

export interface ManufacturerNoteCreateEntity {
    readonly Manufacturer?: number;
    readonly Note?: string;
}

export interface ManufacturerNoteUpdateEntity extends ManufacturerNoteCreateEntity {
    readonly Id: number;
}

export interface ManufacturerNoteEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Manufacturer?: number | number[];
            Note?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Manufacturer?: number | number[];
            Note?: string | string[];
        };
        contains?: {
            Id?: number;
            Manufacturer?: number;
            Note?: string;
        };
        greaterThan?: {
            Id?: number;
            Manufacturer?: number;
            Note?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Manufacturer?: number;
            Note?: string;
        };
        lessThan?: {
            Id?: number;
            Manufacturer?: number;
            Note?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Manufacturer?: number;
            Note?: string;
        };
    },
    $select?: (keyof ManufacturerNoteEntity)[],
    $sort?: string | (keyof ManufacturerNoteEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface ManufacturerNoteEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ManufacturerNoteEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class ManufacturerNoteRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_MANUFACTURERNOTE",
        properties: [
            {
                name: "Id",
                column: "MANUFACTURERNOTE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Manufacturer",
                column: "MANUFACTURERNOTE_MANUFACTURER",
                type: "INTEGER",
            },
            {
                name: "Note",
                column: "MANUFACTURERNOTE_NOTE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(ManufacturerNoteRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: ManufacturerNoteEntityOptions): ManufacturerNoteEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): ManufacturerNoteEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ManufacturerNoteCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_MANUFACTURERNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "MANUFACTURERNOTE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ManufacturerNoteUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_MANUFACTURERNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "MANUFACTURERNOTE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ManufacturerNoteCreateEntity | ManufacturerNoteUpdateEntity): number {
        const id = (entity as ManufacturerNoteUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ManufacturerNoteUpdateEntity);
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
            table: "CODBEX_MANUFACTURERNOTE",
            entity: entity,
            key: {
                name: "Id",
                column: "MANUFACTURERNOTE_ID",
                value: id
            }
        });
    }

    public count(): number {
        return this.dao.count();
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_MANUFACTURERNOTE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ManufacturerNoteEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners/Manufacturers/ManufacturerNote", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-partners/Manufacturers/ManufacturerNote").send(JSON.stringify(data));
    }
}