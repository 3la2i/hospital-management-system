import { Clock, MessageCircle, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DoctorPostsPage = () => {
  const posts = [
    {
      id: 1,
      title: 'A passion for putting patients first',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: 'https://t4.ftcdn.net/jpg/02/93/45/41/360_F_293454165_n9YnWJi0aUAvu4guNI24ee2O6Burp4aT.jpg',
      date: '2 days ago',
      comments: 5
    },
    {
      id: 2,
      title: 'A passion for putting patients first',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: 'https://t4.ftcdn.net/jpg/02/93/45/41/360_F_293454165_n9YnWJi0aUAvu4guNI24ee2O6Burp4aT.jpg',
      date: '3 days ago',
      comments: 3
    },
    {
      id: 3,
      title: 'A passion for putting patients first',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: 'https://t4.ftcdn.net/jpg/02/93/45/41/360_F_293454165_n9YnWJi0aUAvu4guNI24ee2O6Burp4aT.jpg',
      date: '4 days ago',
      comments: 7
    },
    {
      id: 4,
      title: 'A passion for putting patients first',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: 'https://t4.ftcdn.net/jpg/02/93/45/41/360_F_293454165_n9YnWJi0aUAvu4guNI24ee2O6Burp4aT.jpg',
      date: '5 days ago',
      comments: 2
    },
  ];

  const recentPosts = [
    'A passion for putting patients first',
    'The importance of preventive care',
    'Advancements in medical technology',
    'The role of nutrition in health',
  ];

  const categories = ['Health', 'Wellness', 'Medical', 'Technology', 'Nutrition'];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
  <Header/>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
    <div
        className="bg-cover bg-center h-96 flex items-center justify-start text-white mb-5 px-20"
        style={{
        backgroundImage: "url('https://www.osmindenture.com/wp-content/uploads/2020/11/dental-crown-1200x565.jpg')",
        }}
    >
        <h1 className="text-4xl font-bold text-blue-600 ">blog posts</h1>
    </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Posts */}
          <div className="md:w-2/3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-84 object-cover" />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle size={16} className="mr-1" />
                      <span>{post.comments} Comments</span>
                    </div>
                  </div>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3">
            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
              <ul>
                {recentPosts.map((post, index) => (
                  <li key={index} className="mb-2">
                    <a href="#" className="text-blue-600 hover:underline flex items-center">
                      <ChevronRight size={16} className="mr-1" />
                      {post}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <ul>
                {categories.map((category, index) => (
                  <li key={index} className="mb-2">
                    <a href="#" className="text-blue-600 hover:underline flex items-center">
                      <ChevronRight size={16} className="mr-1" />
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
     <Footer/>
    </div>
  );
};

export default DoctorPostsPage;