import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { ForbiddenError } from '@aerokit/sdk/http/errors'
import { user } from '@aerokit/sdk/security'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { ManufacturerRepository } from '../../data/Manufacturers/ManufacturerRepository'
import { ManufacturerEntity } from '../../data/Manufacturers/ManufacturerEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-partners-Manufacturers-Manufacturer', ['validate']);

@Controller
@Documentation('codbex-partners - Manufacturer Controller')
@Injected()
class ManufacturerController {

    @Inject('ManufacturerRepository')
    private readonly repository!: ManufacturerRepository;

    @Get('/')
    @Documentation('Get All Manufacturer')
    public getAll(_: any, ctx: any): ManufacturerEntity[] {
        try {
            this.checkPermissions('read');
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale().split("_")[0]
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/')
    @Documentation('Create Manufacturer')
    public create(entity: ManufacturerEntity): ManufacturerEntity {
        try {
            this.checkPermissions('write');
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-partners/gen/codbex-partners/api/Manufacturers/ManufacturerController.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count Manufacturer')
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
    @Documentation('Count Manufacturer with filter')
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
    @Documentation('Search Manufacturer')
    public search(filter: any): ManufacturerEntity[] {
        try {
            this.checkPermissions('read');
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get Manufacturer by id')
    public getById(_: any, ctx: any): ManufacturerEntity {
        try {
            this.checkPermissions('read');
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale().split("_")[0]
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('Manufacturer not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update Manufacturer by id')
    public update(entity: ManufacturerEntity, ctx: any): ManufacturerEntity {
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
    @Documentation('Delete Manufacturer by id')
    public deleteById(_: any, ctx: any): void {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('Manufacturer not found');
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
        if (operationType === 'read' && !(user.isInRole('codbex-partners.Manufacturers.ManufacturerReadOnly') || user.isInRole('codbex-partners.Manufacturers.ManufacturerFullAccess'))) {
            throw new ForbiddenError();
        }
        if (operationType === 'write' && !user.isInRole('codbex-partners.Manufacturers.ManufacturerFullAccess')) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
        if (entity.FirstName?.length > 50) {
            throw new ValidationError(`The 'FirstName' exceeds the maximum length of [50] characters`);
        }
        if (entity.LastName?.length > 50) {
            throw new ValidationError(`The 'LastName' exceeds the maximum length of [50] characters`);
        }
        if (entity.LegalEntityName?.length > 255) {
            throw new ValidationError(`The 'LegalEntityName' exceeds the maximum length of [255] characters`);
        }
        if (entity.Name?.length > 255) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [255] characters`);
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
        if (entity.Fax === null || entity.Fax === undefined) {
            throw new ValidationError(`The 'Fax' property is required, provide a valid value`);
        }
        if (entity.Fax?.length > 20) {
            throw new ValidationError(`The 'Fax' exceeds the maximum length of [20] characters`);
        }
        if (entity.TIN === null || entity.TIN === undefined) {
            throw new ValidationError(`The 'TIN' property is required, provide a valid value`);
        }
        if (entity.TIN?.length > 15) {
            throw new ValidationError(`The 'TIN' exceeds the maximum length of [15] characters`);
        }
        if (entity.IBAN === null || entity.IBAN === undefined) {
            throw new ValidationError(`The 'IBAN' property is required, provide a valid value`);
        }
        if (entity.IBAN?.length > 34) {
            throw new ValidationError(`The 'IBAN' exceeds the maximum length of [34] characters`);
        }
        if (!RegExp(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/).test(entity.IBAN)) {
            throw new ValidationError(`The value provided for the 'IBAN' property ('[${entity.IBAN}]') doesn't match the required pattern '^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$'`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
