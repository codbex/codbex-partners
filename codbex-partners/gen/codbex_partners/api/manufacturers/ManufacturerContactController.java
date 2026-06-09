package gen.codbex_partners.api.manufacturers;

import gen.codbex_partners.data.manufacturers.ManufacturerContactEntity;
import gen.codbex_partners.data.manufacturers.ManufacturerContactRepository;

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
@Documentation("codbex-partners - ManufacturerContact Controller")
public class ManufacturerContactController {

    private static final Set<String> FILTER_FIELDS = Set.of("Id", "Manufacturer", "Name", "Designation", "Email", "Phone", "CreatedAt", "CreatedBy");

    @Inject
    private ManufacturerContactRepository repository;

    @Get
    @Documentation("List ManufacturerContact")
    public List<ManufacturerContactEntity> getAll(@QueryParam("$limit") Integer limit,
                                      @QueryParam("$offset") Integer offset,
                                      @QueryParam("Manufacturer") String Manufacturer) {
        int actualLimit = limit != null ? limit.intValue() : 20;
        int actualOffset = offset != null ? offset.intValue() : 0;
        List<ManufacturerContactEntity> result;
        if (Manufacturer != null) {
            Map<String, Object> params = new LinkedHashMap<>();
            params.put("Manufacturer", Manufacturer);
            result = repository.query("from ManufacturerContactEntity e where e.Manufacturer = :Manufacturer", params);
        } else {
            result = repository.findAll(actualLimit, actualOffset);
        }
        return result;
    }

    @Get("/count")
    @Documentation("Count ManufacturerContact")
    public Map<String, Long> count() {
        return Map.of("count", repository.count());
    }

    @Post("/count")
    @Documentation("Count ManufacturerContact with filter")
    public Map<String, Long> countWithFilter(@Body Map<String, Object> filter) {
        return Map.of("count", (long) runFilter(filter).size());
    }

    @Post("/search")
    @Documentation("Search ManufacturerContact")
    public List<ManufacturerContactEntity> search(@Body Map<String, Object> filter) {
        List<ManufacturerContactEntity> result = runFilter(filter);
        return result;
    }

    @Get("/{id}")
    @Documentation("Get ManufacturerContact by id")
    public ManufacturerContactEntity getById(@PathParam("id") Integer id) {
        ManufacturerContactEntity entity = repository.findOne(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ManufacturerContact not found"));
        return entity;
    }

    @Post
    @Documentation("Create ManufacturerContact")
    public ManufacturerContactEntity create(@Body ManufacturerContactEntity entity) {
        validate(entity);
        return repository.save(entity);
    }

    @Put("/{id}")
    @Documentation("Update ManufacturerContact by id")
    public ManufacturerContactEntity update(@PathParam("id") Integer id, @Body ManufacturerContactEntity entity) {
        entity.Id = id;
        validate(entity);
        return repository.update(entity);
    }

    @Delete("/{id}")
    @Documentation("Delete ManufacturerContact by id")
    public void deleteById(@PathParam("id") Integer id) {
        if (repository.findOne(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ManufacturerContact not found");
        }
        repository.deleteById(id);
    }

    private List<ManufacturerContactEntity> runFilter(Map<String, Object> filter) {
        StringBuilder hql = new StringBuilder("from ManufacturerContactEntity e");
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

    private static void validate(ManufacturerContactEntity entity) {
        if (entity.Name == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Name' property is required");
        }
        if (entity.Name != null && entity.Name.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Name' exceeds the maximum length of 255");
        }
        if (entity.Designation == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Designation' property is required");
        }
        if (entity.Designation != null && entity.Designation.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Designation' exceeds the maximum length of 255");
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
        if (entity.CreatedBy != null && entity.CreatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CreatedBy' exceeds the maximum length of 20");
        }
    }
}
