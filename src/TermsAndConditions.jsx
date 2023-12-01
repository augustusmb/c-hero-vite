import { PropTypes } from "prop-types";

const TermsAndConditions = (props) => {
  const { acceptTermsMutation, userId } = props;

  return (
    <div className="border-double border-4 border-sky-500 flex">
      <form>
        <h1 className="font-bold text-xl underline">
          C-Hero eTraining Terms and Condtions
        </h1>
        <p>
          You must view, read and accept the terms and conditions of C-Hero
          etraining in order to view your training classes.
        </p>
        <a
          href="https://www.c-hero.com/terms"
          target="_blank"
          rel="noreferrer"
          className="text-blue-700 underline hover:bg-gray-100"
        >
          View C-Hero Terms and Conditions
        </a>
        <span>(opens in new tab)</span>
        <div>
          <input type="checkbox" />
          <label>
            I have viewed and fully read the C-Hero terms and conditions, and I
            agree to the terms.
          </label>
        </div>
        <div>
          <button
            type="submit"
            onClick={() => acceptTermsMutation.mutate(userId)}
            className="bg-orange-400 hover:bg-gray-600 rounded-sm text-black"
          >
            Start Training
          </button>
        </div>
      </form>
    </div>
  );
};

TermsAndConditions.propTypes = {
  acceptTermsMutation: PropTypes.object,
  userId: PropTypes.string,
};

export default TermsAndConditions;
