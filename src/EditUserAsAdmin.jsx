import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { getFullUserProductProgressMap } from "./utils/utils.js";
import { updateUserInfo } from "./api/user.js";
import { labels } from "./messages";

const EditUserAsAdmin = (props) => {
  const { userInfo: user, handleUserToEdit } = props;
  const [editMode, setEditMode] = useState(false);
  const formRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["edit-user", user.id],
    queryFn: getFullUserProductProgressMap,
  });

  const updateUserMutation = useMutation({
    mutationFn: (updatedUserInfo) => {
      updateUserInfo(updatedUserInfo);
    },
    onSuccess: () => {
      // this mutation query will make the above postsQuery out of date, so we use onSuccess function to invalidate it
      queryClient.invalidateQueries(["all-users"]);
    },
  });

  const handleSaveClick = () => {
    let name = formRef.current["name"].value || user.name;
    let email = formRef.current["email"].value || user.email;
    let title = formRef.current["title"].value || user.title;
    let company = formRef.current["company"].value || user.company;
    let vessel = formRef.current["vessel"].value || user.vessel;
    let port = formRef.current["port"].value || user.port;

    let updatedUserInfo = {
      id: user.id,
      name,
      email,
      title,
      company,
      vessel,
      port,
    };
    updateUserMutation.mutate(updatedUserInfo);
    handleUserToEdit(Object.assign(user, updatedUserInfo));
    setEditMode(!editMode);
    navigate("/admin");
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="col-span-3">
      <h3 className="underline font-bold">Edit User Info Below</h3>
      <div>
        {!editMode ? (
          <div className="grid grid-cols-6 justify-items-start">
            <div className="flex flex-col items-start">
              {labels.map((label) => (
                <label htmlFor={label} key={label}>
                  {label}:
                </label>
              ))}
            </div>
            <div className="flex flex-col items-start col-span-2">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.title}</p>
              <p>{user.company}</p>
              <p>{user.vessel}</p>
              <p>{user.port}</p>
            </div>
            <div className="col-span-3 flex flex-col items-start">
              {Object.values(data).map((product) => {
                return (
                  <div key={product.productId}>
                    <label>
                      <input
                        type="checkbox"
                        name={product.productId}
                        checked={product.assigned}
                        disabled
                      />
                      {` ${product.productName}`}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form ref={formRef}>
            <div className="grid grid-cols-6 justify-items-start">
              <div className="flex flex-col items-start">
                {labels.map((label) => (
                  <label htmlFor={label} key={label}>
                    {label}:
                  </label>
                ))}
              </div>
              <div className="flex flex-col items-start col-span-2">
                <input placeholder={user.name} type="text" name="name" />
                <input placeholder={user.email} type="text" name="email" />
                <input placeholder={user.title} type="text" name="title" />
                <input placeholder={user.company} type="text" name="company" />
                <input placeholder={user.vessel} type="text" name="vessel" />
                <input placeholder={user.port} type="text" name="port" />
              </div>
              <div className="col-span-3 flex flex-col items-start">
                {Object.values(data).map((product) => {
                  return (
                    <div key={product.productId}>
                      <label>
                        <input
                          type="checkbox"
                          name={product.productId}
                          defaultChecked={product.assigned}
                        />
                        {` ${product.productName}`}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        )}
        <button
          className="bg-transparent hover:bg-slate-500 text-slate-700 font-semibold hover:text-white py-2 px-2 border border-slate-500 hover:border-transparent rounded"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? `Cancel` : `Edit`}
        </button>
        {editMode ? (
          <button
            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-2 border border-slate-700 rounded"
            onClick={() => handleSaveClick()}
          >
            Save
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

EditUserAsAdmin.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.number,
    phone: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    vessel: PropTypes.string,
    port: PropTypes.string,
  }),
  userProductMap: PropTypes.object,
  handleUserToEdit: PropTypes.func,
};

export default EditUserAsAdmin;
