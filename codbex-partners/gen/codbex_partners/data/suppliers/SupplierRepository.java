package gen.codbex_partners.data.suppliers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class SupplierRepository extends JavaRepository<SupplierEntity> {

    public SupplierRepository() {
        super(SupplierEntity.class);
    }

    @Override
    public SupplierEntity save(SupplierEntity entity) {
        entity.Name = (entity.FirstName != null && !entity.FirstName.trim().isEmpty() && entity.LastName != null && !entity.LastName.trim().isEmpty()) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        return super.save(entity);
    }

    @Override
    public SupplierEntity update(SupplierEntity entity) {
        entity.Name = (entity.FirstName != null && !entity.FirstName.trim().isEmpty() && entity.LastName != null && !entity.LastName.trim().isEmpty()) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        return super.update(entity);
    }
}
