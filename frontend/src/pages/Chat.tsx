import React from 'react';
import Navbar from '@/components/Navbar';
import AIChat from '@/components/AIChat';

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant help with finding products, learning about our artisans, 
            or answering questions about Artist Bazaar. Our AI assistant is here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              🛍️ Product Discovery
            </h3>
            <p className="text-gray-600 mb-4">
              Ask me to help you find specific products, browse categories, 
              or get recommendations based on your preferences.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• "Show me pottery items"</p>
              <p>• "Find gifts under ₹1000"</p>
              <p>• "What jewelry do you have?"</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              👨‍🎨 Artisan Stories
            </h3>
            <p className="text-gray-600 mb-4">
              Learn about our talented artisans, their craft techniques, 
              and the stories behind their handmade creations.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• "Tell me about pottery artisans"</p>
              <p>• "How are these items made?"</p>
              <p>• "What makes this special?"</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              🚚 Order Support
            </h3>
            <p className="text-gray-600 mb-4">
              Get help with orders, shipping information, returns, 
              and any questions about your purchase.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• "When will my order arrive?"</p>
              <p>• "How do I track my package?"</p>
              <p>• "What's your return policy?"</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              💡 General Help
            </h3>
            <p className="text-gray-600 mb-4">
              Ask me anything about Artist Bazaar, our mission, 
              or how to get the most out of your shopping experience.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• "How does Artist Bazaar work?"</p>
              <p>• "What makes you different?"</p>
              <p>• "How can I become a seller?"</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 mb-4">
            The AI chat assistant is available in the bottom-right corner of your screen.
            Click on it to start chatting!
          </p>
        </div>
      </div>

      <AIChat />
    </div>
  );
};

export default Chat;
