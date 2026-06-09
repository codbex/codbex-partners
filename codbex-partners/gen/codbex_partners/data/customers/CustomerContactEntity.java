package gen.codbex_partners.data.customers;

import org.eclipse.dirigible.engine.java.annotations.Column;
import org.eclipse.dirigible.engine.java.annotations.CreatedAt;
import org.eclipse.dirigible.engine.java.annotations.CreatedBy;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Entity;
import org.eclipse.dirigible.engine.java.annotations.GeneratedValue;
import org.eclipse.dirigible.engine.java.annotations.GenerationType;
import org.eclipse.dirigible.engine.java.annotations.Id;
import org.eclipse.dirigible.engine.java.annotations.Table;
import org.eclipse.dirigible.engine.java.annotations.UpdatedAt;
import org.eclipse.dirigible.engine.java.annotations.UpdatedBy;

@Entity
@Table(name = "CODBEX_CUSTOMERCONTACT")
@Documentation("CustomerContact entity mapping")
public class CustomerContactEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CUSTOMERCONTACT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "CUSTOMERCONTACT_CUSTOMER", nullable = true)
    @Documentation("Customer")
    public Integer Customer;

    @Column(name = "CUSTOMERCONTACT_NAME", length = 255, nullable = false)
    @Documentation("Name")
    public String Name;

    @Column(name = "CUSTOMERCONTACT_DESIGNATION", length = 255, nullable = false)
    @Documentation("Designation")
    public String Designation;

    @Column(name = "CUSTOMERCONTACT_EMAIL", length = 100, nullable = false, unique = true)
    @Documentation("Email")
    public String Email;

    @Column(name = "CUSTOMERCONTACT_PHONE", length = 15, nullable = false)
    @Documentation("Phone")
    public String Phone;

    @CreatedAt
    @Column(name = "CUSTOMERCONTACT_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "CUSTOMERCONTACT_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

}
