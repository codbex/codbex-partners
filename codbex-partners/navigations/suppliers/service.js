const navigationData = {
    id: 'suppliers-navigation',
    label: "Suppliers",
    group: "partners",
    order: 200,
    link: "/services/web/codbex-partners/gen/codbex-partners/ui/Suppliers/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }