# <img src="https://www.codbex.com/icon.svg" width="32" style="vertical-align: middle;"> codbex-partners

## 📖 Table of Contents
* [🗺️ Entity Data Model (EDM)](#️-entity-data-model-edm)
* [🧩 Core Entities](#-core-entities)
* [📦 Dependencies](#-dependencies)
* [🐳 Local Development with Docker](#-local-development-with-docker)

## 🗺️ Entity Data Model (EDM)

![model](images/model.png)

## 🧩 Core Entities

### Entity: `Customer`

| Field             | Type      | Details              | Description                         |
| ----------------- | --------- | -------------------- | ----------------------------------- |
| Id                | INTEGER   | PK, Identity         | Unique identifier for the customer. |
| FirstName         | VARCHAR   | Length: 50, Nullable           | Customer first name.                |
| LastName          | VARCHAR   | Length: 50, Nullable          | Customer last name.                 |
| LegalEntityName   | VARCHAR   | Length: 255, Nullable          | Legal entity name.                  |
| Name              | VARCHAR   | Calculated, Length: 255          | Display name.                       |
| Email             | VARCHAR   | Length: 100, Unique, Not Null  | Email address.                      |
| Phone             | VARCHAR   | Length: 15, Not Null           | Phone number.                       |
| Fax               | VARCHAR   | Length: 20           | Fax number.                         |
| Country           | INTEGER   | FK, Not Null                   | Reference to country.               |
| City              | INTEGER   | FK, Not Null                   | Reference to city.                  |
| Address           | VARCHAR   | Length: 255, Not Null          | Address.                            |
| PostalCode        | VARCHAR   | Length: 10, Not Null           | Postal code.                        |
| TIN               | VARCHAR   | Length: 15, Unique, Not Null   | Tax identification number.          |
| IBAN              | VARCHAR   | Length: 34, Unique, Not Null   | Bank account IBAN.                  |
| ResponsiblePerson | INTEGER   | FK, Not Null                   | Reference to employee.              |
| Identifier        | VARCHAR   | Length: 36, Unique, Not Null   | External identifier.                |
| CreatedAt         | TIMESTAMP | Audit, Nullable             | Creation timestamp.                 |
| CreatedBy         | VARCHAR   | Audit, Length: 20, Nullable | Creator.                            |
| UpdatedAt         | TIMESTAMP | Audit, Nullable             | Last update timestamp.              |
| UpdatedBy         | VARCHAR   | Audit, Length: 20, Nullable | Last updater.                       |

### Entity: `Supplier`

| Field           | Type      | Details              | Description        |
| --------------- | --------- | -------------------- | ------------------ |
| Id              | INTEGER   | PK, Identity         | Unique identifier. |
| FirstName       | VARCHAR   | Length: 50, Nullable            | First name.        |
| LastName        | VARCHAR   | Length: 50, Nullable            | Last name.         |
| LegalEntityName | VARCHAR   | Length: 255, Nullable           | Legal entity name. |
| Name            | VARCHAR   | Calculated, Length: 255          | Display name.      |
| Email           | VARCHAR   | Length: 100, Unique, Not Null  | Email.             |
| Phone           | VARCHAR   | Length: 15, Not Null            | Phone.             |
| Fax             | VARCHAR   | Length: 20, Not Null            | Fax.               |
| TIN             | VARCHAR   | Length: 15, Unique, Not Null    | Tax ID.            |
| IBAN            | VARCHAR   | Length: 34, Unique, Not Null    | IBAN.              |
| CreatedAt       | TIMESTAMP | Audit, Nullable             | Created at.        |
| CreatedBy       | VARCHAR   | Audit, Length: 20, Nullable | Created by.        |
| UpdatedAt       | TIMESTAMP | Audit, Nullable             | Updated at.        |
| UpdatedBy       | VARCHAR   | Audit, Length: 20, Nullable | Updated by.        |

### Entity `Manufacturer`

| Field           | Type      | Details              | Description        |
| --------------- | --------- | -------------------- | ------------------ |
| Id              | INTEGER   | PK, Identity         | Unique identifier. |
| FirstName       | VARCHAR   | Length: 50, Nullable            | First name.        |
| LastName        | VARCHAR   | Length: 50, Nullable            | Last name.         |
| LegalEntityName | VARCHAR   | Length: 255, Nullable           | Legal entity name. |
| Name            | VARCHAR   | Calculated, Length: 255          | Display name.      |
| Email           | VARCHAR   | Length: 100, Unique, Not Null  | Email.             |
| Phone           | VARCHAR   | Length: 15, Not Null           | Phone.             |
| Fax             | VARCHAR   | Length: 20, Not Null           | Fax.               |
| TIN             | VARCHAR   | Length: 15, Unique, Not Null   | Tax ID.            |
| IBAN            | VARCHAR   | Length: 34, Unique, Not Null   | IBAN.              |
| CreatedAt       | TIMESTAMP | Audit, Nullable             | Created at.        |
| CreatedBy       | VARCHAR   | Audit, Length: 20, Nullable | Created by.        |
| UpdatedAt       | TIMESTAMP | Audit, Nullable             | Updated at.        |
| UpdatedBy       | VARCHAR   | Audit, Length: 20, Nullable | Updated by.        |

### Entity `CustomerNote`

| Field     | Type      | Details              | Description            |
| --------- | --------- | -------------------- | ---------------------- |
| Id        | INTEGER   | PK, Identity         | Unique identifier.     |
| Customer  | INTEGER   | FK                   | Reference to customer. |
| Note      | VARCHAR   | Length: 5000, Not Null         | Note content.          |
| CreatedAt | TIMESTAMP | Audit, Nullable             | Created at.            |
| CreatedBy | VARCHAR   | Audit, Length: 20, Nullable | Created by.            |
| UpdatedAt | TIMESTAMP | Audit, Nullable             | Updated at.            |
| UpdatedBy | VARCHAR   | Audit, Length: 20, Nullable | Updated by.            |

### Entity `SupplierNote`

| Field     | Type      | Details              | Description            |
| --------- | --------- | -------------------- | ---------------------- |
| Id        | INTEGER   | PK, Identity         | Unique identifier.     |
| Supplier  | INTEGER   | FK                   | Reference to supplier. |
| Note      | VARCHAR   | Length: 5000, Not Null         | Note content.          |
| CreatedAt | TIMESTAMP | Audit, Nullable             | Created at.            |
| CreatedBy | VARCHAR   | Audit, Length: 20, Nullable | Created by.            |
| UpdatedAt | TIMESTAMP | Audit, Nullable             | Updated at.            |
| UpdatedBy | VARCHAR   | Audit, Length: 20, Nullable | Updated by.            |

### Entity `ManufacturerNote`

| Field        | Type      | Details              | Description                |
| ------------ | --------- | -------------------- | -------------------------- |
| Id           | INTEGER   | PK, Identity         | Unique identifier.         |
| Manufacturer | INTEGER   | FK                   | Reference to manufacturer. |
| Note         | VARCHAR   | Length: 5000, Not Null         | Note content.              |
| CreatedAt    | TIMESTAMP | Audit, Nullable             | Created at.                |
| CreatedBy    | VARCHAR   | Audit, Length: 20, Nullable | Created by.                |
| UpdatedAt    | TIMESTAMP | Audit, Nullable             | Updated at.                |
| UpdatedBy    | VARCHAR   | Audit, Length: 20, Nullable | Updated by.                |

### Entity `CustomerContact`

| Field       | Type      | Details              | Description            |
| ----------- | --------- | -------------------- | ---------------------- |
| Id          | INTEGER   | PK, Identity         | Unique identifier.     |
| Customer    | INTEGER   | FK                   | Reference to customer. |
| Name        | VARCHAR   | Length: 255, Not Null         | Contact name.          |
| Designation | VARCHAR   | Length: 255, Not Null          | Job title.             |
| Email       | VARCHAR   | Length: 100, Unique, Not Null  | Email.                 |
| Phone       | VARCHAR   | Length: 15, Not Null           | Phone.                 |
| CreatedAt   | TIMESTAMP | Audit, Nullable             | Created at.            |
| CreatedBy   | VARCHAR   | Audit, Length: 20, Nullable | Created by.            |

### Entity `SupplierContact`

| Field       | Type      | Details              | Description            |
| ----------- | --------- | -------------------- | ---------------------- |
| Id          | INTEGER   | PK, Identity         | Unique identifier.     |
| Supplier    | INTEGER   | FK                   | Reference to supplier. |
| Name        | VARCHAR   | Length: 255, Not Null          | Contact name.          |
| Designation | VARCHAR   | Length: 255, Not Null          | Job title.             |
| Email       | VARCHAR   | Length: 100, Unique, Not Null  | Email.                 |
| Phone       | VARCHAR   | Length: 15, Not Null           | Phone.                 |
| CreatedAt   | TIMESTAMP | Audit, Nullable             | Created at.            |
| CreatedBy   | VARCHAR   | Audit, Length: 20, Nullable | Created by.            |

### Entity `ManufacturerContact`

| Field        | Type      | Details              | Description                |
| ------------ | --------- | -------------------- | -------------------------- |
| Id           | INTEGER   | PK, Identity         | Unique identifier.         |
| Manufacturer | INTEGER   | FK                   | Reference to manufacturer. |
| Name         | VARCHAR   | Length: 255, Not Null          | Contact name.              |
| Designation  | VARCHAR   | Length: 255, Not Null          | Job title.                 |
| Email        | VARCHAR   | Length: 100, Unique, Not Null  | Email.                     |
| Phone        | VARCHAR   | Length: 15, Not Null           | Phone.                     |
| CreatedAt    | TIMESTAMP | Audit, Nullable             | Created at.                |
| CreatedBy    | VARCHAR   | Audit, Length: 20, Nullable | Created by.                |

## 📦 Dependencies

- [codbex-countries](https://github.com/codbex/codbex-countries)
- [codbex-cities](https://github.com/codbex/codbex-cities)
- [codbex-navigation-groups](https://github.com/codbex/codbex-navigation-groups)

## 🐳 Local Development with Docker

When running this project inside the codbex Atlas Docker image, you must provide authentication for installing dependencies from GitHub Packages.
1. Create a GitHub Personal Access Token (PAT) with `read:packages` scope.
2. Pass `NPM_TOKEN` to the Docker container:

    ```
    docker run \
    -e NPM_TOKEN=<your_github_token> \
    --rm -p 80:80 \
    ghcr.io/codbex/codbex-atlas:latest
    ```

⚠️ **Notes**
- The `NPM_TOKEN` must be available at container runtime.
- This is required even for public packages hosted on GitHub Packages.
- Never bake the token into the Docker image or commit it to source control.
