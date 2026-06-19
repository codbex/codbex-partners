package gen.codbex_partners.data.manufacturers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class ManufacturerNoteRepository extends JavaRepository<ManufacturerNoteEntity> {

    public ManufacturerNoteRepository() {
        super(ManufacturerNoteEntity.class);
    }
}
