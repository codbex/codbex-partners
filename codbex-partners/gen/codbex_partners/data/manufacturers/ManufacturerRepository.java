package gen.codbex_partners.data.manufacturers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class ManufacturerRepository extends JavaRepository<ManufacturerEntity> {

    public ManufacturerRepository() {
        super(ManufacturerEntity.class);
    }

    @Override
    public ManufacturerEntity save(ManufacturerEntity entity) {
        entity.Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        return super.save(entity);
    }

    @Override
    public ManufacturerEntity update(ManufacturerEntity entity) {
        entity.Name = (entity.FirstName && entity.LastName) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        return super.update(entity);
    }
}
