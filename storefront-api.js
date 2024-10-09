const { domain, storefrontToken } = require('./config');

const args = process.argv.slice(2);

const nameIndex = args.indexOf('--name');

let query = '';

if (nameIndex !== -1 && args[nameIndex + 1]) {
    const productName = args[nameIndex + 1];
    query = `${productName}`;
}
const displayVariants = (data) => {
    let allVariants = [];

    // Collect all variants from each product
    data.data.products.edges.forEach(productNode => {
        productNode.node.variants.edges.forEach(variantNode => {
            allVariants.push({
                productTitle: productNode.node.title,
                variantTitle: variantNode.node.title,
                priceAmount: parseFloat(variantNode.node.price.amount),
            });
        });
    });

    // Sort variants by price (ascending order)
    allVariants.sort((a, b) => a.priceAmount - b.priceAmount);

    // Print sorted variants
    allVariants.forEach(variant => {
        console.log(`${variant.productTitle} - ${variant.variantTitle} - price $${variant.priceAmount}`);
    });
};

fetch(`${domain}/api/2024-07/graphql.json`, {
    method: "POST",
    headers: {
        "X-Shopify-Storefront-Access-Token": storefrontToken,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        query: `query getProducts($first: Int, $query: String) {
          products(first: $first, query: $query) {
            edges {
              node {
                title
                variants(first: $first) {
                    edges {
                        node {
                            title
                            price {
                                amount
                            }
                        }
                    }
                }
              }
            }
          }
        }`,
        variables: {
            first: 250,
            query,
        }
    }),
})
    .then(response => response.json())
    .then(data => {
        displayVariants(data);
    })
    .catch(error => console.error('Error:', error));
