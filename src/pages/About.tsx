import { Layout } from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            About NcsMemories
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed">
              NcsMemories is a digital archive dedicated to preserving the cherished moments 
              of our school community. From farewells to annual days, cultural events to 
              sports achievements, we capture and celebrate the journey of every student 
              who has been part of our family.
            </p>

            <div className="mt-12 p-8 rounded-xl bg-secondary/50 border border-border">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground">
                To create a lasting digital legacy that connects past, present, and future 
                generations of our school community. Every photo tells a story, and every 
                memory deserves to be preserved.
              </p>
            </div>

            <div className="mt-8 p-8 rounded-xl bg-primary/5 border border-primary/10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                The Network
              </h2>
              <p className="text-muted-foreground">
                NcsMemories serves multiple school branches across the country, 
                allowing each campus to maintain their unique collection of memories 
                while being part of a larger community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
