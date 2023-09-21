# Docker descriptor for codbex-partners
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.12.0

COPY codbex-partners target/dirigible/repository/root/registry/public/codbex-partners

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-partners/gen/index.html
