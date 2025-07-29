import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { CustomerAddressRepository, CustomerAddressEntityOptions } from "../../dao/Customers/CustomerAddressRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-partners-Customers-CustomerAddress", ["validate"]);

@Controller
class CustomerAddressService {

    private readonly repository = new CustomerAddressRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: CustomerAddressEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            let Customer = parseInt(ctx.queryParameters.Customer);
            Customer = isNaN(Customer) ? ctx.queryParameters.Customer : Customer;

            if (Customer !== undefined) {
                options.$filter = {
                    equals: {
                        Customer: Customer
                    }
                };
            }

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerAddressService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("CustomerAddress not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("CustomerAddress not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Country === null || entity.Country === undefined) {
            throw new ValidationError(`The 'Country' property is required, provide a valid value`);
        }
        if (entity.AddressLine1 === null || entity.AddressLine1 === undefined) {
            throw new ValidationError(`The 'AddressLine1' property is required, provide a valid value`);
        }
        if (entity.AddressLine1?.length > 500) {
            throw new ValidationError(`The 'AddressLine1' exceeds the maximum length of [500] characters`);
        }
        if (entity.AddressLine2?.length > 500) {
            throw new ValidationError(`The 'AddressLine2' exceeds the maximum length of [500] characters`);
        }
        if (entity.PostalCode === null || entity.PostalCode === undefined) {
            throw new ValidationError(`The 'PostalCode' property is required, provide a valid value`);
        }
        if (entity.PostalCode?.length > 10) {
            throw new ValidationError(`The 'PostalCode' exceeds the maximum length of [10] characters`);
        }
        if (entity.AddressType === null || entity.AddressType === undefined) {
            throw new ValidationError(`The 'AddressType' property is required, provide a valid value`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
