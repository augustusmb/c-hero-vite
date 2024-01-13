import { PropTypes } from "prop-types";
import { useMutation } from "@tanstack/react-query";
import { acceptTermsAndConditions } from "../api/acceptTerms";

const TermsAndConditions = (props) => {
  const { userId } = props;

  const acceptTermsMutation = useMutation({
    mutationFn: (userId) => {
      acceptTermsAndConditions(userId);
    },
  });

  return (
    <div className="border-4 border-slate-500 bg-slate-200 px-8 py-8">
      <form>
        <h1 className="text-slate-950 text-2xl">
          C-Hero eTraining Terms and Condtions
        </h1>
        <p className="text-slate-700">
          You must view, read and accept the terms and conditions of C-Hero
          etraining in order to view your training classes.
        </p>
        <a
          href="https://www.c-hero.com/terms"
          target="_blank"
          rel="noreferrer"
          className="text-slate-950 font-semibold underline"
        >
          View C-Hero Terms and Conditions
        </a>
        <span> (opens in new tab)</span>
        <div>
          <button
            type="submit"
            disabled={!userId}
            onClick={() => acceptTermsMutation.mutate(userId)}
            className="mt-4 rounded border border-slate-500 bg-slate-700 px-3 py-1 font-semibold text-slate-050 hover:border-transparent hover:bg-slate-600 hover:text-slate-100"
          >
            I have viewed, read and agree to the C-Hero Terms -{" "}
            <span className="text-orange-300 underline">Start Training</span>
          </button>
        </div>
      </form>
    </div>
  );
};

TermsAndConditions.propTypes = {
  acceptTermsMutation: PropTypes.object,
  userId: PropTypes.number,
};

export default TermsAndConditions;
