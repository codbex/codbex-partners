package gen.codbex_partners.data.customers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class CustomerNoteRepository extends JavaRepository<CustomerNoteEntity> {

    public CustomerNoteRepository() {
        super(CustomerNoteEntity.class);
    }
}
