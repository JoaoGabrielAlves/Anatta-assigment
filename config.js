require('dotenv').config();

const config = {
    domain: process.env.SHOPIFY_DOMAIN,
    storefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    adminToken: process.env.SHOPIFY_ADMIN_GRAPQHL_ACCESS_TOKEN,
};

module.exports = config;
