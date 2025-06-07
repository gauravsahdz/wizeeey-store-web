
import { getProductById as fetchProductById } from '@/services/api';
import type { ApiProduct } from '@/types/api';
import type { Product } from '@/types';
import { ProductDetailClient } from '@/components/product/product-detail-client';
import { ErrorDisplay } from '@/components/layout/error-display';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { APP_NAME, PLACEHOLDER_IMAGE_DATA_URI } from '@/lib/constants';

type ProductPageProps = {
  params: { id: string };
};

// Helper to adapt API product to frontend Product type
function adaptApiProductToFrontend(apiProduct: ApiProduct | null): Product | null {
  if (!apiProduct) return null;
  return {
    id: apiProduct.id || apiProduct._id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    imageUrl: apiProduct.imageUrl || PLACEHOLDER_IMAGE_DATA_URI,
    categoryName: apiProduct.categoryName,
    categoryId: typeof apiProduct.categoryId === 'string' ? apiProduct.categoryId : (apiProduct.categoryId as any)?.id || '',
    availableSizes: apiProduct.availableSizes || [],
    stock: apiProduct.stock,
    sku: apiProduct.sku,
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  let product: Product | null = null;
  try {
    const apiProduct = await fetchProductById(params.id);
    product = adaptApiProductToFrontend(apiProduct);
  } catch (error) {
    console.error(`Error fetching product for metadata (ID: ${params.id}):`, error);
    // Fallback metadata if product fetch fails
    return {
      title: `Product Information | ${APP_NAME}`,
      description: `View details for products on ${APP_NAME}.`,
    };
  }

  if (!product) {
    return {
      title: `Product Not Found | ${APP_NAME}`,
    };
  }

  return {
    title: `${product.name} | ${APP_NAME}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: Product | null = null;
  let apiError: string | null = null;

  try {
    const apiProduct = await fetchProductById(params.id);
    if (!apiProduct) {
      // If API returns null/empty for a valid ID (e.g. product deleted but no error)
      notFound(); 
    }
    product = adaptApiProductToFrontend(apiProduct);
  } catch (error: any) {
    console.error(`Failed to fetch product (ID: ${params.id}):`, error);
    apiError = `We encountered an issue loading this product. This might be due to a temporary problem with our server or the product might no longer be available.\n\nPlease check your API logs on Render.com for 502 errors if you are the site owner.`;
    if (error.message && error.message.includes("401")) {
      apiError = "Failed to load product due to an authorization (401) issue. Your backend API might require authentication for this endpoint, or the server's access is restricted. Please check API and Cloud Workstation/Render.com access controls.";
    } else if (error.message && error.message.includes("502")) {
       apiError = `A "502 Bad Gateway" error occurred while trying to fetch this product from the backend API (${process.env.NEXT_PUBLIC_API_BASE_URL}). This means the API server on Render.com is not responding correctly. \n\nSite Owners: Please check your API application logs on Render.com for details. Common causes include application crashes, deployment issues, or resource limits.`;
    }
  }

  if (apiError) {
    return (
      <ErrorDisplay
        title="Product Load Error"
        message={apiError}
        retryLink={`/products/${params.id}`}
      />
    );
  }

  if (!product) {
    // This case should ideally be caught by the error handling or the notFound() above,
    // but as a final fallback:
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <ProductDetailClient product={product} />
    </div>
  );
}
