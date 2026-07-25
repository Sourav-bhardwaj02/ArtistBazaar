import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Palette, Award, Leaf, Target } from "lucide-react";
import heroImage from "@/assets/hero-about.jpg";
import processImage from "@/assets/process-image.jpg";
import teamImage from "@/assets/team-image.jpg";
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
          <div className="absolute inset-0 bg-gradient-to-r from-artist-earth/80 to-artist-orange/60" />
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              About Artist Bazar
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Where creativity meets community, and every piece tells a story
            </p>
          </div>
        </section>

        {/* Who You Are Section */}
        <section className="py-20 bg-gradient-warm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-6 bg-artist-orange text-white">Our Story</Badge>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Born from a passion for authentic artistry
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Founded in 2019 by a collective of artists and craftspeople, Artist Bazar emerged from a simple belief:
                  that handmade, authentic creations deserve a platform that honors their uniqueness and connects them
                  with people who truly appreciate artistry.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our mission is to bridge the gap between talented creators and conscious consumers, fostering a
                  marketplace where creativity thrives, craftsmanship is celebrated, and every purchase supports
                  an artist's dream.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-artist-orange rounded-full flex items-center justify-center mx-auto mb-3">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Authenticity</h3>
                    <p className="text-sm text-muted-foreground">Every piece is genuinely handcrafted</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-artist-gold rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Community</h3>
                    <p className="text-sm text-muted-foreground">Supporting artists worldwide</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-artist-warm rounded-full flex items-center justify-center mx-auto mb-3">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Sustainability</h3>
                    <p className="text-sm text-muted-foreground">Eco-conscious practices</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Card className="shadow-warm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                    <p className="text-muted-foreground mb-6">
                      To create the world's most trusted marketplace for authentic, handcrafted art and goods,
                      where every creator can build a sustainable living from their passion.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-artist-orange" />
                        <span className="text-sm">Empower 10,000+ artists by 2025</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-artist-orange" />
                        <span className="text-sm">Foster meaningful connections</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-artist-orange" />
                        <span className="text-sm">Champion quality craftsmanship</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What You Do Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-artist-gold text-white">What We Do</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Curating authentic artistry from around the world
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We specialize in handcrafted goods that tell stories - from pottery and textiles to jewelry and home décor,
                each piece is carefully selected for its quality, uniqueness, and the passion behind its creation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Handmade Pottery", desc: "Unique ceramics and pottery from skilled artisans" },
                { title: "Textile Arts", desc: "Beautiful fabrics, rugs, and woven masterpieces" },
                { title: "Artisan Jewelry", desc: "One-of-a-kind pieces crafted with precious materials" },
                { title: "Home Décor", desc: "Curated items that transform spaces with artistry" }
              ].map((item, idx) => (
                <Card key={idx} className="shadow-soft hover:shadow-warm transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-hero rounded-full mx-auto mb-4"></div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose You Section */}
        <section className="py-20 bg-gradient-section">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-artist-orange text-white">Why Artist Bazar</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Your trusted partner in authentic artistry
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="shadow-soft">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-artist-orange rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Quality Guaranteed</h3>
                  <p className="text-muted-foreground mb-4">
                    Every item is personally vetted by our team of art experts and comes with our quality guarantee.
                  </p>
                  <Badge variant="outline">Certified Authentic</Badge>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-artist-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">98% Satisfaction</h3>
                  <p className="text-muted-foreground mb-4">
                    Our customers love what they receive, with 98% satisfaction rate and thousands of happy reviews.
                  </p>
                  <Badge variant="outline">5-Star Rated</Badge>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-artist-warm rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Fair Trade</h3>
                  <p className="text-muted-foreground mb-4">
                    We ensure artists receive fair compensation for their work, supporting sustainable livelihoods.
                  </p>
                  <Badge variant="outline">Ethically Sourced</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Behind the Brand Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                src={teamImage} 
                alt="Artist Bazar founding team" 
                className="rounded-lg shadow-warm w-full"
              />
              </div>
              <div>
                <Badge className="mb-6 bg-artist-warm text-white">Our Team</Badge>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Meet the passionate minds behind Artist Bazar
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our founding team brings together decades of experience in art curation, fair trade practices,
                  and e-commerce innovation. United by a shared love for authentic craftsmanship, we work
                  tirelessly to connect artists with appreciative customers worldwide.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground">Maya Chen - Co-Founder & Curator</h3>
                    <p className="text-muted-foreground">Former gallery director with 15+ years in art curation</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Marcus Rodriguez - Co-Founder & Operations</h3>
                    <p className="text-muted-foreground">Fair trade advocate and sustainable business strategist</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Aisha Patel - Head of Artist Relations</h3>
                    <p className="text-muted-foreground">Artisan advocate connecting creators globally</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Process Section */}
        <section className="py-20 bg-gradient-warm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-artist-orange text-white">Our Process</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                From artist's hands to your home
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Every piece in our marketplace follows a careful journey of creation, curation, and quality assurance.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <img 
                src={processImage} 
                alt="Artisan creation process" 
                className="rounded-lg shadow-warm w-full"
              />
              </div>
              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Artist Vetting",
                    desc: "We personally meet and vet every artist, ensuring authentic craftsmanship and ethical practices."
                  },
                  {
                    step: "02",
                    title: "Creation Process",
                    desc: "Artists create each piece by hand using traditional techniques passed down through generations."
                  },
                  {
                    step: "03",
                    title: "Quality Check",
                    desc: "Our experts inspect every item for quality, authenticity, and adherence to our standards."
                  },
                  {
                    step: "04",
                    title: "Careful Packaging",
                    desc: "Items are lovingly packaged with sustainable materials and shipped directly to you."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-artist-orange text-white rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Your Impact Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-artist-gold text-white">Our Impact</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Creating positive change through art
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Beyond beautiful products, we're building a movement that supports artists, preserves traditions,
                and promotes sustainable practices.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "2,500+", label: "Artists Supported", icon: Users },
                { number: "50,000+", label: "Happy Customers", icon: Heart },
                { number: "15", label: "Countries Reached", icon: Target },
                { number: "100%", label: "Fair Trade", icon: Award }
              ].map((stat, idx) => (
                <Card key={idx} className="shadow-soft text-center">
                  <CardContent className="p-6">
                    <stat.icon className="w-8 h-8 text-artist-orange mx-auto mb-4" />
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Card className="shadow-warm bg-gradient-section">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Supporting Local Communities
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    10% of our profits go directly to artisan community development programs,
                    providing education, healthcare, and sustainable business training.
                  </p>
                  <Badge className="bg-artist-orange text-white">Community First</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to discover authentic artistry?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of art lovers who have found their perfect pieces.
              Explore our curated collection and support artists worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-artist-cream text-lg px-8 py-6"
              >
                Explore Our Collection
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-primary hover:bg-white hover:text-artist-orange text-lg px-8 py-6"
              >
                Become an Artist Partner
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;