import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { ForbiddenError } from '@aerokit/sdk/http/errors'
import { user } from '@aerokit/sdk/security'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { SupplierRepository } from '../../data/Suppliers/SupplierRepository'
import { SupplierEntity } from '../../data/Suppliers/SupplierEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-partners-Suppliers-Supplier', ['validate']);

@Controller
@Documentation('codbex-partners - Supplier Controller')
@Injected()
class SupplierController {

    @Inject('SupplierRepository')
    private readonly repository!: SupplierRepository;

    @Get('/')
    @Documentation('Get All Supplier')
    public getAll(_: any, ctx: any): SupplierEntity[] {
        try {
            this.checkPermissions('read');
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale().slice(0, 2)
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/')
    @Documentation('Create Supplier')
    public create(entity: SupplierEntity): SupplierEntity {
        try {
            this.checkPermissions('write');
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierService.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count Supplier')
    public count(): { count: number } {
        try {
            this.checkPermissions('read');
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/count')
    @Documentation('Count Supplier with filter')
    public countWithFilter(filter: any): { count: number } {
        try {
            this.checkPermissions('read');
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/search')
    @Documentation('Search Supplier')
    public search(filter: any): SupplierEntity[] {
        try {
            this.checkPermissions('read');
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get Supplier by id')
    public getById(_: any, ctx: any): SupplierEntity {
        try {
            this.checkPermissions('read');
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale().slice(0, 2)
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('Supplier not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update Supplier by id')
    public update(entity: SupplierEntity, ctx: any): SupplierEntity {
        try {
            this.checkPermissions('write');
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
    @Documentation('Delete Supplier by id')
    public deleteById(_: any, ctx: any): void {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('Supplier not found');
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

    private checkPermissions(operationType: string) {
        if (operationType === 'read' && !(user.isInRole('codbex-partners.Suppliers.SupplierReadOnly') || user.isInRole('codbex-partners.Suppliers.SupplierFullAccess'))) {
            throw new ForbiddenError();
        }
        if (operationType === 'write' && !user.isInRole('codbex-partners.Suppliers.SupplierFullAccess')) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Name === null || entity.Name === undefined) {
            throw new ValidationError(`The 'Name' property is required, provide a valid value`);
        }
        if (entity.Name?.length > 100) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [100] characters`);
        }
        if (entity.Address === null || entity.Address === undefined) {
            throw new ValidationError(`The 'Address' property is required, provide a valid value`);
        }
        if (entity.Address?.length > 200) {
            throw new ValidationError(`The 'Address' exceeds the maximum length of [200] characters`);
        }
        if (entity.PostalCode?.length > 20) {
            throw new ValidationError(`The 'PostalCode' exceeds the maximum length of [20] characters`);
        }
        if (entity.Email === null || entity.Email === undefined) {
            throw new ValidationError(`The 'Email' property is required, provide a valid value`);
        }
        if (entity.Email?.length > 100) {
            throw new ValidationError(`The 'Email' exceeds the maximum length of [100] characters`);
        }
        if (entity.Phone?.length > 20) {
            throw new ValidationError(`The 'Phone' exceeds the maximum length of [20] characters`);
        }
        if (entity.Fax?.length > 20) {
            throw new ValidationError(`The 'Fax' exceeds the maximum length of [20] characters`);
        }
        if (entity.Country === null || entity.Country === undefined) {
            throw new ValidationError(`The 'Country' property is required, provide a valid value`);
        }
        if (entity.City === null || entity.City === undefined) {
            throw new ValidationError(`The 'City' property is required, provide a valid value`);
        }
        if (entity.TIN?.length > 20) {
            throw new ValidationError(`The 'TIN' exceeds the maximum length of [20] characters`);
        }
        if (entity.IBAN?.length > 36) {
            throw new ValidationError(`The 'IBAN' exceeds the maximum length of [36] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
