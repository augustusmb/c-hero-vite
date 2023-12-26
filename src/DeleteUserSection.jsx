import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const DeleteUserSection = () => {
  const [fetchedUserData, setFetchedUserData] = useState({ name: "" });
  const [userSearched, setUserSearched] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const { handleSubmit, register, reset } = useForm();

  const retrieveUser = async (data) => {
    const fetchedUser = await axios.get("/api/routes/users", {
      params: { phone: data["Phone Number"] },
    });
    setUserFound(!!fetchedUser.data[0]);
    setUserSearched(!userSearched);
    setFetchedUserData(fetchedUser.data[0]);
    reset();
  };

  const retrieveUserForm = () => {
    return (
      <div>
        <h3>Retrieve User for possible deletion from database</h3>
        <form onSubmit={handleSubmit(retrieveUser)}>
          <label>Phone Number:</label>
          <input
            type="text"
            placeholder="Phone Number"
            {...register("Phone Number")}
          ></input>
          <input
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          />
          <p>
            {userSearched ? (userFound ? "User Found" : "No User Found") : ""}
          </p>
        </form>
      </div>
    );
  };

  const deleteUserForm = () => {
    return (
      <form onSubmit={handleSubmit(deleteUser)}>
        <div>
          <p className={{ font: "bg-red-600" }}>
            Are you sure you want to delete this user?
          </p>
          <p>{`Name: ${fetchedUserData.name}`}</p>
          <p>{`Port: ${fetchedUserData.port}`}</p>
          <p>{`Vessel: ${fetchedUserData.vessel}`}</p>
          <input
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          />
        </div>
      </form>
    );
  };

  const deleteUser = () => {
    axios.delete("/api/routes/users", {
      params: { phone: fetchedUserData.phone },
    });

    setUserFound(false);
    setUserSearched(false);
    setFetchedUserData({ name: "" });

    alert("User Deleted!");
    reset();
  };

  return (
    <div>
      <div>{retrieveUserForm()}</div>
      <div>{userFound ? deleteUserForm() : ""}</div>
    </div>
  );
};

export default DeleteUserSection;
