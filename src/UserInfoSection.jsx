import { useState, useRef } from "react";

import axios from "axios";
import { PropTypes } from "prop-types";

const UserInfoSection = (props) => {
  let [editMode, setEditMode] = useState(false);
  const { userInfo, toggleEditMode } = props;
  const formRef = useRef(null);

  function triggerEditMode() {
    setEditMode(!editMode);
  }

  const updateUserInfoToDatabase = () => {
    let name = formRef.current["name"].value || userInfo.name;
    let email = formRef.current["email"].value || userInfo.email;
    let title = formRef.current["title"].value || userInfo.title_function;
    let company = formRef.current["company"].value || userInfo.company;
    let vessel = formRef.current["vessel"].value || userInfo.vessel;
    let port = formRef.current["port"].value || userInfo.port;

    let updatedUserInfo = {
      id: userInfo.id,
      name,
      email,
      title,
      company,
      vessel,
      port,
    };

    axios.put("/api/routes/users", { params: updatedUserInfo }).then(() => {});
    setEditMode(false);
    toggleEditMode(2);
  };

  return (
    <div>
      {!editMode ? (
        <div className="grid grid-cols-2">
          <label htmlFor="Name">Name:</label>
          <div>{userInfo.name}</div>
          <label htmlFor="Email">Email:</label>
          <div>{userInfo.email}</div>
          <div htmlFor="Title">Title:</div>
          <div>{userInfo.title_function}</div>
          <div htmlFor="Company">Company:</div>
          <div>{userInfo.company}</div>
          <div htmlFor="Vessel">Vessel:</div>
          <div>{userInfo.vessel}</div>
          <div htmlFor="Port">Port:</div>
          <div>{userInfo.port}</div>
        </div>
      ) : (
        <form ref={formRef}>
          <div className="grid grid-cols-2">
            <label htmlFor="name">Name:</label>
            <input placeholder={userInfo.name} type="text" name="name" />
            <label htmlFor="email">Email:</label>
            <input placeholder={userInfo.email} type="text" name="email" />
            <label htmlFor="title">Title:</label>
            <input
              placeholder={userInfo.title_function}
              type="text"
              name="title"
            />
            <label htmlFor="company">Company:</label>
            <input placeholder={userInfo.company} type="text" name="company" />
            <label htmlFor="vessel">Vessel:</label>
            <input placeholder={userInfo.vessel} type="text" name="vessel" />
            <label htmlFor="port">Port:</label>
            <input placeholder={userInfo.port} type="text" name="port" />
          </div>
        </form>
      )}
      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        onClick={() => triggerEditMode()}
      >
        {editMode ? `Cancel` : `Edit`}
      </button>
      {editMode ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={() => updateUserInfoToDatabase()}
        >
          Save
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

UserInfoSection.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    title_function: PropTypes.string,
    company: PropTypes.string,
    vessel: PropTypes.string,
    port: PropTypes.string,
    id: PropTypes.number,
  }),
  toggleEditMode: PropTypes.func,
};

export default UserInfoSection;
