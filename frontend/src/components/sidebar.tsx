function Sidebar() {
  return (
    <div className="h-screen w-64 bg-blue-600 text-white p-5">

      <h1 className="text-xl font-bold mb-8">
        AI Study Assistant
      </h1>

      <nav className="space-y-4">

        <p>🏠 Dashboard</p>

        <p>📚 Study Spaces</p>

        <p>➕ New Study Space</p>

        <p>📈 Progress</p>

        <p>👤 Profile</p>

        <p>🚪 Logout</p>

      </nav>

    </div>
  );
}

export default Sidebar;