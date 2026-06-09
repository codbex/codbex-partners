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
@Table(name = "CODBEX_CUSTOMER")
@Documentation("Customer entity mapping")
public class CustomerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CUSTOMER_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "CUSTOMER_FIRSTNAME", length = 50, nullable = true)
    @Documentation("FirstName")
    public String FirstName;

    @Column(name = "CUSTOMER_LASTNAME", length = 50, nullable = true)
    @Documentation("LastName")
    public String LastName;

    @Column(name = "CUSTOMER_LEGALENTITYNAME", length = 255, nullable = true)
    @Documentation("LegalEntityName")
    public String LegalEntityName;

    @Column(name = "CUSTOMER_NAME", length = 255, nullable = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "CUSTOMER_EMAIL", length = 100, nullable = false, unique = true)
    @Documentation("Email")
    public String Email;

    @Column(name = "CUSTOMER_PHONE", length = 15, nullable = false)
    @Documentation("Phone")
    public String Phone;

    @Column(name = "CUSTOMER_COUNTRY", nullable = false)
    @Documentation("Country")
    public Integer Country;

    @Column(name = "CUSTOMER_CITY", nullable = false)
    @Documentation("City")
    public Integer City;

    @Column(name = "CUSTOMER_FAX", length = 20, nullable = true)
    @Documentation("Fax")
    public String Fax;

    @Column(name = "CUSTOMER_ADDRESS", length = 255, nullable = false)
    @Documentation("Address")
    public String Address;

    @Column(name = "CUSTOMER_POSTALCODE", length = 10, nullable = false)
    @Documentation("PostalCode")
    public String PostalCode;

    @Column(name = "CUSTOMER_TIN", length = 15, nullable = false, unique = true)
    @Documentation("TIN")
    public String TIN;

    @Column(name = "CUSTOMER_IBAN", length = 34, nullable = false, unique = true)
    @Documentation("IBAN")
    public String IBAN;

    @Column(name = "CUSTOMER_RESPONSIBLEPERSON", length = 150, nullable = true)
    @Documentation("ResponsiblePerson")
    public String ResponsiblePerson;

    @CreatedAt
    @Column(name = "CUSTOMER_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "CUSTOMER_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "CUSTOMER_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "CUSTOMER_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
