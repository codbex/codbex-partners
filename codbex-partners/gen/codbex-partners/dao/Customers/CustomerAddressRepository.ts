import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface CustomerAddressEntity {
    readonly Id: number;
    Customer?: number;
    Country?: number;
    City?: number;
    AdressLine1?: string;
    AddressLine2?: string;
    PostalCode?: string;
    AddressType?: number;
    IsActive?: boolean;
}

export interface CustomerAddressCreateEntity {
    readonly Customer?: number;
    readonly Country?: number;
    readonly City?: number;
    readonly AdressLine1?: string;
    readonly AddressLine2?: string;
    readonly PostalCode?: string;
    readonly AddressType?: number;
    readonly IsActive?: boolean;
}

export interface CustomerAddressUpdateEntity extends CustomerAddressCreateEntity {
    readonly Id: number;
}

export interface CustomerAddressEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Customer?: number | number[];
            Country?: number | number[];
            City?: number | number[];
            AdressLine1?: string | string[];
            AddressLine2?: string | string[];
            PostalCode?: string | string[];
            AddressType?: number | number[];
            IsActive?: boolean | boolean[];
        };
        notEquals?: {
            Id?: number | number[];
            Customer?: number | number[];
            Country?: number | number[];
            City?: number | number[];
            AdressLine1?: string | string[];
            AddressLine2?: string | string[];
            PostalCode?: string | string[];
            AddressType?: number | number[];
            IsActive?: boolean | boolean[];
        };
        contains?: {
            Id?: number;
            Customer?: number;
            Country?: number;
            City?: number;
            AdressLine1?: string;
            AddressLine2?: string;
            PostalCode?: string;
            AddressType?: number;
            IsActive?: boolean;
        };
        greaterThan?: {
            Id?: number;
            Customer?: number;
            Country?: number;
            City?: number;
            AdressLine1?: string;
            AddressLine2?: string;
            PostalCode?: string;
            AddressType?: number;
            IsActive?: boolean;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Customer?: number;
            Country?: number;
            City?: number;
            AdressLine1?: string;
            AddressLine2?: string;
            PostalCode?: string;
            AddressType?: number;
            IsActive?: boolean;
        };
        lessThan?: {
            Id?: number;
            Customer?: number;
            Country?: number;
            City?: number;
            AdressLine1?: string;
            AddressLine2?: string;
            PostalCode?: string;
            AddressType?: number;
            IsActive?: boolean;
        };
        lessThanOrEqual?: {
            Id?: number;
            Customer?: number;
            Country?: number;
            City?: number;
            AdressLine1?: string;
            AddressLine2?: string;
            PostalCode?: string;
            AddressType?: number;
            IsActive?: boolean;
        };
    },
    $select?: (keyof CustomerAddressEntity)[],
    $sort?: string | (keyof CustomerAddressEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface CustomerAddressEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CustomerAddressEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface CustomerAddressUpdateEntityEvent extends CustomerAddressEntityEvent {
    readonly previousEntity: CustomerAddressEntity;
}

export class CustomerAddressRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CUSTOMERADDRESS",
        properties: [
            {
                name: "Id",
                column: "CUSTOMERADDRESS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Customer",
                column: "CUSTOMERADDRESS_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Country",
                column: "CUSTOMERADDRESS_COUNTRY",
                type: "INTEGER",
            },
            {
                name: "City",
                column: "CUSTOMERADDRESS_CITY",
                type: "INTEGER",
            },
            {
                name: "AdressLine1",
                column: "CUSTOMERADDRESS_ADRESSLINE1",
                type: "VARCHAR",
            },
            {
                name: "AddressLine2",
                column: "CUSTOMERADDRESS_ADDRESSLINE2",
                type: "VARCHAR",
            },
            {
                name: "PostalCode",
                column: "CUSTOMERADDRESS_POSTALCODE",
                type: "VARCHAR",
            },
            {
                name: "AddressType",
                column: "CUSTOMERADDRESS_CUSTOMERADDRESSTYPE",
                type: "INTEGER",
            },
            {
                name: "IsActive",
                column: "CUSTOMERADDRESS_ISACTIVE",
                type: "BOOLEAN",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CustomerAddressRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: CustomerAddressEntityOptions = {}): CustomerAddressEntity[] {
        return this.dao.list(options).map((e: CustomerAddressEntity) => {
            EntityUtils.setBoolean(e, "IsActive");
            return e;
        });
    }

    public findById(id: number): CustomerAddressEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setBoolean(entity, "IsActive");
        return entity ?? undefined;
    }

    public create(entity: CustomerAddressCreateEntity): number {
        EntityUtils.setBoolean(entity, "IsActive");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CUSTOMERADDRESS",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERADDRESS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CustomerAddressUpdateEntity): void {
        EntityUtils.setBoolean(entity, "IsActive");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CUSTOMERADDRESS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "CUSTOMERADDRESS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CustomerAddressCreateEntity | CustomerAddressUpdateEntity): number {
        const id = (entity as CustomerAddressUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CustomerAddressUpdateEntity);
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
            table: "CODBEX_CUSTOMERADDRESS",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERADDRESS_ID",
                value: id
            }
        });
    }

    public count(options?: CustomerAddressEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CUSTOMERADDRESS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CustomerAddressEntityEvent | CustomerAddressUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-partners-Customers-CustomerAddress", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-partners-Customers-CustomerAddress").send(JSON.stringify(data));
    }
}
