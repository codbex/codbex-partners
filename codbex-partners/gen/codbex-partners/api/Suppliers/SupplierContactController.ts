import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { SupplierContactRepository } from '../../data/Suppliers/SupplierContactRepository'
import { SupplierContactEntity } from '../../data/Suppliers/SupplierContactEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-partners-Suppliers-SupplierContact', ['validate']);

@Controller
@Documentation('codbex-partners - SupplierContact Controller')
@Injected()
class SupplierContactController {

    @Inject('SupplierContactRepository')
    private readonly repository!: SupplierContactRepository;

    @Get('/')
    @Documentation('Get All SupplierContact')
    public getAll(_: any, ctx: any): SupplierContactEntity[] {
        try {
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale()?.split("_")[0]
            };

            let Supplier = parseInt(ctx.queryParameters.Supplier);
            Supplier = isNaN(Supplier) ? ctx.queryParameters.Supplier : Supplier;

            if (Supplier !== undefined) {
                options.$filter = {
                    equals: {
                        Supplier: Supplier
                    }
                };
            }

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/')
    @Documentation('Create SupplierContact')
    public create(entity: SupplierContactEntity): SupplierContactEntity {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierContactController.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count SupplierContact')
    public count(): { count: number } {
        try {
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/count')
    @Documentation('Count SupplierContact with filter')
    public countWithFilter(filter: any): { count: number } {
        try {
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/search')
    @Documentation('Search SupplierContact')
    public search(filter: any): SupplierContactEntity[] {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get SupplierContact by id')
    public getById(_: any, ctx: any): SupplierContactEntity {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale()?.split("_")[0]
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('SupplierContact not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update SupplierContact by id')
    public update(entity: SupplierContactEntity, ctx: any): SupplierContactEntity {
        try {
            const id = parseInt(ctx.pathParameters.id);
            entity.Id = id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Delete('/:id')
    @Documentation('Delete SupplierContact by id')
    public deleteById(_: any, ctx: any): void {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('SupplierContact not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === 'ForbiddenError') {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === 'ValidationError') {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Name === null || entity.Name === undefined) {
            throw new ValidationError(`The 'Name' property is required, provide a valid value`);
        }
        if (entity.Name?.length > 255) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [255] characters`);
        }
        if (entity.Designation === null || entity.Designation === undefined) {
            throw new ValidationError(`The 'Designation' property is required, provide a valid value`);
        }
        if (entity.Designation?.length > 255) {
            throw new ValidationError(`The 'Designation' exceeds the maximum length of [255] characters`);
        }
        if (entity.Email === null || entity.Email === undefined) {
            throw new ValidationError(`The 'Email' property is required, provide a valid value`);
        }
        if (entity.Email?.length > 100) {
            throw new ValidationError(`The 'Email' exceeds the maximum length of [100] characters`);
        }
        if (entity.Phone === null || entity.Phone === undefined) {
            throw new ValidationError(`The 'Phone' property is required, provide a valid value`);
        }
        if (entity.Phone?.length > 15) {
            throw new ValidationError(`The 'Phone' exceeds the maximum length of [15] characters`);
        }
        if (entity.CreatedBy?.length > 20) {
            throw new ValidationError(`The 'CreatedBy' exceeds the maximum length of [20] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
