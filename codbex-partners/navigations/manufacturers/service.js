const navigationData = {
    id: 'manufacturers-navigation',
    label: "Manufacturers",
    view: "manufacturers",
    group: "partners",
    orderNumber: 100,
    link: "/services/web/codbex-partners/gen/codbex-partners/ui/Manufacturers/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }