import React, { useState, useRef } from 'react';
import { ChevronDown, Trash2, AlertCircle, Upload, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../../store/profileStore';
import { AutosaveInput } from '../../AutosaveInput';
import { CardHeader } from './CardHeader';

interface Product {
  id: string;
  name: string;
  price: string;
  purchase_url: string;
  image_url: string | null;
  purchase_type: 'paypal' | 'link';
  order: number;
}

const MAX_PRODUCTS = 20;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProductsCard() {
  const navigate = useNavigate();
  const { profile, updateProducts, uploadProductImage } = useProfileStore();
  const [productError, setProductError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddProduct = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }

    if ((profile?.products?.length || 0) >= MAX_PRODUCTS) {
      setProductError(`You can only add up to ${MAX_PRODUCTS} products`);
      setTimeout(() => setProductError(null), 3000);
      return;
    }

    const newProducts = [
      ...(profile?.products || []),
      {
        id: crypto.randomUUID(),
        name: '',
        price: '',
        purchase_url: '',
        image_url: null,
        purchase_type: 'link' as const,
        order: (profile?.products?.length || 0)
      }
    ];
    updateProducts(newProducts);
  };

  const handleRemoveProduct = (id: string) => {
    const newProducts = (profile?.products || []).filter(product => product.id !== id);
    updateProducts(newProducts);
    setProductError(null);
  };

  const handleImageUpload = async (productId: string, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setProductError('Image size should be less than 5MB');
      setTimeout(() => setProductError(null), 3000);
      return;
    }

    try {
      setUploadingImage(productId);
      const imageUrl = await uploadProductImage(file);
      
      const newProducts = (profile?.products || []).map(product =>
        product.id === productId ? { ...product, image_url: imageUrl } : product
      );
      
      await updateProducts(newProducts);
    } catch (error) {
      console.error('Error uploading product image:', error);
      setProductError('Failed to upload image');
      setTimeout(() => setProductError(null), 3000);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleCreateSalesPage = (product: Product) => {
    navigate(`/dashboard/product/${product.id}`);
  };

  return (
    <div className="glass-card-dark">
      <CardHeader
        title="Products & Services"
        subtitle="What products or services do you offer?"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onAdd={handleAddProduct}
      />

      {isExpanded && (
        <div className="px-8 pb-8 space-y-6">
          {productError && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{productError}</span>
            </div>
          )}

          <div className="space-y-4">
            {(profile?.products || []).map((product) => (
              <div
                key={product.id}
                className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <AutosaveInput
                    value={product.name}
                    field={`products.${product.id}.name`}
                    placeholder="Product or Service Name"
                  />
                  <AutosaveInput
                    value={product.price}
                    field={`products.${product.id}.price`}
                    placeholder="Price (e.g., £99)"
                  />
                </div>

                {/* Image Upload */}
                <div 
                  className="relative w-full h-40 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {product.image_url ? (
                    <>
                      <img 
                        src={product.image_url}
                        alt={product.name} 
                        className="w-full h-full object-cover transition-opacity group-hover:opacity-50" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploadingImage === product.id ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Upload className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </>
                  ) : (
                    uploadingImage === product.id ? (
                      <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-white/50" />
                    )
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(product.id, file);
                      }
                    }}
                    disabled={uploadingImage === product.id}
                  />
                </div>

                {/* Purchase Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      value={product.purchase_type}
                      onChange={(e) => {
                        const newProducts = (profile?.products || []).map(p =>
                          p.id === product.id ? { ...p, purchase_type: e.target.value as 'paypal' | 'link' } : p
                        );
                        updateProducts(newProducts);
                      }}
                      className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white appearance-none cursor-pointer"
                    >
                      <option value="paypal" className="bg-gray-900">PayPal Purchase Button</option>
                      <option value="link" className="bg-gray-900">Link to Purchase Button</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
                  <AutosaveInput
                    value={product.purchase_url}
                    field={`products.${product.id}.purchase_url`}
                    placeholder={product.purchase_type === 'paypal' ? 'PayPal.me username' : 'Link to purchase'}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => handleCreateSalesPage(product)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Create Sales Page
                  </button>
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white/70 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}