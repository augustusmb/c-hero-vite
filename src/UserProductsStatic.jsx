import PropTypes from "prop-types";

const UserProductsStatic = (props) => {
  const { userProductData } = props;
  return (
    <div className="flex flex-col items-start">
      {Object.values(userProductData).map((product) => {
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
  );
};

UserProductsStatic.propTypes = {
  userProductData: PropTypes.object,
};

export default UserProductsStatic;
