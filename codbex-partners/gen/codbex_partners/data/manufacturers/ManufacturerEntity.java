package gen.codbex_partners.data.manufacturers;

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
@Table(name = "CODBEX_MANUFACTURER")
@Documentation("Manufacturer entity mapping")
public class ManufacturerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MANUFACTURER_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "MANUFACTURER_FIRSTNAME", length = 50, nullable = true)
    @Documentation("FirstName")
    public String FirstName;

    @Column(name = "MANUFACTURER_LASTNAME", length = 50, nullable = true)
    @Documentation("LastName")
    public String LastName;

    @Column(name = "MANUFACTURER_LEGALENTITYNAME", length = 255, nullable = true)
    @Documentation("LegalEntityName")
    public String LegalEntityName;

    @Column(name = "MANUFACTURER_NAME", length = 255, nullable = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "MANUFACTURER_EMAIL", length = 100, nullable = false, unique = true)
    @Documentation("Email")
    public String Email;

    @Column(name = "MANUFACTURER_PHONE", length = 15, nullable = false)
    @Documentation("Phone")
    public String Phone;

    @Column(name = "MANUFACTURER_FAX", length = 20, nullable = false)
    @Documentation("Fax")
    public String Fax;

    @Column(name = "MANUFACTURER_TIN", length = 15, nullable = false, unique = true)
    @Documentation("TIN")
    public String TIN;

    @Column(name = "MANUFACTURER_IBAN", length = 34, nullable = false, unique = true)
    @Documentation("IBAN")
    public String IBAN;

    @CreatedAt
    @Column(name = "MANUFACTURER_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "MANUFACTURER_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "MANUFACTURER_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "MANUFACTURER_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
