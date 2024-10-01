const navigationData = {
    id: 'suppliers-navigation',
    label: "Suppliers",
    view: "suppliers",
    group: "partners",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-partners/gen/codbex-partners/ui/Suppliers/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }