import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';

export function ProductPreviewPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Example content - in production this would come from your database
  const exampleContent = {
    headline_hook: "How to Transform Your Business in 30 Days Without Spending a Fortune",
    tagline: "The Ultimate Growth Blueprint",
    introduction: "Are you tired of watching your competitors zoom past while your business stays stuck in neutral? You're not alone. Every day, countless entrepreneurs struggle with the same challenge: how to grow their business without burning through their savings. But here's the thing - what if I told you that explosive growth isn't about how much money you spend, but about where and how you spend it?",
    benefit_points: [
      "Master the art of low-cost, high-impact marketing strategies that bring in real customers",
      "Learn the exact system I used to grow my business by 300% in just 90 days",
      "Get access to my private rolodex of tools and resources that save both time and money",
      "Discover how to automate 80% of your daily tasks without hiring a single employee"
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        content: "I was skeptical at first, but after implementing just two of the strategies, my monthly revenue doubled. This is the real deal!"
      },
      {
        name: "Michael Chen",
        content: "The automation section alone saved me 20 hours per week. Now I can focus on actually growing my business instead of just running it."
      },
      {
        name: "Lisa Rodriguez",
        content: "Finally, a program that delivers actual results. My ROI was positive within the first month!"
      }
    ],
    value_proposition: "Consider this: most business growth programs cost $5,000 or more, and many don't even include personal support. You're getting a complete transformation system, proven to work across multiple industries, plus direct access to me for questions and guidance - all for a fraction of what you'd pay for traditional consulting.",
    price: "£997",
    guarantee: "100% Money-Back Guarantee: If you don't see measurable growth in your business within 30 days of implementing these strategies, I'll refund every penny. No questions asked.",
    contact: {
      email: "support@example.com",
      phone: "+44 20 1234 5678",
      schedule: "https://calendly.com/example"
    }
  };

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
          <button
            onClick={() => navigate(`/dashboard/product/${productId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Creator
          </button>
        </div>
      </nav>

      <div className="pt-24 px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content (65%) */}
          <div className="lg:col-span-3 space-y-12">
            {/* Headline & Tagline */}
            <div className="space-y-4">
              <h2 className="text-3xl text-white/90 font-medium">{exampleContent.headline_hook}</h2>
              <h1 className="text-5xl font-[800]" style={{ fontFamily: 'Syne' }}>{exampleContent.tagline}</h1>
            </div>

            {/* Introduction */}
            <div className="glass-card-dark p-8">
              <p className="text-lg text-white/90 leading-relaxed">
                {exampleContent.introduction}
              </p>
            </div>

            {/* Benefit Points */}
            <div className="glass-card-dark p-8 space-y-4">
              {exampleContent.benefit_points.map((point, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">{index + 1}</span>
                  </div>
                  <p className="text-lg text-white/90">{point}</p>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="glass-card-dark p-8">
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
                  {exampleContent.testimonials.map((testimonial, index) => (
                    <div 
                      key={index}
                      className="flex-none w-full snap-center"
                    >
                      <blockquote className="space-y-4">
                        <p className="text-lg text-white/90 italic">"{testimonial.content}"</p>
                        <footer className="text-white/70">— {testimonial.name}</footer>
                      </blockquote>
                    </div>
                  ))}
                </div>
                <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar (35%) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Image */}
            <div className="glass-card-dark p-8">
              <img 
                src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&h=600&fit=crop" 
                alt="Product" 
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>

            {/* Price & CTA */}
            <div className="glass-card-dark p-8 space-y-6">
              <div className="text-center">
                <span className="text-4xl font-bold">{exampleContent.price}</span>
                <span className="text-white/70 ml-2">one-time payment</span>
              </div>
              <button className="w-full py-4 bg-white text-black rounded-xl hover:bg-white/90 transition-colors font-medium">
                Get Started Now
              </button>
              <p className="text-sm text-white/50 text-center">
                {exampleContent.guarantee}
              </p>
            </div>

            {/* Value Proposition */}
            <div className="glass-card-dark p-8">
              <p className="text-white/90">
                {exampleContent.value_proposition}
              </p>
            </div>

            {/* Contact Information */}
            <div className="glass-card-dark p-8 space-y-4">
              <h3 className="text-xl font-semibold">Contact Information</h3>
              <div className="space-y-2">
                <p className="text-white/90">Email: {exampleContent.contact.email}</p>
                <p className="text-white/90">Phone: {exampleContent.contact.phone}</p>
                <a 
                  href={exampleContent.contact.schedule}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Schedule a Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}