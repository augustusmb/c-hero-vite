import PropTypes from "prop-types";
import UserInfoStatic from "./UserInfoStatic.jsx";
import UserProductsStatic from "./UserProductsStatic.jsx";

const AdminEditUserStatic = ({
  userInfo: user,
  toggleEditMode,
  editMode,
  data,
}) => {
  return (
    <div className="grid grid-cols-6">
      <div className="col-span-3">
        <h3 className="font-bold underline">Account Info</h3>
        <UserInfoStatic userInfo={user} />
      </div>
      <div className="col-span-2">
        <h3 className="font-bold underline">Account Assigned Products</h3>
        <UserProductsStatic userProductData={data} />
      </div>
      <div>
        <h3 className="font-bold underline">Click to Edit User</h3>
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => toggleEditMode(!editMode)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

AdminEditUserStatic.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    vessel: PropTypes.string,
    port: PropTypes.string,
    id: PropTypes.number,
  }),
  toggleEditMode: PropTypes.func,
  editMode: PropTypes.bool,
  data: PropTypes.object,
};

export default AdminEditUserStatic;
