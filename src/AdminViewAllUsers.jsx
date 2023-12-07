import { useQuery } from "@tanstack/react-query";
import { PropTypes } from "prop-types";
import { fetchAllUsers } from "./api/user";

const AdminFetchAllUsers = (props) => {
  const { handleUserToEdit } = props;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: fetchAllUsers,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <div className="grid justify-items-start underline">
        <h3 className="font-bold">Click a below user to edit their info</h3>
      </div>
      <div className="grid justify-items-start">
        {data.data?.map((user) => (
          <button key={user.id} onClick={() => handleUserToEdit(user)}>
            {user.name}
          </button>
        ))}
      </div>
    </div>
  );
};

AdminFetchAllUsers.propTypes = {
  handleUserToEdit: PropTypes.func,
};

export default AdminFetchAllUsers;
