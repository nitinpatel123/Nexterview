import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Drop-in replacement for <input type="password" ... /> with a
 * show/hide eye toggle. Accepts the same props (className, value,
 * onChange, name, placeholder, required, minLength, etc.) and forwards
 * everything else via ...rest.
 */
const PasswordInput = ({ className = "", ...rest }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className={className}
        style={{ paddingRight: "2.5rem" }}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
};

export default PasswordInput;
