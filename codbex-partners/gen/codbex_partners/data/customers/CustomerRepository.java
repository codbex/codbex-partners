package gen.codbex_partners.data.customers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class CustomerRepository extends JavaRepository<CustomerEntity> {

    public CustomerRepository() {
        super(CustomerEntity.class);
    }

    @Override
    public CustomerEntity save(CustomerEntity entity) {
        entity.Name = (entity.FirstName != null && !entity.FirstName.trim().isEmpty() && entity.LastName != null && !entity.LastName.trim().isEmpty()) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        return super.save(entity);
    }

    @Override
    public CustomerEntity update(CustomerEntity entity) {
        entity.Name = (entity.FirstName != null && !entity.FirstName.trim().isEmpty() && entity.LastName != null && !entity.LastName.trim().isEmpty()) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        return super.update(entity);
    }
}
