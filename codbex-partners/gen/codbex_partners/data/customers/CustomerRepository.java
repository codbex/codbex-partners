package gen.codbex_partners.data.customers;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;

@Repository
public class CustomerRepository extends JavaRepository<CustomerEntity> {

    public CustomerRepository() {
        super(CustomerEntity.class);
    }

    @Override
    public CustomerEntity save(CustomerEntity entity) {
        entity.Name = (entity.FirstName != null && !entity.FirstName.trim().isEmpty() && entity.LastName != null && !entity.LastName.trim().isEmpty()) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        CustomerEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-partners-Customers-Customer", Json.stringify(saved));
        return saved;
    }

    @Override
    public CustomerEntity update(CustomerEntity entity) {
        entity.Name = (entity.FirstName != null && !entity.FirstName.trim().isEmpty() && entity.LastName != null && !entity.LastName.trim().isEmpty()) ? (entity.FirstName + " " + entity.LastName) : entity.LegalEntityName;
        CustomerEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Customers-Customer-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Customer-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public CustomerEntity updateWithoutEvent(CustomerEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(CustomerEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-partners-Customers-Customer-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        CustomerEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-partners-Customers-Customer-deleted", Json.stringify(entity));
        }
    }
}
