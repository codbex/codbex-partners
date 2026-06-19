package gen.codbex_partners.data.customers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class CustomerContactRepository extends JavaRepository<CustomerContactEntity> {

    public CustomerContactRepository() {
        super(CustomerContactEntity.class);
    }
}
