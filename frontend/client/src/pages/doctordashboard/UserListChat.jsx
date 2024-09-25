
const UserListChat = ({ users, onSelectUser }) => {
  return (
    <div className="w-1/4 bg-white border-r border-gray-300">
    <h2 className="text-lg font-semibold text-center text-white p-4 bg-[#34a5b1]">Users</h2>
    {users.length > 0 ? (
      <ul className="overflow-y-auto h-full">
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="p-4 cursor-pointer hover:bg-gray-200 border-b border-gray-300"
          >
            <div className="font-bold">{user.name}</div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="flex justify-center items-center h-full text-gray-500 text-lg text-center">
        No users available at the moment.
      </div>
    )}
  </div>
  
  );
};

export default UserListChat;
