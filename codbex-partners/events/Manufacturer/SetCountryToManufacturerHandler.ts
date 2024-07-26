import { ManufacturerRepository } from "codbex-partners/gen/codbex-partners/dao/Manufacturers/ManufacturerRepository";
import { CityRepository } from "codbex-cities/gen/codbex-cities/dao/Cities/CityRepository";

export const trigger = (event) => {
    const ManufacturerDao = new ManufacturerRepository();
    const CityDao = new CityRepository();

    const item = event.entity;
    const operation = event.operation;

    if (operation === "create") {

        const manufacturers = ManufacturerDao.findAll({
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

        manufacturers[0].Country = cities[0].Country;

        ManufacturerDao.update(manufacturers[0]);

    }

}