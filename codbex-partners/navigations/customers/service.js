const navigationData = {
    id: 'custmores-navigation',
    label: "Customers",
    view: "customers",
    group: "partners",
    orderNumber: 300,
    link: "/services/web/codbex-partners/gen/codbex-partners/ui/Customers/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }