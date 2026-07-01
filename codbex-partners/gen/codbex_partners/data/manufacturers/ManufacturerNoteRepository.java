package gen.codbex_partners.data.manufacturers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class ManufacturerNoteRepository extends JavaRepository<ManufacturerNoteEntity> {

    public ManufacturerNoteRepository() {
        super(ManufacturerNoteEntity.class);
    }

    @Override
    public ManufacturerNoteEntity save(ManufacturerNoteEntity entity) {
        ManufacturerNoteEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-partners-Manufacturers-ManufacturerNote", Json.stringify(saved));
        return saved;
    }

    @Override
    public ManufacturerNoteEntity update(ManufacturerNoteEntity entity) {
        ManufacturerNoteEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Manufacturers-ManufacturerNote-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "ManufacturerNote-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public ManufacturerNoteEntity updateWithoutEvent(ManufacturerNoteEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(ManufacturerNoteEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Manufacturers-ManufacturerNote-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        ManufacturerNoteEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-partners-Manufacturers-ManufacturerNote-deleted", Json.stringify(entity));
        }
    }
}
