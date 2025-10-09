import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  User,
  BarChart,
  Users,
  Folder,
  Plug,
  Settings,
  LogOut,
  Search,
  Upload,
  Plus,
  Sparkles,
  CheckCircle,
  Grip,
  ChevronLeft,
  ChevronRight,
  Edit,
  Delete,
  X
} from 'lucide-react';

export default function NewDashboard() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [livePreview, setLivePreview] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);

  // Sample data
  const stats = {
    totalReach: '8.2K',
    engagement: '1,245',
    profileViews: '2.1K',
    activeProjects: '3'
  };

  const projects = [
    {
      id: 1,
      title: 'Cosmic Bloom NFT',
      description: 'An avant-garde digital art piece exploring interstellar flora.',
      views: '3.2K',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4jPBXTVFwYHeu7arNk1r7iHfdOhku7bwXuH6FayKknK-owfV-73O_iI7MUHptQUMmucOVUkYT9Ifh6S5pY7cJYE1KEQ2zA6UhvPW749m5XpGuofiFXk_9pUiVYJYEx4SKt9VDE7mQEU-uNSOEeBWYnKHc3skiD0p1ZQRR34soBLyFmrCFu-93J7k2UNshX4FPYY-d4pfgLvk5hjef92tM26nii5anmWbfw9nWnkU1hKkAFTZt6ZWbgJP-G7cJnb-KtgFHMG7uV-A'
    },
    {
      id: 2,
      title: 'Kinetic Portfolio',
      description: 'A dynamic and interactive portfolio built with cutting-edge animations.',
      views: '2.5K',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9AZAbAxdOv3rvF_Q0xG1hspqOwzhBRFh56uj1NfAnxVu-073iA67bqZErCLKUCdEcPchLzXvRAauFyqCsMEo7_1fo6PpHk5PhdOmNgrI2nIPXvMw-L2DiR1q7hV1cfyZuEpX6o4KgLDl4ZEl7BF7DYYdfwy51VRp3VrranLO36qTA9HRhqxbS63QsSm11Nf7gC-qZZiVXm50_zS8qsWbXBPvEfsr9FoaMLJ1o0x_LLZnD7mpRHf6aMpKZ7j3JCXIM69etaoL3bYQ'
    },
    {
      id: 3,
      title: 'Quantum Leap Animation',
      description: 'A short animated film exploring theoretical physics concepts.',
      views: '2.1K',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7Qzc_cF_iSzOD0cIQaZVIo-vYgxI5aSsYGiOzrgMWXtfrgty3siX0dS4tu3si0gD86saxdunK3kjuL4YmnOTxKb6aExS22VGVM9t1wdLNHPjPSzkqq4VxudD7MYgrioHsxPQa7xpZP7zznNGHDXWELiPOPY7GDBhTQAFASgURJ0DWHk2Kis09xr9GSdbqC9KEGBgeglvxbVbbrGIjpaAwzB20eFr8KcuauKpP8rv-uVHe-R-xOcQS-U_WFUBDD7EW7-oX_x74ZBA'
    }
  ];

  const networkActivity = [
    {
      id: 1,
      name: 'Sarah Lee',
      action: 'commented on your project',
      project: 'Cosmic Bloom NFT',
      time: '2 hours ago',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLwA09hZ0B2n-A_g_z_f-j_e_y_g-n-m-c_r-u-s_g_i_n_g_m_k_w_q_s_u_l_z_e_u_p_b_f_h_y_x_w_v_n_e_m_c_g=s96-c'
    },
    {
      id: 2,
      name: 'David Chen',
      action: 'liked your article',
      project: 'AI in Modern Web Design',
      time: 'Yesterday',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocK_t_g_z_f-j_e_y_g-n-m-c_r-u-s_g_i_n_g_m_k_w_q_s_u_l_z_e_u_p_b_f_h_y_x_w_v_n_e_m_c_g_t=s96-c'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      action: 'started following you',
      time: '3 days ago',
      avatar: 'https://lh3.googleusercontent.com/a-/AOh14GhR_V8eB-o_x8n8kY5z_X-Z_x5M8n_v_c_u-s_g=s96-c'
    }
  ];

  const handleDragStart = (e: React.DragEvent, item: any) => {
    setDraggedItem(item);
    e.currentTarget.classList.add('opacity-50', 'scale-105');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50', 'scale-105');
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-100', 'border-2', 'border-dashed', 'border-blue-500');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-100', 'border-2', 'border-dashed', 'border-blue-500');
  };

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('showcase-projects');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex flex-col rounded-xl shadow-lg m-4">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-mono text-sm font-bold">&lt;/&gt;</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">ShowWork</h1>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium bg-blue-600 text-white shadow-sm rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/showcase')}
          >
            <Package className="w-5 h-5 mr-3" />
            Showcase
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/analytics')}
          >
            <BarChart className="w-5 h-5 mr-3" />
            Analytics
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/community')}
          >
            <Users className="w-5 h-5 mr-3" />
            Community
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/portfolio')}
          >
            <Folder className="w-5 h-5 mr-3" />
            Portfolio
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/integrations')}
          >
            <Plug className="w-5 h-5 mr-3" />
            Integrations
          </div>
        </nav>
        
        <div className="px-4 py-2 border-t border-white/10">
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </div>
          <div 
            className="flex items-center px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/10 hover:text-white rounded-lg cursor-pointer transition-all duration-200"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Search for projects, content, or anything..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchValue('')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Live Preview</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={livePreview}
                  onChange={(e) => setLivePreview(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Upload Project
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </button>
          </div>
        </header>

        {/* Dashboard Title */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1 text-base">Here's your personal brand and portfolio overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-xs font-bold text-gray-500 tracking-wider">TOTAL REACH</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-4xl font-bold text-gray-800">{stats.totalReach}</p>
              <svg className="w-16 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 64 32">
                <path d="M0 28 L10 20 L20 25 L30 15 L40 18 L50 10 L64 5" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-sm text-green-500 mt-1">+15%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-xs font-bold text-gray-500 tracking-wider">ENGAGEMENT</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-4xl font-bold text-gray-800">{stats.engagement}</p>
              <svg className="w-16 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 64 32">
                <path d="M0 25 L10 22 L20 15 L30 18 L40 10 L50 12 L64 8" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-sm text-green-500 mt-1">+21%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-xs font-bold text-gray-500 tracking-wider">PROFILE VIEWS</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-4xl font-bold text-gray-800">{stats.profileViews}</p>
              <svg className="w-16 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 64 32">
                <path d="M0 20 L10 18 L20 12 L30 15 L40 8 L50 5 L64 2" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-sm text-green-500 mt-1">+50%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-xs font-bold text-gray-500 tracking-wider">ACTIVE PROJECTS</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-4xl font-bold text-gray-800">{stats.activeProjects}</p>
              <svg className="w-16 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 64 32">
                <path d="M0 16 L10 16 L20 16 L30 16 L40 16 L50 16 L64 16" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mt-1">Awaiting client review</p>
          </div>
        </div>

        {/* AI-Driven Insights */}
        <div className="bg-white p-4 rounded-lg shadow mt-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
              AI-Driven Insights
            </h3>
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1 rounded-full hover:bg-gray-100">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-xs">Your audience engages most with video content on Tuesdays. Consider posting your "Quantum Leap Animation" next week.</p>
              <a className="text-blue-600 text-xs font-semibold mt-1.5 inline-block hover:underline" href="#">Schedule Now</a>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-xs">"Kinetic Portfolio" is getting 30% more views from developers. Tailor your next post to this audience.</p>
              <a className="text-blue-600 text-xs font-semibold mt-1.5 inline-block hover:underline" href="#">Create Post</a>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-xs">Your profile completion score can be improved by adding skills. We've detected you might have experience in 'React' and 'Figma'.</p>
              <a className="text-blue-600 text-xs font-semibold mt-1.5 inline-block hover:underline" href="#">Add Skills</a>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Health Score */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio Health Score</h3>
              <div className="flex items-center space-x-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-blue-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeDashoffset="-15" strokeWidth="3" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-800">B+</span>
                    <span className="text-sm text-gray-500 font-semibold">Good</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">Quick Wins</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span>Add 2 more case studies to showcase your skills.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span>Update your "About Me" section with recent achievements.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span>Add video testimonials from past clients.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Recent Projects</h3>
                <a className="text-sm font-semibold text-blue-600 hover:underline" href="#">See All</a>
              </div>
              <ul className="space-y-4">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => handleDragStart(e, project)}
                    onDragEnd={handleDragEnd}
                  >
                    <Grip className="w-4 h-4 text-gray-400" />
                    <img
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover"
                      src={project.image}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-base">{project.title}</p>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                    <p className="font-semibold text-gray-800 text-base">{project.views} views</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resource & Tutorial Spotlight */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Resource & Tutorial Spotlight</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
                  <img
                    alt="Tutorial Thumbnail"
                    className="rounded-md h-32 w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9cQf_T93uG2U_s_hS1lB8fF7b-yC0pC7bX3z5nK4gM5j6bW9pY3q-R1tP2r-S-l8vW7fD_fG4hN6jB0qS-kK2aE4lH-N2eI3oA_hT-J_qR-U_fA"
                  />
                  <h4 className="font-bold mt-3">Advanced Animation in Figma</h4>
                  <p className="text-sm text-gray-500 mt-1 flex-grow">Learn how to create complex, engaging animations for your next project.</p>
                  <a className="text-blue-600 text-sm font-semibold mt-3 self-start hover:underline" href="#">Watch Tutorial</a>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
                  <img
                    alt="Article Thumbnail"
                    className="rounded-md h-32 w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcWz5_n7eS8f_p9t-O_c_g_p8lI_b7l_m-N1f_h_n_l_o_e_m_c_b_r_k_e_r_u_g_i_n_g_m_k_w_q_s_u_l_z_e_u_p_b_f_h_y_x_w_v_n_e_m_c_g"
                  />
                  <h4 className="font-bold mt-3">The Art of Storytelling in Design</h4>
                  <p className="text-sm text-gray-500 mt-1 flex-grow">Discover how to weave compelling narratives into your user experiences.</p>
                  <a className="text-blue-600 text-sm font-semibold mt-3 self-start hover:underline" href="#">Read Article</a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Content Calendar */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Content Calendar</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                  </button>
                  <span className="text-sm font-semibold">May 2024</span>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mt-4">
                <div className="font-bold text-gray-500">M</div>
                <div className="font-bold text-gray-500">T</div>
                <div className="font-bold text-gray-500">W</div>
                <div className="font-bold text-gray-500">T</div>
                <div className="font-bold text-gray-500">F</div>
                <div className="font-bold text-gray-500">S</div>
                <div className="font-bold text-gray-500">S</div>
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 1;
                  const isCurrentMonth = day >= 0 && day < 31;
                  const isToday = day === 11;
                  const hasEvent = day === 2 || day === 13;
                  
                  return (
                    <div
                      key={i}
                      className={`min-h-[40px] py-2 cursor-pointer hover:border hover:border-blue-500 ${
                        isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                      } ${isToday ? 'bg-blue-600 text-white rounded-full font-bold' : ''} relative`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      {isCurrentMonth && day + 1}
                      {hasEvent && !isToday && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Network Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Network Activity</h3>
              <ul className="space-y-4">
                {networkActivity.map((activity) => (
                  <li key={activity.id} className="flex items-start space-x-3">
                    <img
                      alt="User avatar"
                      className="w-10 h-10 rounded-full object-cover"
                      src={activity.avatar}
                    />
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">{activity.name}</span> {activity.action}
                        {activity.project && (
                          <a className="text-blue-600 font-semibold hover:underline" href="#">"{activity.project}"</a>
                        )}
                        .
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

