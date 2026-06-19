package gen.codbex_partners.data.suppliers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class SupplierNoteRepository extends JavaRepository<SupplierNoteEntity> {

    public SupplierNoteRepository() {
        super(SupplierNoteEntity.class);
    }
}
