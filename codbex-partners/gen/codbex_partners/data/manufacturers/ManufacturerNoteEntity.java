package gen.codbex_partners.data.manufacturers;

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
@Table(name = "CODBEX_MANUFACTURERNOTE")
@Documentation("ManufacturerNote entity mapping")
public class ManufacturerNoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MANUFACTURERNOTE_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "MANUFACTURERNOTE_MANUFACTURER", nullable = true)
    @Documentation("Manufacturer")
    public Integer Manufacturer;

    @Column(name = "MANUFACTURERNOTE_NOTE", length = 5000, nullable = false)
    @Documentation("Note")
    public String Note;

    @CreatedAt
    @Column(name = "MANUFACTURERNOTE_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "MANUFACTURERNOTE_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "MANUFACTURERNOTE_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "MANUFACTURERNOTE_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
