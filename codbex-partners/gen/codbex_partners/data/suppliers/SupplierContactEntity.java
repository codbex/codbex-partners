package gen.codbex_partners.data.suppliers;

import org.eclipse.dirigible.sdk.db.Column;
import org.eclipse.dirigible.sdk.db.CreatedAt;
import org.eclipse.dirigible.sdk.db.CreatedBy;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.db.Entity;
import org.eclipse.dirigible.sdk.db.GeneratedValue;
import org.eclipse.dirigible.sdk.db.GenerationType;
import org.eclipse.dirigible.sdk.db.Id;
import org.eclipse.dirigible.sdk.db.Table;
import org.eclipse.dirigible.sdk.db.UpdatedAt;
import org.eclipse.dirigible.sdk.db.UpdatedBy;

@Entity
@Table(name = "CODBEX_SUPPLIERCONTACT")
@Documentation("SupplierContact entity mapping")
public class SupplierContactEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUPPLIERCONTACT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "SUPPLIERCONTACT_SUPPLIER", nullable = true)
    @Documentation("Supplier")
    public Integer Supplier;

    @Column(name = "SUPPLIERCONTACT_NAME", length = 255, nullable = false)
    @Documentation("Name")
    public String Name;

    @Column(name = "SUPPLIERCONTACT_DESIGNATION", length = 255, nullable = false)
    @Documentation("Designation")
    public String Designation;

    @Column(name = "SUPPLIERCONTACT_EMAIL", length = 100, nullable = false, unique = true)
    @Documentation("Email")
    public String Email;

    @Column(name = "SUPPLIERCONTACT_PHONE", length = 15, nullable = false)
    @Documentation("Phone")
    public String Phone;

    @CreatedAt
    @Column(name = "SUPPLIERCONTACT_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "SUPPLIERCONTACT_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

}
