package gen.codbex_partners.data.suppliers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class SupplierNoteRepository extends JavaRepository<SupplierNoteEntity> {

    public SupplierNoteRepository() {
        super(SupplierNoteEntity.class);
    }

    @Override
    public SupplierNoteEntity save(SupplierNoteEntity entity) {
        SupplierNoteEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-partners-Suppliers-SupplierNote", Json.stringify(saved));
        return saved;
    }

    @Override
    public SupplierNoteEntity update(SupplierNoteEntity entity) {
        SupplierNoteEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Suppliers-SupplierNote-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "SupplierNote-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public SupplierNoteEntity updateWithoutEvent(SupplierNoteEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(SupplierNoteEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Suppliers-SupplierNote-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        SupplierNoteEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-partners-Suppliers-SupplierNote-deleted", Json.stringify(entity));
        }
    }
}
