package gen.codbex_partners.api.suppliers;

import gen.codbex_partners.data.suppliers.SupplierEntity;
import gen.codbex_partners.data.suppliers.SupplierRepository;

import org.eclipse.dirigible.components.api.security.UserFacade;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Inject;
import org.eclipse.dirigible.engine.java.annotations.http.Body;
import org.eclipse.dirigible.engine.java.annotations.http.Controller;
import org.eclipse.dirigible.engine.java.annotations.http.Delete;
import org.eclipse.dirigible.engine.java.annotations.http.Get;
import org.eclipse.dirigible.engine.java.annotations.http.PathParam;
import org.eclipse.dirigible.engine.java.annotations.http.Post;
import org.eclipse.dirigible.engine.java.annotations.http.Put;
import org.eclipse.dirigible.engine.java.annotations.http.QueryParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Controller
@Documentation("codbex-partners - Supplier Controller")
public class SupplierController {

    private static final Set<String> FILTER_FIELDS = Set.of("Id", "FirstName", "LastName", "LegalEntityName", "Name", "Email", "Phone", "Fax", "TIN", "IBAN", "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy");

    @Inject
    private SupplierRepository repository;

    @Get
    @Documentation("List Supplier")
    public List<SupplierEntity> getAll(@QueryParam("$limit") Integer limit,
                                      @QueryParam("$offset") Integer offset) {
        checkPermissions("read");
        int actualLimit = limit != null ? limit.intValue() : 20;
        int actualOffset = offset != null ? offset.intValue() : 0;
        List<SupplierEntity> result = repository.findAll(actualLimit, actualOffset);
        return result;
    }

    @Get("/count")
    @Documentation("Count Supplier")
    public Map<String, Long> count() {
        checkPermissions("read");
        return Map.of("count", repository.count());
    }

    @Post("/count")
    @Documentation("Count Supplier with filter")
    public Map<String, Long> countWithFilter(@Body Map<String, Object> filter) {
        checkPermissions("read");
        return Map.of("count", (long) runFilter(filter).size());
    }

    @Post("/search")
    @Documentation("Search Supplier")
    public List<SupplierEntity> search(@Body Map<String, Object> filter) {
        checkPermissions("read");
        List<SupplierEntity> result = runFilter(filter);
        return result;
    }

    @Get("/{id}")
    @Documentation("Get Supplier by id")
    public SupplierEntity getById(@PathParam("id") Integer id) {
        checkPermissions("read");
        SupplierEntity entity = repository.findOne(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));
        return entity;
    }

    @Post
    @Documentation("Create Supplier")
    public SupplierEntity create(@Body SupplierEntity entity) {
        checkPermissions("write");
        validate(entity);
        return repository.save(entity);
    }

    @Put("/{id}")
    @Documentation("Update Supplier by id")
    public SupplierEntity update(@PathParam("id") Integer id, @Body SupplierEntity entity) {
        checkPermissions("write");
        entity.Id = id;
        validate(entity);
        return repository.update(entity);
    }

    @Delete("/{id}")
    @Documentation("Delete Supplier by id")
    public void deleteById(@PathParam("id") Integer id) {
        checkPermissions("write");
        if (repository.findOne(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found");
        }
        repository.deleteById(id);
    }

    private List<SupplierEntity> runFilter(Map<String, Object> filter) {
        StringBuilder hql = new StringBuilder("from SupplierEntity e");
        Map<String, Object> params = new LinkedHashMap<>();
        boolean first = true;
        if (filter != null && filter.get("equals") instanceof Map<?, ?> equals) {
            for (Map.Entry<?, ?> entry : equals.entrySet()) {
                String field = requireKnownField(String.valueOf(entry.getKey()));
                String paramName = "p" + params.size();
                hql.append(first ? " where e." : " and e.").append(field).append(" = :").append(paramName);
                params.put(paramName, entry.getValue());
                first = false;
            }
        }
        if (filter != null && filter.get("conditions") instanceof List<?> conditions) {
            for (Object raw : conditions) {
                if (!(raw instanceof Map<?, ?> condition)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter condition");
                }
                String field = requireKnownField(String.valueOf(condition.get("propertyName")));
                String operator = String.valueOf(condition.get("operator")).toUpperCase(Locale.ROOT);
                Object value = condition.get("value");
                String paramName = "p" + params.size();
                String clause = switch (operator) {
                    case "EQ" -> "e." + field + " = :" + paramName;
                    case "IN" -> {
                        if (!(value instanceof Collection<?>)) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IN value must be a list for field: " + field);
                        }
                        yield "e." + field + " in (:" + paramName + ")";
                    }
                    case "LIKE" -> "e." + field + " like :" + paramName;
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported operator: " + operator);
                };
                hql.append(first ? " where " : " and ").append(clause);
                params.put(paramName, value);
                first = false;
            }
        }
        return repository.query(hql.toString(), params);
    }

    private static String requireKnownField(String field) {
        if (!FILTER_FIELDS.contains(field)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown filter field: " + field);
        }
        return field;
    }

    private void checkPermissions(String op) {
        if ("read".equals(op) && !(UserFacade.isInRole("codbex-partners.Suppliers.SupplierReadOnly") || UserFacade.isInRole("codbex-partners.Suppliers.SupplierFullAccess"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if ("write".equals(op) && !UserFacade.isInRole("codbex-partners.Suppliers.SupplierFullAccess")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static void validate(SupplierEntity entity) {
        if (entity.FirstName != null && entity.FirstName.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'FirstName' exceeds the maximum length of 50");
        }
        if (entity.LastName != null && entity.LastName.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'LastName' exceeds the maximum length of 50");
        }
        if (entity.LegalEntityName != null && entity.LegalEntityName.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'LegalEntityName' exceeds the maximum length of 255");
        }
        if (entity.Name != null && entity.Name.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Name' exceeds the maximum length of 255");
        }
        if (entity.Email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Email' property is required");
        }
        if (entity.Email != null && entity.Email.length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Email' exceeds the maximum length of 100");
        }
        if (entity.Phone == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Phone' property is required");
        }
        if (entity.Phone != null && entity.Phone.length() > 15) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Phone' exceeds the maximum length of 15");
        }
        if (entity.Fax == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Fax' property is required");
        }
        if (entity.Fax != null && entity.Fax.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Fax' exceeds the maximum length of 20");
        }
        if (entity.TIN == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'TIN' property is required");
        }
        if (entity.TIN != null && entity.TIN.length() > 15) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'TIN' exceeds the maximum length of 15");
        }
        if (entity.IBAN == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'IBAN' property is required");
        }
        if (entity.IBAN != null && entity.IBAN.length() > 34) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'IBAN' exceeds the maximum length of 34");
        }
        if (entity.IBAN != null && !entity.IBAN.toString().matches("^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The value of 'IBAN' does not match the required pattern '^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$'");
        }
        if (entity.CreatedBy != null && entity.CreatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CreatedBy' exceeds the maximum length of 20");
        }
        if (entity.UpdatedBy != null && entity.UpdatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'UpdatedBy' exceeds the maximum length of 20");
        }
    }
}
