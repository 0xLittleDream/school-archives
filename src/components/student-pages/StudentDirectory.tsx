import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';

interface Student {
  name: string;
  fullName: string;
  traits: string[];
  route: string;
}

const students: Student[] = [
  { name: "Sanchit", fullName: "Sanchit Dhauchak", traits: ["Responsible", "Decisive", "Adaptable"], route: "/Sanchit2025" },
  { name: "Ayush", fullName: "Ayush Yadav", traits: ["Strong", "Steady", "Respectable"], route: "/Ayush2025" },
  { name: "Aditi", fullName: "Aditi Kumari", traits: ["Dramatic", "Expressive", "Self-assured"], route: "/Aditi2025" },
  { name: "Joseph", fullName: "Joseph Anthony Sudhakar", traits: ["Charismatic", "Intense", "Loyal"], route: "/Joseph2025" },
  { name: "Reyansh", fullName: "N. Reyansh Kumar", traits: ["Energetic", "Competitive", "Sociable"], route: "/Reyansh2025" },
  { name: "Pratyush", fullName: "Pratyush Singh", traits: ["Bold", "Blunt", "Carefree"], route: "/Pratyush2025" },
  { name: "Rudrakash", fullName: "Rudrakash Upadhyay", traits: ["Quiet", "Observant", "Explosive"], route: "/Rudrakash2025" },
  { name: "Nikhil", fullName: "Nikhil Singh", traits: ["Witty", "Focused", "Athletic"], route: "/Nikhil2025" },
  { name: "Harsh", fullName: "Harsh Kumar", traits: ["Reserved", "Dependable", "Affectionate"], route: "/Harsh2025" },
  { name: "Precious", fullName: "Precious Semwal", traits: ["Intelligent", "Quirky", "Expressive"], route: "/Precious2025" },
  { name: "Avani", fullName: "Avani Tiwari", traits: ["Confident", "Driven", "Headstrong"], route: "/Avani2025" },
  { name: "Keshu", fullName: "Keshu Rai", traits: ["Calm", "Patient", "Resilient"], route: "/Keshu2025" },
  { name: "Aparna", fullName: "S. S. V. Aparna", traits: ["Elegant", "Spontaneous", "Vibrant"], route: "/Aparna2025" },
  { name: "Deveshi", fullName: "Deveshi Giri", traits: ["Sweet", "Warm", "Impactful"], route: "/Deveshi2025" },
  { name: "Madhuri", fullName: "A. Madhuri", traits: ["Eccentric", "Fearless", "Memorable"], route: "/Madhuri2025" },
  { name: "Sahithi", fullName: "K. Sahithi", traits: ["Reliable", "Composed", "Sincere"], route: "/Sahithi2025" },
  { name: "Deepika", fullName: "Deepika Srivastava", traits: ["Gentle", "Nostalgic", "Graceful"], route: "/Deepika2025" },
  { name: "Abhinay", fullName: "Abhinay Chaudhary", traits: ["Polished", "Confident", "Courteous"], route: "/Abhinay2025" },
];

export const StudentDirectory = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Class of 2025</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Graduating Stars
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click on any name to view their personalized farewell tribute page
          </p>
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {students.map((student) => (
            <Link
              key={student.route}
              to={student.route}
              className="group relative p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Name */}
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {student.fullName}
              </h3>
              
              {/* Traits */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {student.traits.map((trait, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
