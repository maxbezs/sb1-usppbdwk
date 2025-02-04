import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Plus, Trash2, Check, Upload, Loader2, ExternalLink } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { AutosaveInput } from '../components/AutosaveInput';
import { supabase } from '../lib/supabase';

interface SalesContent {
  headline_hook: string;
  tagline: string;
  introduction: string;
  benefit_points: string[];
  guarantee_text: string;
  testimonials: Array<{
    name: string;
    content: string;
  }>;
  value_proposition: string;
  explainer_video: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  purchase_url: string;
  image_url: string | null;
  purchase_type: 'paypal' | 'link';
  sales_content?: SalesContent;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProductSalesPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadProductImage } = useProfileStore();
  const [salesContent, setSalesContent] = useState<SalesContent>({
    headline_hook: '',
    tagline: '',
    introduction: '',
    benefit_points: [''],
    guarantee_text: '100% Guaranteed Satisfaction! If the product process is not for you, I will refund you – no questions asked.',
    testimonials: [{ name: '', content: '' }],
    value_proposition: '',
    explainer_video: ''
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Product not found');

      setProduct(data);
      if (data.sales_content) {
        setSalesContent(data.sales_content);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = async (field: keyof Product, value: any) => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ [field]: value })
        .eq('id', productId);

      if (updateError) throw updateError;

      setProduct(prev => prev ? { ...prev, [field]: value } : null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await uploadProductImage(file);
      await handleProductUpdate('image_url', imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleContentChange = async (field: keyof SalesContent, value: any) => {
    try {
      const newContent = { ...salesContent, [field]: value };
      setSalesContent(newContent);

      const { error: updateError } = await supabase
        .from('products')
        .update({ sales_content: newContent })
        .eq('id', productId);

      if (updateError) throw updateError;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addBenefitPoint = () => {
    const newPoints = [...salesContent.benefit_points, ''];
    handleContentChange('benefit_points', newPoints);
  };

  const removeBenefitPoint = (index: number) => {
    const newPoints = salesContent.benefit_points.filter((_, i) => i !== index);
    handleContentChange('benefit_points', newPoints);
  };

  const addTestimonial = () => {
    const newTestimonials = [...salesContent.testimonials, { name: '', content: '' }];
    handleContentChange('testimonials', newTestimonials);
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = salesContent.testimonials.filter((_, i) => i !== index);
    handleContentChange('testimonials', newTestimonials);
  };

  const handlePlaceholderClick = async (field: string) => {
    if (field === 'explainer_video' || field.includes('testimonials')) {
      return;
    }

    let prompt = '';
    
    if (field === 'value_proposition') {
      prompt = `Ok, now I need to create a simple landing page that convinces my target audience to buy this ${product?.name || '[PRODUCT OR SERVICE]'} for just ${product?.price || '[INSERT PRICE]'}. Earlier you created the headline hook, title, bullet-point benefits [INSERT IF NECESSARY]. Lastly, my landing page should consist of:
A short paragraph explaining why the real-world value of the ${product?.name || '[PRODUCT OR SERVICE]'} is worth 10-100X more than the ${product?.price || '[INSERT PRICE]'} I'm charging. 
- Follow the structure exactly.
- Use direct and engaging words, with an appropriate style and tone for the Avatar.
- Write using simple, conversational language. At a 5th grade reading level. Short, punchy, easy to read sentences and action oriented. Short paragraphs. Limit words with more than 4 syllables. 
- Write using active, visual, visceral, direct language. Limit/avoid passive constructions.
- The Avatar should be able to see, feel, and experience what you're describing.
- Amplify the emotional impact without using jargon or tropes. Always be direct without adjectives.
- Do this in a focused and relaxed state of flow without cutting corners, summarizing too much, or leaving out important details.`;
    } else if (field === 'headline_hook') {
      prompt = `I am making the landing page copy for my ${product?.name || '[PRODUCT OR SERVICE]'} which is in [SPECIFIC INDUSTRY] aimed at helping [SPECIFIC NICHE GROUP] to accomplish [SPECIFIC BENEFIT]. Act as a professional hook writer, and give me 10 title ideas for my ${product?.name || '[PRODUCT OR SERVICE]'} using the templates I provide below from other winning titles. Make sure to follow the rules I provide below as well:

## Title Templates:
**Title #1:**
How to ______ without ________ 

**Title #2:**
The ___ Day _______ 

**Title #3:**
______ for _______ 

**Title #4:**
The ___ Step _______ 

**Title #5:**
How to ______ and get ________ 

**Title #6:**
The ______ Guide To (avoiding, getting, having) ____________ 

**Title #7:**
How To Think Like A _________ 

**Title #8:**
XX Questions Every ________ Should Answer / Ask If They Want (or before)  ___________  

**Title #9:**
______ Fatal Mistakes  

**Title #10:**
Hidden _____ ________  

**Title #11:**
______ Deadly Sins Of __________  

**Title #12:**
XX Types Of ____________  

**Title #13:**
XX Crucial ________  

**Title #14:**
______ Staggering Distinctions   

## Title Rules:
- Use direct and engaging words, with appropriate style and tone for my niche.
- Make sure each title conveys a specific benefit or end result
- Make sure each title makes my ${product?.name || '[PRODUCT OR SERVICE]'} sound unique and specific`;
    } else if (field === 'tagline') {
      prompt = `Ok, my title is going to be [INSERT TITLE]. Act as a professional hook writer, and help me create 10 taglines using the following templates I provide below from other winning taglines. Make sure to follow the rules I provide below as well:

## Tagline Templates:

**Tagline #1:**
The ____ Cure 

**Tagline #2:**
The ____ Blueprint 

**Tagline #3:**
The ____ Shortcut

**Tagline #4:**
The ____ Trap 

**Tagline #5:**
The ____ Secret

**Tagline #6:**
The ____ Fix 

**Tagline #7:**
The Instant ____ 

**Tagline #8:**
The Ultimate ____ 

## Tagline Rules:
- If possible, use alliteration
- Use direct and engaging words, with appropriate style and tone for my niche.
- Make sure each title conveys a specific benefit or end result
- Make sure each title makes my [INSERT PRODUCT OR SERVICE] sound unique and specific
- Follow the structure exactly.
- Use direct and engaging words, with an appropriate style and tone for the Avatar.
- Write using simple, conversational language. At a 5th grade reading level. Short, punchy, easy to read sentences and action oriented. Short paragraphs. Limit words with more than 4 syllables. 
- Write using active, visual, visceral, direct language. Limit/avoid passive constructions.
- The Avatar should be able to see, feel, and experience what you're describing.
- Amplify the emotional impact without using jargon or tropes. Always be direct without adjectives.
- Do this in a focused and relaxed state of flow without cutting corners, summarizing too much, or leaving out important details.`;
    } else if (field === 'introduction') {
      prompt = `Ok, now I need to create a simple landing page that convinces my target audience to buy this ${product?.name || '[PRODUCT OR SERVICE]'} for just ${product?.price || '[INSERT PRICE]'}. My landing page should consist of:
A 1-2 paragraph introduction that grabs attention and creates interest in my ${product?.name || '[PRODUCT OR SERVICE]'}. You can do this by asking questions, connecting with the reader's pains or struggles, creating curiosity, or promise to share a unique and credible solution to their pain.
- Follow the structure exactly.
- Use direct and engaging words, with an appropriate style and tone for the Avatar.
- Write using simple, conversational language. At a 5th grade reading level. Short, punchy, easy to read sentences and action oriented. Short paragraphs. Limit words with more than 4 syllables. 
- Write using active, visual, visceral, direct language. Limit/avoid passive constructions.
- The Avatar should be able to see, feel, and experience what you're describing.
- Amplify the emotional impact without using jargon or tropes. Always be direct without adjectives.
- Do this in a focused and relaxed state of flow without cutting corners, summarizing too much, or leaving out important details.`;
    } else if (field === 'benefit_points') {
      prompt = `4-6 Bullet Points that convey what benefits the customer will experience after purchasing this ${product?.name || '[PRODUCT OR SERVICE]'}, use the previous paragraph introduction to help you [insert paragraph if AI tool has forgotten it]
- Follow the structure exactly.
- Use direct and engaging words, with an appropriate style and tone for the Avatar.
- Write using simple, conversational language. At a 5th grade reading level. Short, punchy, easy to read sentences and action oriented. Short paragraphs. Limit words with more than 4 syllables. 
- Write using active, visual, visceral, direct language. Limit/avoid passive constructions.
- The Avatar should be able to see, feel, and experience what you're describing.
- Amplify the emotional impact without using jargon or tropes. Always be direct without adjectives.
- Do this in a focused and relaxed state of flow without cutting corners, summarizing too much, or leaving out important details.`;
    } else if (field === 'guarantee_text') {
      prompt = `Write a guarantee statement for my ${product?.name || '[PRODUCT OR SERVICE]'} that builds trust and reduces purchase anxiety. The guarantee should be clear, specific, and emphasize the risk-free nature of the purchase.

Guidelines:
- Keep it concise but powerful (2-3 sentences maximum)
- Include specific terms (e.g., "30-day money-back guarantee")
- Use confident, reassuring language
- Address common customer concerns
- Make the refund process sound simple and hassle-free
- Avoid complex conditions or fine print
- Use active voice and direct language`;
    }

    await navigator.clipboard.writeText(prompt);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white film-grain bg-gray-900">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white film-grain bg-gray-900">
      {/* Background gradients */}
      <div 
        className="fixed inset-0 -z-20"
        style={{
          background: `
            radial-gradient(
              circle at 30% 20%,
              #b1a1e3 0%,
              rgba(177, 161, 227, 0.3) 10%,
              rgba(177, 161, 227, 0.05) 25%,
              transparent 50%
            ),
            radial-gradient(
              circle at 70% 80%,
              #b1a1e3 0%,
              rgba(177, 161, 227, 0.3) 10%,
              rgba(177, 161, 227, 0.05) 25%,
              transparent 50%
            )
          `
        }}
      />
      
      {/* Frosted Glass Overlay */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backdropFilter: 'blur(100px) saturate(150%)',
          background: 'rgba(0, 0, 0, 0.75)'
        }}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-xl font-bold">Product Sales Page Creator</h1>
          </div>
          <button
            onClick={() => navigate(`/dashboard/product/${productId}/preview`)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl hover:bg-white/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Preview Product Page
          </button>
        </div>
      </nav>

      <div className="pt-24 px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="glass-card-dark p-8 space-y-6">
            <h2 className="text-2xl font-bold">Product & Services</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Product Name
                  </label>
                  <AutosaveInput
                    value={product?.name || ''}
                    field="name"
                    placeholder="Enter product name"
                    onChange={(value) => handleProductUpdate('name', value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Price
                  </label>
                  <AutosaveInput
                    value={product?.price || ''}
                    field="price"
                    placeholder="Enter price (e.g., £99)"
                    onChange={(value) => handleProductUpdate('price', value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Purchase Type
                  </label>
                  <select
                    value={product?.purchase_type || 'link'}
                    onChange={(e) => handleProductUpdate('purchase_type', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white appearance-none cursor-pointer"
                  >
                    <option value="paypal" className="bg-gray-900">PayPal Purchase Button</option>
                    <option value="link" className="bg-gray-900">Link to Purchase Button</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    {product?.purchase_type === 'paypal' ? 'PayPal.me Username' : 'Purchase Link'}
                  </label>
                  <AutosaveInput
                    value={product?.purchase_url || ''}
                    field="purchase_url"
                    placeholder={product?.purchase_type === 'paypal' ? 'Enter PayPal.me username' : 'Enter purchase link'}
                    onChange={(value) => handleProductUpdate('purchase_url', value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Product Image
                </label>
                <div 
                  className="relative w-full h-48 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {product?.image_url ? (
                    <>
                      <img 
                        src={product.image_url}
                        alt={product.name} 
                        className="w-full h-full object-cover transition-opacity group-hover:opacity-50" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploadingImage ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Upload className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </>
                  ) : (
                    uploadingImage ? (
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
                        handleImageUpload(file);
                      }
                    }}
                    disabled={uploadingImage}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card-dark p-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Sales Page Content</h2>
              <p className="text-white/70">
                Each field for your Product Sales Page contains an AI prompt to help you write the required copy for the page. 
                Simply click on each field's label to copy the preset prompt to your clipboard, and paste it into your preferred AI tool 
                (Chat GPT, Claude, Gemini etc.) Feel free to edit as you wish, and use the content of the prompt to help you understand 
                the copy that's required for each section of your Product Sales Page.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Headline Hook
                </label>
                <AutosaveInput
                  value={salesContent.headline_hook}
                  field="headline_hook"
                  placeholder="Copy AI PROMPT"
                  onChange={(value) => handleContentChange('headline_hook', value)}
                  onPlaceholderClick={() => handlePlaceholderClick('headline_hook')}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Tagline
                </label>
                <AutosaveInput
                  value={salesContent.tagline}
                  field="tagline"
                  placeholder="Copy AI PROMPT"
                  onChange={(value) => handleContentChange('tagline', value)}
                  onPlaceholderClick={() => handlePlaceholderClick('tagline')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                Introduction
              </label>
              <AutosaveInput
                type="textarea"
                value={salesContent.introduction}
                field="introduction"
                placeholder="Copy AI PROMPT"
                onChange={(value) => handleContentChange('introduction', value)}
                onPlaceholderClick={() => handlePlaceholderClick('introduction')}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-white/70">
                  Benefit Points
                </label>
                <button
                  onClick={addBenefitPoint}
                  className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Point
                </button>
              </div>
              <div className="space-y-2">
                {salesContent.benefit_points.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <AutosaveInput
                      value={point}
                      field={`benefit_points.${index}`}
                      placeholder="Copy AI PROMPT"
                      onChange={(value) => {
                        const newPoints = [...salesContent.benefit_points];
                        newPoints[index] = value;
                        handleContentChange('benefit_points', newPoints);
                      }}
                      onPlaceholderClick={() => handlePlaceholderClick('benefit_points')}
                    />
                    <button
                      onClick={() => removeBenefitPoint(index)}
                      className="p-2 text-white/50 hover:text-white/70 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                Guarantee
              </label>
              <AutosaveInput
                type="textarea"
                value={salesContent.guarantee_text}
                field="guarantee_text"
                placeholder="Copy AI PROMPT"
                onChange={(value) => handleContentChange('guarantee_text', value)}
                onPlaceholderClick={() => handlePlaceholderClick('guarantee_text')}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-white/70">
                  Testimonials
                </label>
                <button
                  onClick={addTestimonial}
                  className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Testimonial
                </button>
              </div>
              <div className="space-y-4">
                {salesContent.testimonials.map((testimonial, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <AutosaveInput
                        value={testimonial.name}
                        field={`testimonials.${index}.name`}
                        placeholder="Reviewer name"
                        onChange={(value) => {
                          const newTestimonials = [...salesContent.testimonials];
                          newTestimonials[index] = { ...testimonial, name: value };
                          handleContentChange('testimonials', newTestimonials);
                        }}
                      />
                      <button
                        onClick={() => removeTestimonial(index)}
                        className="p-2 text-white/50 hover:text-white/70 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <AutosaveInput
                      type="textarea"
                      value={testimonial.content}
                      field={`testimonials.${index}.content`}
                      placeholder="Testimonial review"
                      onChange={(value) => {
                        const newTestimonials = [...salesContent.testimonials];
                        newTestimonials[index] = { ...testimonial, content: value };
                        handleContentChange('testimonials', newTestimonials);
                      }}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                Product Explainer Video
              </label>
              <AutosaveInput
                value={salesContent.explainer_video}
                field="explainer_video"
                placeholder="Youtube or Vimeo link - - click me for an amazing video script prompt"
                onChange={(value) => handleContentChange('explainer_video', value)}
                onPlaceholderClick={() => {
                  const prompt = `In my life, / career I've noticed... [write the main unique observation related to your problem] 

It's challenging / difficult to… [what, therefore the problem is]

I really wanted to… [description of your ideal world with the problem solved i.e. what ideally did you want to happen, but couldn't achieve?]

What I decided to do about it…  [i.e. create this product / service which helps solve the xyz problem in this way]

The approach that followed from this decision… [features of your product / service i.e. what makes your product / service unique]

What I realised from the journey… [main feature / approach of product / service] is the best way to [main benefit you're trying to give to clients / the world]

Why this is important… [double down on the importance of the benefit(s) especially in this day and age of xyz, describe the impacts of the benefits you're solving for]

How to access my products/services… [call to action / how to work with you / buy your product or service]`;
                  
                  navigator.clipboard.writeText(prompt);
                  setShowCopyToast(true);
                  setTimeout(() => setShowCopyToast(false), 2000);
                }}
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                Value Proposition
              </label>
              <AutosaveInput
                type="textarea"
                value={salesContent.value_proposition}
                field="value_proposition"
                placeholder="Copy AI PROMPT"
                onChange={(value) => handleContentChange('value_proposition', value)}
                onPlaceholderClick={() => handlePlaceholderClick('value_proposition')}
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>

      {showCopyToast && (
        <div className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white shadow-lg transition-all animate-fade-in">
          <Check className="w-4 h-4 text-green-400" />
          <span>AI prompt copied to clipboard</span>
        </div>
      )}
    </div>
  );
}