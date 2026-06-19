package gen.codbex_partners.data.suppliers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class SupplierContactRepository extends JavaRepository<SupplierContactEntity> {

    public SupplierContactRepository() {
        super(SupplierContactEntity.class);
    }
}
