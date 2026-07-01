package gen.codbex_partners.data.customers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class CustomerNoteRepository extends JavaRepository<CustomerNoteEntity> {

    public CustomerNoteRepository() {
        super(CustomerNoteEntity.class);
    }

    @Override
    public CustomerNoteEntity save(CustomerNoteEntity entity) {
        CustomerNoteEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-partners-Customers-CustomerNote", Json.stringify(saved));
        return saved;
    }

    @Override
    public CustomerNoteEntity update(CustomerNoteEntity entity) {
        CustomerNoteEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Customers-CustomerNote-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "CustomerNote-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public CustomerNoteEntity updateWithoutEvent(CustomerNoteEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(CustomerNoteEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Customers-CustomerNote-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        CustomerNoteEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-partners-Customers-CustomerNote-deleted", Json.stringify(entity));
        }
    }
}
