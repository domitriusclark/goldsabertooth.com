export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: {
    url: string;
    altText?: string | null;
    width: number;
    height: number;
  } | null;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  productType: string;
  vendor: string;
  availableForSale: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ProductImage;
  products: Product[];
}

export interface CartLineItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage?: ProductImage;
    };
  };
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
    compareAtAmountPerQuantity?: Money;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLineItem[];
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
    totalTaxAmount: Money;
    totalDutyAmount?: Money;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyError {
  message: string;
  locations?: {
    line: number;
    column: number;
  }[];
  path?: string[];
  extensions?: {
    code: string;
    typeName?: string;
    fieldName?: string;
  };
}

export interface ShopifyResponse<T> {
  data?: T;
  errors?: ShopifyError[];
}