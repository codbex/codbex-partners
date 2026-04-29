import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { ManufacturerContactRepository } from '../../data/Manufacturers/ManufacturerContactRepository'
import { ManufacturerContactEntity } from '../../data/Manufacturers/ManufacturerContactEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-partners-Manufacturers-ManufacturerContact', ['validate']);

@Controller
@Documentation('codbex-partners - ManufacturerContact Controller')
@Injected()
class ManufacturerContactController {

    @Inject('ManufacturerContactRepository')
    private readonly repository!: ManufacturerContactRepository;

    @Get('/')
    @Documentation('Get All ManufacturerContact')
    public getAll(_: any, ctx: any): ManufacturerContactEntity[] {
        try {
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale()?.split("_")[0]
            };

            let Manufacturer = parseInt(ctx.queryParameters.Manufacturer);
            Manufacturer = isNaN(Manufacturer) ? ctx.queryParameters.Manufacturer : Manufacturer;

            if (Manufacturer !== undefined) {
                options.$filter = {
                    equals: {
                        Manufacturer: Manufacturer
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
    @Documentation('Create ManufacturerContact')
    public create(entity: ManufacturerContactEntity): ManufacturerContactEntity {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-partners/gen/codbex-partners/api/Manufacturers/ManufacturerContactController.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count ManufacturerContact')
    public count(): { count: number } {
        try {
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/count')
    @Documentation('Count ManufacturerContact with filter')
    public countWithFilter(filter: any): { count: number } {
        try {
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/search')
    @Documentation('Search ManufacturerContact')
    public search(filter: any): ManufacturerContactEntity[] {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get ManufacturerContact by id')
    public getById(_: any, ctx: any): ManufacturerContactEntity {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale()?.split("_")[0]
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('ManufacturerContact not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update ManufacturerContact by id')
    public update(entity: ManufacturerContactEntity, ctx: any): ManufacturerContactEntity {
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
    @Documentation('Delete ManufacturerContact by id')
    public deleteById(_: any, ctx: any): void {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('ManufacturerContact not found');
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
