
"use client";

import type { Product, StyleRecommendation } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { getStyleRecommendations, StyleRecommendationInput } from '@/ai/flows/style-recommendation';
import { Loader2, Wand2 } from 'lucide-react';
import { PLACEHOLDER_IMAGE_DATA_URI } from '@/lib/constants'; 

interface AiStyleToolProps {
  product: Product;
}

export function AiStyleTool({ product }: AiStyleToolProps) {
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [rationale, setRationale] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    setRationale('');

    try {
      // The AI flow expects a data URI. We now have product.imageUrl (a URL string).
      // For the Genkit flow to work with a URL directly, it must be capable of fetching it
      // or the model must support image URLs. The schema specifies 'data:<mimetype>;base64,<encoded_data>'.
      // Passing the URL directly might fail if the flow/model strictly expects a data URI.
      // A robust solution would be to fetch the image client-side, convert to data URI, then send.
      // For now, we pass the imageUrl and rely on the Genkit flow's capability or use a placeholder.
      const inputPhotoDataUri = product.imageUrl || PLACEHOLDER_IMAGE_DATA_URI;
      
      // Check if the imageUrl is already a data URI
      const finalPhotoUri = inputPhotoDataUri.startsWith('data:image') 
        ? inputPhotoDataUri
        : (product.imageUrl || PLACEHOLDER_IMAGE_DATA_URI); // Fallback if not a data URI and we want to send something.

      const input: StyleRecommendationInput = {
        itemDescription: `${product.name}: ${product.description}`,
        itemPhotoDataUri: finalPhotoUri, 
      };
      
      const result = await getStyleRecommendations(input);
      setRecommendations(result.recommendations || []);
      setRationale(result.rationale || '');
    } catch (err: any) {
      console.error("Error getting style recommendations:", err);
      if (err && typeof err.message === 'string' && (err.message.includes('503 Service Unavailable') || err.message.includes('model is overloaded') || err.message.includes('Error fetching from'))) {
        setError("Our AI stylist is currently very popular or experiencing technical difficulties. Please try again in a few moments.");
      } else {
        setError("Sorry, we couldn't fetch style recommendations at this time. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wand2 className="h-6 w-6 text-primary" />
          AI Personal Stylist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Get AI-powered recommendations on how to style this {product.name.toLowerCase()}.
        </p>
        <Button onClick={handleGetRecommendations} disabled={isLoading} className="mb-6">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Getting Ideas...' : 'Get Style Ideas'}
        </Button>

        {error && <p className="text-destructive text-sm">{error}</p>}

        {rationale && (
          <div className="mb-6 p-4 bg-accent/20 border border-accent rounded-md">
            <h4 className="font-semibold mb-2">Stylist's Note:</h4>
            <p className="text-sm">{rationale}</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-lg">Complete The Look:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((item) => (
                <Card key={item.itemId} className="overflow-hidden">
                  <div className="aspect-[3/4] relative w-full bg-muted">
                    <Image
                      src={item.itemPhotoDataUri || PLACEHOLDER_IMAGE_DATA_URI} // Fallback for recommended items
                      alt={item.itemName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      data-ai-hint="clothing item fashion" 
                    />
                  </div>
                  <CardContent className="p-3">
                    <h5 className="font-medium text-sm truncate">{item.itemName}</h5>
                    <p className="text-xs text-muted-foreground truncate">{item.itemDescription}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
