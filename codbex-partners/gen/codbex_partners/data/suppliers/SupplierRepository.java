package gen.codbex_partners.data.suppliers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;

@Repository
public class SupplierRepository extends JavaRepository<SupplierEntity> {

    public SupplierRepository() {
        super(SupplierEntity.class);
    }

    @Override
    public SupplierEntity save(SupplierEntity entity) {
        entity.Name = (entity.FirstName != null && !entity.FirstName.trim().isEmpty() && entity.LastName != null && !entity.LastName.trim().isEmpty()) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        SupplierEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-partners-Suppliers-Supplier", Json.stringify(saved));
        return saved;
    }

    @Override
    public SupplierEntity update(SupplierEntity entity) {
        entity.Name = (entity.FirstName != null && !entity.FirstName.trim().isEmpty() && entity.LastName != null && !entity.LastName.trim().isEmpty()) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        SupplierEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Suppliers-Supplier-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Supplier-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public SupplierEntity updateWithoutEvent(SupplierEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(SupplierEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Suppliers-Supplier-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        SupplierEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-partners-Suppliers-Supplier-deleted", Json.stringify(entity));
        }
    }
}
