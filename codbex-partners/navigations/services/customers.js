const navigationData = {
    id: 'custmores-navigation',
    label: "Customers",
    view: "customers",
    group: "partners",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-partners/gen/codbex-partners/ui/Customers/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }