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
    <div className="grid grid-cols-3">
      <div className="col-span-2">
        <h3 className="font-bold underline">Account Info</h3>
        <UserInfoStatic userInfo={user} />
      </div>
      <div className="col-span-1">
        <h3 className="font-bold underline">Account Assigned Products</h3>
        <UserProductsStatic userProductData={data} />
      </div>
      <div className="items-center col-span-2">
        <button
          className="bg-slate-050 hover:bg-slate-600 text-slate-950 font-semibold hover:text-slate-050 py-1 px-3 border border-slate-500 hover:border-transparent rounded"
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
