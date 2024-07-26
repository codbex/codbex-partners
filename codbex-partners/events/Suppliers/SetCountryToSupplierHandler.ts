import { SupplierRepository } from "codbex-partners/gen/codbex-partners/dao/Suppliers/SupplierRepository";
import { CityRepository } from "codbex-cities/gen/codbex-cities/dao/Cities/CityRepository";

export const trigger = (event) => {
    const SupplierDao = new SupplierRepository();
    const CityDao = new CityRepository();

    const item = event.entity;
    const operation = event.operation;

    if (operation === "create") {

        const suppliers = SupplierDao.findAll({
            $filter: {
                equals: {
                    Id: item.Id
                }
            }
        });

        const cities = CityDao.findAll({
            $filter: {
                equals: {
                    Id: item.City
                }
            }
        });

        suppliers[0].Country = cities[0].Country;

        SupplierDao.update(suppliers[0]);

    }

}