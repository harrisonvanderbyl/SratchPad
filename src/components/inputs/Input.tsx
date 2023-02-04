import { HTMLInputTypeAttribute } from "react";
import "./input.scss";
export const InputField = <T extends string | number>({
  data: [value, setValue],
  type = "text",
  readonly = false,
}: {
  readonly?: boolean;
  type?: HTMLInputTypeAttribute | "textarea";
  data: [T, (value: T) => void];
}) => {
  return type === "textarea" ? (
    <textarea
      value={value}
      className={`input-field ${readonly ? "readonly" : ""}`}
      onChange={(e) => setValue(e.target.value as T)}
      readOnly={readonly}
      style={
        { width: "100%", height: "100%", "box-sizing": "border-box" } as any
      }
    />
  ) : (
    <input
      type={type !== "number" ? type : "text"}
      value={value}
      className={`input-field ${readonly ? "readonly" : ""}`}
      onChange={(e) => {
        console.log(e.target.valueAsNumber);
        console.log(e.target.value);
        console.log(Number(e.target.value));

        if (
          type === "number" &&
          (isNaN(Number(e.target.value)) ||
            e.target.value === "" ||
            e.target.value.endsWith("."))
        ) {
          const cleaned = e.target.value
            .replace(/[^0-9-.]/g, "")
            .split(".")
            .slice(0, 2)
            .join(".")
            .split("-")
            .slice(0, 2)
            .join("-") as T;

          setValue(cleaned);
        } else {
          setValue(
            (type === "number" ? Number(e.target.value) : e.target.value) as T
          );
        }
      }}
      readOnly={readonly}
    />
  );
};
