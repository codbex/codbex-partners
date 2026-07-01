package gen.codbex_partners.data.suppliers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class SupplierContactRepository extends JavaRepository<SupplierContactEntity> {

    public SupplierContactRepository() {
        super(SupplierContactEntity.class);
    }

    @Override
    public SupplierContactEntity save(SupplierContactEntity entity) {
        SupplierContactEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-partners-Suppliers-SupplierContact", Json.stringify(saved));
        return saved;
    }

    @Override
    public SupplierContactEntity update(SupplierContactEntity entity) {
        SupplierContactEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Suppliers-SupplierContact-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "SupplierContact-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public SupplierContactEntity updateWithoutEvent(SupplierContactEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(SupplierContactEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Suppliers-SupplierContact-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        SupplierContactEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-partners-Suppliers-SupplierContact-deleted", Json.stringify(entity));
        }
    }
}
