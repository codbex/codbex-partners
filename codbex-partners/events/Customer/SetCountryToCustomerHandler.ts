import { CustomerRepository } from "codbex-partners/gen/codbex-partners/dao/Customers/CustomerRepository";
import { CityRepository } from "codbex-cities/gen/codbex-cities/dao/Cities/CityRepository";

export const trigger = (event) => {
    const CustomerDao = new CustomerRepository();
    const CityDao = new CityRepository();

    const item = event.entity;
    const operation = event.operation;

    if (operation === "create") {

        const customers = CustomerDao.findAll({
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

        customers[0].Country = cities[0].Country;

        CustomerDao.update(customers[0]);

    }

}