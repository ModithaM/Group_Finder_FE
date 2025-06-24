"use client"

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  const handleTryNow = () => {
    router.push('/register');
  };

  const stats = [
    { label: 'Active Students', value: '1,200+' },
    { label: 'Projects Created', value: '350+' },
    { label: 'Successful Teams', value: '280+' },
    { label: 'Technologies', value: '50+' }
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Smart Project Discovery',
      description: 'Find projects that match your skills and interests with our intelligent filtering system.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Team Building Made Easy',
      description: 'Create your project and let skilled students find you, or join existing teams instantly.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Skill-Based Matching',
      description: 'Filter by Frontend, Backend, or Full-Stack technologies to find the perfect fit.'
    }
  ];

  const technologies = [
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git'
  ];

  return (
    <div>
      <Header></Header>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Perfect
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Project Team
                </span>
                at SLIIT
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Connect with talented students, discover exciting projects, and build amazing things together.
                Whether you're looking to join a team or create your own project, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleTryNow}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Try Now
                </button>
                <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose SLIIT GroupFinder?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Built specifically for SLIIT students to make project collaboration seamless and efficient.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-indigo-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Filter Preview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Filter by Technology
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Find projects that match your skills - Frontend, Backend, or Full-Stack
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors cursor-pointer"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Next Project?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of SLIIT students who are already building amazing projects together.
              </p>
              <button
                onClick={handleTryNow}
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
}
