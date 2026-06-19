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
@Table(name = "CODBEX_SUPPLIER")
@Documentation("Supplier entity mapping")
public class SupplierEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUPPLIER_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "SUPPLIER_FIRSTNAME", length = 50, nullable = true)
    @Documentation("FirstName")
    public String FirstName;

    @Column(name = "SUPPLIER_LASTNAME", length = 50, nullable = true)
    @Documentation("LastName")
    public String LastName;

    @Column(name = "SUPPLIER_LEGALENTITYNAME", length = 255, nullable = true)
    @Documentation("LegalEntityName")
    public String LegalEntityName;

    @Column(name = "SUPPLIER_NAME", length = 255, nullable = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "SUPPLIER_EMAIL", length = 100, nullable = false, unique = true)
    @Documentation("Email")
    public String Email;

    @Column(name = "SUPPLIER_PHONE", length = 15, nullable = false)
    @Documentation("Phone")
    public String Phone;

    @Column(name = "SUPPLIER_FAX", length = 20, nullable = false)
    @Documentation("Fax")
    public String Fax;

    @Column(name = "SUPPLIER_TIN", length = 15, nullable = false, unique = true)
    @Documentation("TIN")
    public String TIN;

    @Column(name = "SUPPLIER_IBAN", length = 34, nullable = false, unique = true)
    @Documentation("IBAN")
    public String IBAN;

    @CreatedAt
    @Column(name = "SUPPLIER_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "SUPPLIER_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "SUPPLIER_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "SUPPLIER_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
