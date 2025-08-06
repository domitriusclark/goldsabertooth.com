import { z } from 'zod';
import 'isomorphic-fetch';
import type { 
  Product, 
  Cart, 
  ShopifyResponse, 
  ShopifyError 
} from './types';

// Environment variables
const SHOPIFY_DOMAIN = import.meta.env.PUBLIC_SHOPIFY_DOMAIN;
const STOREFRONT_API_VERSION = import.meta.env.PUBLIC_STOREFRONT_API_VERSION || '2024-07';
const STOREFRONT_TOKEN = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_MCP = import.meta.env.PUBLIC_SHOPIFY_MCP; // Optional for dev

// Validation schemas
const ProductSchema = z.object({
  id: z.string(),
  handle: z.string(),
  title: z.string(),
  description: z.string(),
  descriptionHtml: z.string(),
  tags: z.array(z.string()),
  productType: z.string(),
  vendor: z.string(),
  availableForSale: z.boolean(),
  images: z.array(z.object({
    id: z.string(),
    url: z.string(),
    altText: z.string().nullable().optional(),
    width: z.number(),
    height: z.number(),
  })),
  variants: z.array(z.object({
    id: z.string(),
    title: z.string(),
    availableForSale: z.boolean(),
    price: z.object({
      amount: z.string(),
      currencyCode: z.string(),
    }),
    compareAtPrice: z.object({
      amount: z.string(),
      currencyCode: z.string(),
    }).nullable().optional(),
    selectedOptions: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })),
    image: z.object({
      url: z.string(),
      altText: z.string().nullable().optional(),
      width: z.number(),
      height: z.number(),
    }).nullable().optional(),
  })),
  priceRange: z.object({
    minVariantPrice: z.object({
      amount: z.string(),
      currencyCode: z.string(),
    }),
    maxVariantPrice: z.object({
      amount: z.string(),
      currencyCode: z.string(),
    }),
  }),
  options: z.array(z.object({
    id: z.string(),
    name: z.string(),
    values: z.array(z.string()),
  })),
});

class ShopifyAPIError extends Error {
  constructor(
    message: string,
    public errors: ShopifyError[]
  ) {
    super(message);
    this.name = 'ShopifyAPIError';
  }
}

// Main Shopify API client function
export async function shopify<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const baseUrl = SHOPIFY_MCP || `https://${SHOPIFY_DOMAIN}`;
  const endpoint = `${baseUrl}/api/${STOREFRONT_API_VERSION}/graphql.json`;

  if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
    throw new Error('Missing required Shopify environment variables');
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: ShopifyResponse<T> = await response.json();

    if (json.errors && json.errors.length > 0) {
      throw new ShopifyAPIError(
        `Shopify API error: ${json.errors[0].message}`,
        json.errors
      );
    }

    if (!json.data) {
      throw new Error('No data returned from Shopify API');
    }

    return json.data;
  } catch (error) {
    if (error instanceof ShopifyAPIError) {
      throw error;
    }
    throw new Error(`Failed to fetch from Shopify: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get products with optional tag filtering
export async function getProductsByTags(
  tags: string[] | null = null,
  cursor: string | null = null,
  pageSize: number = 12
): Promise<{
  products: Product[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}> {
  const tagQuery = tags && tags.length > 0 
    ? `tag:${tags.map(tag => `"${tag}"`).join(' OR tag:')}`
    : '';

  const query = `
    query GetProducts($first: Int!, $after: String, $query: String) {
      products(first: $first, after: $after, query: $query) {
        edges {
          node {
            id
            handle
            title
            description
            descriptionHtml
            tags
            productType
            vendor
            availableForSale
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            options {
              id
              name
              values
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const variables = {
    first: pageSize,
    after: cursor,
    query: tagQuery || undefined,
  };

  const response = await shopify<{
    products: {
      edges: Array<{ node: any }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  }>(query, variables);

  const products = response.products.edges.map(({ node }) => {
    // Transform the nested structure to flat arrays
    const transformedProduct = {
      ...node,
      images: node.images.edges.map(({ node: image }: any) => image),
      variants: node.variants.edges.map(({ node: variant }: any) => variant),
    };

    // Validate with Zod
    return ProductSchema.parse(transformedProduct);
  });

  return {
    products,
    pageInfo: response.products.pageInfo,
  };
}

// Get single product by handle
export async function getProductByHandle(handle: string): Promise<Product | null> {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        descriptionHtml
        tags
        productType
        vendor
        availableForSale
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          id
          name
          values
        }
      }
    }
  `;

  const response = await shopify<{ product: any | null }>(query, { handle });

  if (!response.product) {
    return null;
  }

  // Transform the nested structure
  const transformedProduct = {
    ...response.product,
    images: response.product.images.edges.map(({ node }: any) => node),
    variants: response.product.variants.edges.map(({ node }: any) => node),
  };

  return ProductSchema.parse(transformedProduct);
}

// Create a new cart
export async function createCart(): Promise<Cart> {
  const query = `
    mutation CartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      id
                      handle
                      title
                      featuredImage {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  compareAtAmountPerQuantity {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
          createdAt
          updatedAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopify<{
    cartCreate: {
      cart: any;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(query);

  if (response.cartCreate.userErrors.length > 0) {
    throw new Error(response.cartCreate.userErrors[0].message);
  }

  // Transform the response
  const cart = {
    ...response.cartCreate.cart,
    lines: response.cartCreate.cart.lines.edges.map(({ node }: any) => node),
  };

  return cart;
}

// Add items to cart
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<Cart> {
  const query = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      id
                      handle
                      title
                      featuredImage {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  compareAtAmountPerQuantity {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
          createdAt
          updatedAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  };

  const response = await shopify<{
    cartLinesAdd: {
      cart: any;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(query, variables);

  if (response.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.cartLinesAdd.userErrors[0].message);
  }

  // Transform the response
  const cart = {
    ...response.cartLinesAdd.cart,
    lines: response.cartLinesAdd.cart.lines.edges.map(({ node }: any) => node),
  };

  return cart;
}

// Update cart line quantities
export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<Cart> {
  const query = `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      id
                      handle
                      title
                      featuredImage {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  compareAtAmountPerQuantity {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
          createdAt
          updatedAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines,
  };

  const response = await shopify<{
    cartLinesUpdate: {
      cart: any;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(query, variables);

  if (response.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.cartLinesUpdate.userErrors[0].message);
  }

  // Transform the response
  const cart = {
    ...response.cartLinesUpdate.cart,
    lines: response.cartLinesUpdate.cart.lines.edges.map(({ node }: any) => node),
  };

  return cart;
}

// Remove lines from cart
export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const query = `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      id
                      handle
                      title
                      featuredImage {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  compareAtAmountPerQuantity {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
          createdAt
          updatedAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopify<{
    cartLinesRemove: {
      cart: any;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(query, { cartId, lineIds });

  if (response.cartLinesRemove.userErrors.length > 0) {
    throw new Error(response.cartLinesRemove.userErrors[0].message);
  }

  // Transform the response
  const cart = {
    ...response.cartLinesRemove.cart,
    lines: response.cartLinesRemove.cart.lines.edges.map(({ node }: any) => node),
  };

  return cart;
}