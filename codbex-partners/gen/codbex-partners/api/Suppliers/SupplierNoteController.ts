import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { ForbiddenError } from '@aerokit/sdk/http/errors'
import { user } from '@aerokit/sdk/security'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { SupplierNoteRepository } from '../../data/Suppliers/SupplierNoteRepository'
import { SupplierNoteEntity } from '../../data/Suppliers/SupplierNoteEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-partners-Suppliers-SupplierNote', ['validate']);

@Controller
@Documentation('codbex-partners - SupplierNote Controller')
@Injected()
class SupplierNoteController {

    @Inject('SupplierNoteRepository')
    private readonly repository!: SupplierNoteRepository;

    @Get('/')
    @Documentation('Get All SupplierNote')
    public getAll(_: any, ctx: any): SupplierNoteEntity[] {
        try {
            this.checkPermissions('read');
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
    @Documentation('Create SupplierNote')
    public create(entity: SupplierNoteEntity): SupplierNoteEntity {
        try {
            this.checkPermissions('write');
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierNoteController.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count SupplierNote')
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
    @Documentation('Count SupplierNote with filter')
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
    @Documentation('Search SupplierNote')
    public search(filter: any): SupplierNoteEntity[] {
        try {
            this.checkPermissions('read');
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get SupplierNote by id')
    public getById(_: any, ctx: any): SupplierNoteEntity {
        try {
            this.checkPermissions('read');
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale()?.split("_")[0]
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('SupplierNote not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update SupplierNote by id')
    public update(entity: SupplierNoteEntity, ctx: any): SupplierNoteEntity {
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
    @Documentation('Delete SupplierNote by id')
    public deleteById(_: any, ctx: any): void {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('SupplierNote not found');
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
        if (operationType === 'read' && !(user.isInRole('codbex-partners.Suppliers.SupplierNoteReadOnly') || user.isInRole('codbex-partners.Suppliers.SupplierNoteFullAccess'))) {
            throw new ForbiddenError();
        }
        if (operationType === 'write' && !user.isInRole('codbex-partners.Suppliers.SupplierNoteFullAccess')) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Note === null || entity.Note === undefined) {
            throw new ValidationError(`The 'Note' property is required, provide a valid value`);
        }
        if (entity.Note?.length > 5000) {
            throw new ValidationError(`The 'Note' exceeds the maximum length of [5000] characters`);
        }
        if (entity.CreatedBy?.length > 20) {
            throw new ValidationError(`The 'CreatedBy' exceeds the maximum length of [20] characters`);
        }
        if (entity.UpdatedBy?.length > 20) {
            throw new ValidationError(`The 'UpdatedBy' exceeds the maximum length of [20] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
